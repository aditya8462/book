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
            res.render("bookcategory/addbookcategory", { mesg: "" });
        }else{
          res.redirect("/admin/")
        }
      } catch (error) {
        res.redirect("/admin/")
      }
    
});
router.post("/addbookcategory", upload.single("picture"), function (req, res) {
    pool.query(
        "insert into bookcategory (publicationid,bookcategoryname,description,picture) values(?,?,?,?)",
        [
            req.body.publicationid,
            req.body.bookcategoryname,
            req.body.description,
            req.file.filename,

        ],
        function (error, result) {
            if (error) {
                console.log(error);
                res.render("bookcategory/addbookcategory", { mesg: "server error" });
            } else {
                res.render("bookcategory/addbookcategory", {
                    mesg: "record submitted successfully",
                });
            }
        }
    );
});
router.get("/displaybookcategory", function (req, res) {
    pool.query("select * from bookcategory", function (error, result) {
        if (error) {
            res.render("bookcategory/displaybookcategory", { data: [] });
        } else {
            res.render("bookcategory/displaybookcategory", { data: result });
        }
    });
});

router.get("/displayJSON", function (req, res) {
    pool.query(
        "select * from bookcategory where publicationid=?",
        [req.query.pid],
        function (error, result) {
            if (error) {
                res.status(500).json({ status: false });
            } else {
                console.log(result)
                res.status(200).json({ status: true, data: result });
            }
        }
    );
});



router.get("/displaybyid", function (req, res) {
    pool.query(
        "select * from bookcategory where bookcategoryid=?",
        [req.query.bid],
        function (error, result) {
            if (error) {
                res.render("bookcategory/editbookcategory", { data: {} });
            } else console.log(result);
            {
                res.render("bookcategory/editbookcategory", { data: result[0] });
            }
        }
    );
});


router.get("/displayJSONbywriterid", function (req, res) {
    pool.query(
        "select * from bookcategory where publicationid in (select publicationid from categorywriter where categorywriterid=?)",
        [req.query.wid],
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

router.get("/displayJSONbybookid", function (req, res) {
    pool.query(
        "select * from bookcategory where publicationid in (select publicationid from books where bookid=?)",
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


router.post("/editbookcategory", function (req, res) {
    console.log(req.body);
    pool.query(
        "update bookcategory set publicationid=?,bookcategoryname=?,description=? where bookcategoryid=?",
        [
            req.body.publicationid,
            req.body.bookcategoryname,
            req.body.description,
            req.body.bookcategoryid,
        ],
        function (error, result) {
            if (error) {
                console.log(error);
                res.redirect("/bookcategory/displaybookcategory");
            } else {
                res.redirect("/bookcategory/displaybookcategory");
            }
        }
    );
});
router.get("/displaypicture", function (req, res) {
    pool.query(
        "select * from bookcategory where bookcategoryid=?",
        [req.query.bid],
        function (error, result) {
            if (error) {
                res.render("bookcategory/editpicture", { data: {} });
            } else console.log(result);
            {
                res.render("bookcategory/editpicture", { data: result[0] });
            }
        }
    );
});
router.post("/editpicture", upload.single("picture"), function (req, res) {
    console.log(req.body);
    pool.query(
        "update bookcategory set picture=? where bookcategoryid=?",
        [req.file.filename, req.body.bookcategoryid],
        function (error, result) {
            if (error) {
                console.log(error);
                res.redirect("/bookcategory/displaybookcategory");
            } else {
                res.redirect("/bookcategory/displaybookcategory");
            }
        }
    );
});
router.get("/delete", function (req, res) {
    pool.query(
        "delete from bookcategory where bookcategoryid=?",
        [req.query.bid],
        function (error, result) {
            if (error) {
                res.redirect("/bookcategory/displaybookcategory");
            } else {
                res.redirect("/bookcategory/displaybookcategory");
            }
        }
    );
});

module.exports = router;
