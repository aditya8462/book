var express = require("express");
var router = express.Router();
var pool = require("./pool");
var upload = require("./multer");

/* GET home page. */
router.get("/", function (req, res, next) {
  
  try {
    let data = localStorage.getItem("ADMIN")
    data=JSON.parse(data)
    if(data.length>0)
    {
      res.render("publication/addpublication", { msg: "" });
    }else{
      res.redirect("/admin/")
    }
  } catch (error) {
    res.redirect("/admin/")
  }
  
  
  
  
  
 
});



router.post("/submitpublication", upload.single("picture"), function (req, res, next) {
    console.log(req.body);
    console.log(req.file);
    pool.query(
      "insert into publication(publicationname,picture) values(?,?)",
      [req.body.publicationname, req.file.filename],
      function (err, result) {
        if (err) {
          res.render("publication/addpublication", { msg: "Record not submitted" });
        } else {
          res.render("publication/addpublication", { msg: "Record submitted" });
        }
      }
    );
  });
  
  router.get("/displayallpublication", function (req, res, next) {
    pool.query("select * from publication", function (err, result) {
      if (err) {
        res.render("publication/displayallpublication", { data: [] });
      } else {
        res.render("publication/displayallpublication", { data: result });
      }
    });
  });
  
  router.get("/displayJSON", function (req, res, next) {
    pool.query("select * from publication", function (err, rslt) {
      if (err) {
        res.status(500).json({ status: false });
      } else {
        res.status(200).json({ status: true, data: rslt });
      }
    });
  });
  
  router.get("/displaybyid", function (req, res, next) {
    console.log(req.query);
    pool.query(
      "select * from publication where publicationid = ?",
      [req.query.pid],
      function (err, result) {
        if (err) {
          res.render("publication/editpublication", { data: {} });
        } else {
          console.log(result[0]);
          res.render("publication/editpublication", { data: result[0] });
        }
      }
    );
  });
  
  router.post("/updatepublication", function (req, res) {
    console.log(req.body);
    pool.query(
      "update publication set publicationname=? where publicationid=?",
      [req.body.publicationname, req.body.publicationid],
      function (err, result) {
        if (err) {
          res.redirect("/publication/displayallpublication");
        } else {
          res.redirect("/publication/displayallpublication");
        }
      }
    );
  });
  
  router.get("/delete", function (req, res) {
    console.log(req.query);
    pool.query(
      "delete from publication where publicationid=?",
      [req.query.pid],
      function (err, result) {
        if (err) {
          res.redirect("/publication/displayallpublication");
        } else {
          res.redirect("/publication/displayallpublication");
        }
      }
    );
  });
  
  router.get("/displaypicture", function (req, res, next) {
    console.log(req.query);
    pool.query(
      "select * from publication where publicationid = ?",
      [req.query.pid],
      function (err, result) {
        if (err) {
          res.render("publication/editpicture", { data: {} });
        } else {
          console.log(result[0]);
          res.render("publication/editpicture", { data: result[0] });
        }
      }
    );
  });
  
  router.post("/updatepicture", upload.single("picture"), function (req, res) {
    console.log(req.body);
    pool.query(
      "update publication set picture=? where publicationid=?",
      [req.file.filename, req.body.publicationid],
      function (err, result) {
        if (err) {
          res.redirect("/publication/displayallpublication");
        } else {
          res.redirect("/publication/displayallpublication");
        }
      }
    );
  });
  











module.exports = router;
