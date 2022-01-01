const express = require("express");
const app = express();
const port = 8000;
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
require("dotenv");
var mysql = require("mysql");

const con = mysql.createConnection({
  host: "192.168.178.57",
  user: "cvanh",
  password: "kaas",
  database: "doorbell",
});

con.connect(() => {
  console.log("database connected");
});

app.post("/check", jsonParser, async (req, res) => {
  console.log(req.body.uid);
  await con.query(
    `SELECT * FROM users WHERE uid = "${req.body.uid}" AND allowed = 0 AND active = 0;`,
    (error, results, fields) => {
      // no results from query
      if (!results[0]) {
        res.status(204).send(false);
      } else {
        console.log(results[0]);
        let IsAuthenticated;
        if (results[0].allowed === 0) {
          // user has permission
          IsAuthenticated = true;
        } else {
          // user doesnt have permission
          IsAuthenticated = false;
        }
        console.log(IsAuthenticated);

        // send the data
        res.status(200).send(IsAuthenticated);
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
