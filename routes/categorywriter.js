var express = require("express");
var router = express.Router();
const pool = require("./pool");
var upload = require("./multer");
router.get("/", function (req, res) {
  try {
    let data = localStorage.getItem("ADMIN")
    data=JSON.parse(data)
    if(data.length>0)
    {
      res.render("categorywriter/addcategorywriter", { mesg: "" });
    }else{
      res.redirect("/admin/")
    }
  } catch (error) {
    res.redirect("/admin/")
  }

});
router.post("/addcategorywriter", upload.single("picture"), function (req, res) {
  pool.query(
    "insert into categorywriter (publicationid,bookcategoryid,categorywritername,description,picture) values(?,?,?,?,?)",
    [
      req.body.publicationid,
      req.body.bookcategoryid,
      req.body.categorywritername,
      req.body.description,
      req.file.filename,
     
    ],
    function (error, result) {
      if (error) {
        console.log(error);
        res.render("categorywriter/addcategorywriter", { mesg: "server error" });
      } else {
        res.render("categorywriter/addcategorywriter", {
          mesg: "record submitted successfully",
        });
      }
    }
  );
});
router.get("/displaycategorywriter", function (req, res) {
  pool.query("select * from categorywriter", function (error, result) {
    if (error) {
      // /res.render("categorywriter/displaycategorywriter", { data: [] });
      res.status(500).json({data:''})
    } else {
      // res.render("categorywriter/displaycategorywriter", { data: result });
      res.status(200).json(result)
    }
  });
});

router.get("/displayJSONbybookid", function (req, res) {
    pool.query(
        "select * from categorywriter where bookcategoryid in (select bookcategoryid from books where bookid=?)",
        [req.query.aid],
        function (error, result) {
            if (error) {
                res.status(500).json({ status: false, error });
            } else {
                console.log(result)
                res.status(200).json({ status: true, data: result });
            }
        }
    );
});





router.get("/displayJSON", function (req, res) {
  pool.query(
    "select * from categorywriter where bookcategoryid=?",
    [req.query.bid],
    function (error, result) {
      if (error) {
        res.status(500).json({ status:false });
      } else {
        res.status(200).json({ status:true, data: result });
      }
    }
  );
});



router.get("/displaybyid", function (req, res) {
  pool.query(
    "select * from categorywriter where categorywriterid=?",
    [req.query.wid],
    function (error, result) {
      if (error) {
        // res.render("categorywriter/editcategorywriter", { data: {} });
        res.status(500).json({data:{}})
      } else console.log(result);
      {
        // res.render("categorywriter/editcategorywriter", { data: result[0] });
        res.status(200).json({data:result[0]})
      }
    }
  );
});
router.post("/editcategorywriter", function (req, res) {
  console.log(req.body);
  pool.query(
    "update categorywriter set publicationid=?,bookcategoryid=?,categorywritername=?,description=? where categorywriterid=?",
    [
      req.body.publicationid,
      req.body.bookcategoryid,
      req.body.categorywritername,
      req.body.description,
      req.body.categorywriterid,
    ],
    function (error, result) {
      if (error) {
        console.log(error);
        // res.redirect("/categorywriter/displaycategorywriter");
        res.status(500).json(false)
        
      } else {
        // res.redirect("/categorywriter/displaycategorywriter");
        res.status(200).json(true)
      }
    }
  );
});
router.get("/displaypicture", function (req, res) {
  pool.query(
    "select * from categorywriter where categorywriterid=?",
    [req.query.wid],
    function (error, result) {
      if (error) {
        res.render("categorywriter/editpicture", { data: {} });
      } else console.log(result);
      {
        res.render("categorywriter/editpicture", { data: result[0] });
      }
    }
  );
});
router.post("/editpicture", upload.single("picture"), function (req, res) {
  console.log(req.body);
  pool.query(
    "update categorywriter set picture=? where categorywriterid=?",
    [req.file.filename, req.body.categorywriterid],
    function (error, result) {
      if (error) {
        console.log(error);
        res.redirect("/categorywriter/displaycategorywriter");
      } else {
        res.redirect("/categorywriter/displaycategorywriter");
      }
    }
  );
});
router.get("/delete", function (req, res) {
  pool.query(
    "delete from categorywriter where categorywriterid=?",
    [req.query.wid],
    function (error, result) {
      if (error) {
        // res.redirect("/categorywriter/displaycategorywriter");
        res.status(500).json(false)
      } else {
        // res.redirect("/categorywriter/displaycategorywriter");
        
        res.status(200).json(true)
      }
    }
  );
});

module.exports = router;
