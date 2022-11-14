const express = require("express");
const router = express.Router();
const User = require("../models/User.model");

router.get("/user/:id", async (req, res, next) => {
  try {
    const oneUser = await User.findById(req.params.id);
    console.log(req.params.id);

    res.redirect("profile/userProfile", { oneUser });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
