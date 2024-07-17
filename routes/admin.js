var express = require('express');
const pool = require('./pool');
var router = express.Router();
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

/* GET home page. */
router.get('/',function(req,res,next){
  res.render("admin/login",{ mesg: "" })
})

router.get('/dashboard', function(req, res, next) {
  try {
    let data = localStorage.getItem("ADMIN")
    data=JSON.parse(data)
    if(data.length>0)
    {
      res.render("admin/dashboard")
    }else{
      res.redirect("/admin/")
    }
  } catch (error) {
    res.redirect("/admin/")
  }
 
});

router.post("/checklogin",function(req,res,next){
  pool.query("Select * from admins where username=? and password=? ",[req.body.username,req.body.password],function(error,result){
    if(error)
    {
      res.render("admin/login",{mesg:"Server Error"})
    }else if (result.length>0){
      localStorage.setItem("ADMIN",JSON.stringify(result))
      res.render("admin/dashboard");
    }else{
      res.render("admin/login",{mesg:"Invalid ID/Password"})
    }
  })
});

router.get('/logout',function(req,res,next){
  localStorage.removeItem("ADMIN")
  res.redirect("/admin/")
})


module.exports = router;
