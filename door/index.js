const Mfrc522 = require("mfrc522-rpi");
const SoftSPI = require("rpi-softspi");
const rpio = require('rpio');
const config = require('./config');
const ButtonHandler = require("./functions/ButtonHandler");
const AllowedAcces = require("./functions/AllowedAcces");


//# This loop keeps checking for chips. If one is near it will get the UID and authenticate
console.log("scanning...");

const softSPI = new SoftSPI({
  clock: config.gpio.reader.clock, // pin number of SCLK
  mosi: config.gpio.reader.mosi, // pin number of MOSI
  miso: config.gpio.reader.miso, // pin number of MISO
  client: config.gpio.reader.client // pin number of CS
});

// enables the checkin button
rpio.open(config.gpio.button, rpio.INPUT, rpio.PULL_UP);

// enables the door controller pin
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
rpio.poll(config.gpio.button,ButtonHandler);


