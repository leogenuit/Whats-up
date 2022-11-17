const express = require("express");
const session = require("express-session");
const router = express.Router();
const User = require("../models/User.model");

router.get("/users/all", async (req, res) => {
  const user = await User.find();
  res.render("all-users", { user });
});

router.get("/users/search", async (req, res) => {
  const { username } = req.query;
  const filterUser = await User.findOne({ username });
  console.log(filterUser);
  res.render("profile/profile", {
    foundUser: filterUser,
    script: ["script", "socket"],
    pagecss: "profile.css",
  });
});

router.post("/users/:id/add", async (req, res, next) => {
  try {
    const friend = await User.findById(req.params.id);
    if (friend) {
      await User.findOneAndUpdate(
        {
          _id: req.session.currentUser._id,
          friends: { $not: { $elemMatch: { friend: friend._id } } },
        },
        {
          $push: { friends: { friend: friend._id } },
        }
      );
    }
    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

router.get("/users/friends", async (req, res, next) => {
  try {
    const oneUser = await User.findById(req.session.currentUser._id).populate(
      "friends.friend"
    );
    console.log(oneUser.friends);
    res.render("friendsList", { oneUser });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
