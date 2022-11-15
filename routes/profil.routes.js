const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/", isLoggedIn, (req, res, next) => {
  try {
    res.render("profile/profile", { pagecss: "profile.css" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
