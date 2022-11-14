const express = require("express");
const router = express.Router();

/* GET test page */
router.get("/", (req, res, next) => {
  res.render("messages-test");
});

module.exports = router;
