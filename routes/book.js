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
            res.render("book/addbook", { mesg: "" });
        }else{
          res.redirect("/admin/")
        }
      } catch (error) {
        res.redirect("/admin/")
      }
    
});
router.post("/addbook", upload.single("picture"), function (req, res) {
    pool.query(
        "insert into books (publicationid, bookcategoryid, categorywriterid, bookname, description, launchedinyear, noofpages, price, offerprice, stock, picture, status) values(?,?,?,?,?,?,?,?,?,?,?,?)",
        [
            req.body.publicationid,
            req.body.bookcategoryid,
            req.body.categorywriterid,
            req.body.bookname,
            req.body.description,
            req.body.launchedinyear,
            req.body.noofpages,
            req.body.price,
            req.body.offerprice,
            req.body.stock,
            req.file.filename,
            req.body.status

        ],
        function (error, result) {
            if (error) {
                console.log(error);
                res.render("book/addbook", { mesg: "server error" });
            } else {
                res.render("book/addbook", {
                    mesg: "record submitted successfully",
                });
            }
        }
    );
});
router.get("/displaybook", function (req, res) {
    pool.query("select * from books", function (error, result) {
        if (error) {
            res.render("book/displaybook", { data: [] });
        } else {
            res.render("book/displaybook", { data: result });
        }
    });
});

router.get("/displayJSON", function (req, res) {
    pool.query("select * from books", function (error, result) {
        if (error) {
            res.status(500).json({ status: false });
        } else {

            res.status(200).json({ status: true, data: result });
        }
    }
    );
});



router.get("/displaybyid", function (req, res) {
    console.log(req.query.aid)
    pool.query(
        "select * from books where bookid=?",
        [req.query.aid],
        function (error, result) {
            if (error) {
                res.render("book/editbook", { data: {} });
            } else console.log(result);
            {
                res.render("book/editbook", { data: result[0] });
            }
        }
    );
});
router.post("/updatebook", function (req, res) {
    console.log(req.body);
    pool.query("update books set publicationid=?, bookcategoryid=?, categorywriterid=?, bookname=?, description=?, launchedinyear=?, noofpages=?, price=?, offerprice=?, stock=?,status=? where bookid=?",
        [ req.body.publicationid, req.body.bookcategoryid,req.body.categorywriterid,req.body.bookname, req.body.description,req.body.launchedinyear,req.body.noofpages,req.body.price,req.body.offerprice,req.body.stock,req.body.status,req.body.bookid ],
        function (error, result) {
            if (error) {
                console.log(error);
                res.redirect("/book/displaybook");
            } else {
                console.log(result)
                res.redirect("/book/displaybook");
            }
        }
    );
});
router.get("/displaypicture", function (req, res) {
    pool.query(
        "select * from books where bookid=?",
        [req.query.aid],
        function (error, result) {
            if (error) {
                res.render("book/editpicture", { data: {} });
            } else console.log(result);
            {
                res.render("book/editpicture", { data: result[0] });
            }
        }
    );
});
router.post("/editpicture", upload.single("picture"), function (req, res) {
    console.log(req.body);
    pool.query(
        "update books set picture=? where bookid=?",
        [req.file.filename, req.body.bookid],
        function (error, result) {
            if (error) {
                console.log(error);
                res.redirect("/book/displaybook");
            } else {
                res.redirect("/book/displaybook");
            }
        }
    );
});
router.get("/delete", function (req, res) {
    pool.query(
        "delete from books where bookid=?",
        [req.query.aid],
        function (error, result) {
            if (error) {
                res.redirect("/book/displaybook");
            } else {
                res.redirect("/book/displaybook");
            }
        }
    );
});

router.get("/displayJSONbybookcategoryid", function (req, res) {
    pool.query(
        "select * from books where bookcategoryid =?",
        [req.query.bid],
        function (error, result) {
            if (error) {
                res.status(500).json({ status: false });
            } else {
                res.status(200).json({ status: true, data: result });
            }
        }
    );
});


router.get("/displayJSONbycategorywriterid", function (req, res) {
    pool.query(
        "select * from books where categorywriterid =?",
        [req.query.wid],
        function (error, result) {
            if (error) {
                res.status(500).json({ status: false });
            } else {
                res.status(200).json({ status: true, data: result });
            }
        }
    );
});

router.get('/searchbooks', function (req, res) {
    pool.query("select * from books where(bookname like '%" + req.query.search + "%' or description like '%" + req.query.search + "%' or publicationid in (select publicationid from publication where publicationname like '%" + req.query.search + "%') or bookcategoryid in (select bookcategoryid from bookcategory where bookcategoryname like '%" + req.query.search + "%') or categorywriterid in (select categorywriterid from categorywriter where categorywritername like '%" + req.query.search + "%')) and stock>0", function (err, result) {
        if (err) {
            res.status(500).json({ status: false })
        }
        else {
            res.status(200).json({ status: true, data: result })
        }
    })
})


module.exports = router;
