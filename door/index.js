const Mfrc522 = require("mfrc522-rpi");
const SoftSPI = require("rpi-softspi");
const axios = require('axios');
var rpio = require('rpio');
//# This loop keeps checking for chips. If one is near it will get the UID and authenticate
console.log("scanning...");

const softSPI = new SoftSPI({
  clock: 23, // pin number of SCLK
  mosi: 19, // pin number of MOSI
  miso: 21, // pin number of MISO
  client: 24 // pin number of CS
});
rpio.open(36, rpio.OUTPUT, rpio.LOW);




// GPIO 24 can be used for buzzer bin (PIN 18), Reset pin is (PIN 22).
// I believe that channing pattern is better for configuring pins which are optional methods to use.
const mfrc522 = new Mfrc522(softSPI).setResetPin(22).setBuzzerPin(18);

setInterval(async function() {
  // reset the door pin
  rpio.write(36, rpio.LOW);


  //# reset card
  mfrc522.reset();

  //# Scan for cards
  let response = mfrc522.findCard();
  if (!response.status) {
    // console.log("No Card");
    return;
  }

  //# Get the UID of the card
  response = mfrc522.getUid();
  if (!response.status) {
    console.log("UID Scan Error");
    return;
  }
  const uid = response.data;

  const Formatteduid =  
  uid[0].toString(16) +
  uid[1].toString(16) +
  uid[2].toString(16) +
  uid[3].toString(16);

  console.log("uiduid: " + Formatteduid)
  await AllowedAcces(Formatteduid)

  //# Stop
  mfrc522.stopCrypto();
}, 500);


async function AllowedAcces(Formatteduid){
  axios.post('http://192.168.178.98:8000/check', {
    "uid": Formatteduid
  })
  .then(function (response) {
    // console.log(response.data);

    if(response.data === true){
      // open door
      console.log("opening door")
      rpio.write(36, rpio.HIGH);

      rpio.sleep(10);
      rpio.write(36, rpio.LOW);
      rpio.msleep(500);
    }


  })
  .catch(function (error) {
    console.log(error);
  });
}

// /*
//  * Set the initial state to low.  The state is set prior to the pin
//  * being actived, so is safe for devices which require a stable setup.
//  */
// rpio.open(36, rpio.OUTPUT, rpio.LOW);

// /*
//  * The sleep functions block, but rarely in these simple programs does
//  * one care about that.  Use a setInterval()/setTimeout() loop instead
//  * if it matters.
//  */
// for (var i = 0; i < 5; i++) {
//         /* On for 1 second */
//         rpio.write(36, rpio.HIGH);
//         rpio.sleep(1);

//         /* Off for half a second (500ms) */
//         rpio.write(36, rpio.LOW);
//         rpio.msleep(500);
// }