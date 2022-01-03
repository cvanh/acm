const axios = require('axios');
const config = require('../config');

async function AllowedAcces(Formatteduid){
    axios.post(`http://${config.ServerIp}/checkuid`, {
      "uid": Formatteduid
    })
    .then(function (response) {
      console.log(response.data);
  
      if(response.data === true){
        // open door
        console.log("opening door")
        rpio.write(36, rpio.HIGH);
  
        rpio.sleep(100);
        rpio.write(36, rpio.LOW);
        rpio.msleep(500);
      }
  
  
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  module.exports = AllowedAcces