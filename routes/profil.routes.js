const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/", isLoggedIn, (req, res, next) => {
  res.render("profile/profile", {
    script: ["script", "socket"],
    pagecss: "profile.css",
  });
});

module.exports = router;
