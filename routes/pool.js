var mysql = require("mysql");
var pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  database: "books",
  password: "123",
  connectionLimit: 100, // optional
});

module.exports = pool;
