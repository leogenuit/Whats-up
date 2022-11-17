const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/isLoggedIn");
const uploader = require("../config/cloudinary.config");
const User = require("../models/User.model");

router.get("/", isLoggedIn, (req, res, next) => {
  res.render("profile/profile", {
    script: ["script", "socket"],
    pagecss: "profile.css",
  });
});

router.post("/edit", async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.session.currentUser._id,
      req.body,

      {
        new: true,
      }
    );
    req.session.currentUser = updatedUser;
    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

router.get("/edit", isLoggedIn, (req, res, next) => {
  try {
    res.render("profile/edit", { pagecss: "profile-edit.css" });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/edit/picture",
  isLoggedIn,
  uploader.single("picture"),
  async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(
      req.session.currentUser._id,
      {
        picture: req.file.path,
      },
      { new: true }
    );
    req.session.currentUser = updatedUser;

    res.redirect("/");
  }
);

router.get("/:id/delete", async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect("/auth/signup");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
