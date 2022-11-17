const express = require("express");
const router = express.Router();
const User = require("../models/User.model");

router.get("/users/all", async (req, res) => {
  const user = await User.find();
  res.render("all-users", { user });
});

router.get("/users/search", async (req, res) => {
  const { username } = req.query;
  const filterUser = await User.find({ username });
  res.render("one-user", { user: filterUser });
});

module.exports = router;
