const mysql = require("mysql");
const con = mysql.createConnection({
  host: "23.106.120.176",
  user: "thundertechsol_mab",
  password: "MABuser123$",
  database: "thundertechsol_MabSolution",
  port: 3306,
});
con.connect(function (err) {
  if (err) {
    console.log("connection failed!");
    console.log("Error!", err);
    throw err;
  }
  console.log("Connected!");
});
module.exports = con;
