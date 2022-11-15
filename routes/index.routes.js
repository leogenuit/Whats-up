const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/isLoggedIn");

//* GET home page */
//router.get("/", isLoggedIn, (req, res, next) => {
//<<<<<<< connectedTable
  //res.redirect("/profile");
  //res.redirect("/auth/signup");
//=======
  //res.render("", {
    //script: ["script", "socket"],
  //});
//>>>>>>> main
//});

module.exports = router;
