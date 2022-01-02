const config = require('../config');
const rpio = require('rpio');

// note 1 is released 0 is pressed
function ButtonHandler(){
    console.log("h")
    var state = rpio.read(config.gpio.button);
    console.log(state)

}

module.exports = ButtonHandler