require("dotenv").config();
<<<<<<< HEAD
const mysql = require("mysql");
=======
const mysql = require("mysql2");
>>>>>>> 2fa92e80002f0479d45969a1847a25ae20e69a12

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
<<<<<<< HEAD
  database: process.env.DB_NAME,
=======
  database: process.env.DB_DATABASE,
>>>>>>> 2fa92e80002f0479d45969a1847a25ae20e69a12
});

connection.connect((err) => {
  if (err) {
    console.error(`Error connecting to Database ${err}`);
  } else {
<<<<<<< HEAD
    console.log(`Connected to ${process.env.DB_NAME} Database`);
=======
    console.log("Connected to MySql Database");
>>>>>>> 2fa92e80002f0479d45969a1847a25ae20e69a12
  }
});

module.exports = connection;
