const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("profile/profile", { pagecss: "profile.css" });
});

module.exports = router;
