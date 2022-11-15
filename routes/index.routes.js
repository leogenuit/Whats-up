const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/isLoggedIn");

/* GET home page */
router.get("/", isLoggedIn, (req, res, next) => {
  res.redirect("/profile");
  //res.redirect("/auth/signup");
});

module.exports = router;
