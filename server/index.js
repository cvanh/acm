const express = require("express");
const app = express();
const port = 8000;
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
require("dotenv");
var mysql = require("mysql");

const con = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});

con.connect(() => {
  console.log("database connected");
});

app.post("/check", jsonParser, async (req, res) => {
  // console.log(req.body.uid);

  // make a query to the db to ensure the user has the correct uid
  await con.query(
    `SELECT * FROM users WHERE uid = "${req.body.uid}" AND allowed = 0 AND active = 0;`,
    (error, results, fields) => {


      if (!results[0]) {
        // ok so no results from query send error with the correct status
        res.status(204).send(false);
      } else {
        // console.log(results[0]);


        let IsAuthenticated; // boolean, is the user allowed to have acces to the building
        if (results[0].allowed === 0) {
          // user has permission
          IsAuthenticated = true;
        } else {
          // user doesnt have permission
          IsAuthenticated = false;
        }
        // console.log(IsAuthenticated);

        con.query(`INSERT INTO logbook ('uid', 'date', 'point', 'status') VALUES ('${req.body.uid}', current_timestamp(), '0', '${IsAuthenticated}');`)

        // send the acces status
        res.status(200).send(IsAuthenticated);
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
