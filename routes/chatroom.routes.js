const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/chatroom", isLoggedIn, (req, res, next) => {
  try {
    res.render("chatroom/chatroom", { pagecss: "chatroom.css" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
