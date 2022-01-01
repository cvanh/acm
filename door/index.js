const Mfrc522 = require("mfrc522-rpi");
const SoftSPI = require("rpi-softspi");
const axios = require('axios');
const rpio = require('rpio');
const config = require('./config');


//# This loop keeps checking for chips. If one is near it will get the UID and authenticate
console.log("scanning...");

const softSPI = new SoftSPI({
  clock: config.gpio.reader.clock, // pin number of SCLK
  mosi: config.gpio.reader.mosi, // pin number of MOSI
  miso: config.gpio.reader.miso, // pin number of MISO
  client: config.gpio.reader.client // pin number of CS
});
rpio.open(config.gpio.door, rpio.OUTPUT, rpio.LOW);




const mfrc522 = new Mfrc522(softSPI)

setInterval(async function() {
  // reset the door pin
  rpio.write(config.gpio.door, rpio.LOW);


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
  axios.post(`http://${config.ServerIp}/check`, {
    "uid": Formatteduid
  })
  .then(function (response) {
    // console.log(response.data);

    if(response.data === true){
      // open door
      console.log("opening door")
      rpio.write(config.gpio.door, rpio.HIGH);

      rpio.sleep(10);
      rpio.write(config.gpio.door, rpio.LOW);
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