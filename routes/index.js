var express = require('express');
var router = express.Router();
var pool = require("./pool");

/* GET home page. */
router.get("/", function (req, res, next) {
  pool.query("select * from publication", (err, result) => {
    if (err) {
      res.render("user/homepage", { data: [] });
    } else {
      console.log(result)
      res.render("user/homepage", { data: result });
    }
  });
});

module.exports = router;
