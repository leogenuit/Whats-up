const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/isLoggedIn");
const uploader = require("../config/cloudinary.config");
const User = require("../models/User.model");
const Connected = require("../models/Connected.model");

router.get("/", isLoggedIn, (req, res, next) => {
  res.render("profile/profile", {
    script: ["script", "socket"],
    pagecss: "profile.css",
  });
});

router.get("/edit/picture", isLoggedIn, (req, res, next) => {
  try {
    res.render("profile/edit-picture", { pagecss: "profile-edit.css" });
  } catch (error) {
    next(error);
  }
});

// add form to update an image
router.post(
  // vers la route update
  "/update",
  // verifie si le user est log
  isLoggedIn,

  uploader.single("picture"),
  async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(
      // get le currentuser via l'id
      req.session.currentUser._id,
      {
        // get le path de la picture
        picture: req.file.path,
      },
      // valide immédiatement le changement
      { new: true }
    );
    // update
    req.session.currentUser = updatedUser;
    // redirection un fois terminé
    res.redirect("/");
  }
);

router.get("/edit/username", async (req, res, next) => {
  try {
    //const user = await User.findById(req.params.id);

    res.render("profile/edit-username");
  } catch (error) {
    next(error);
  }
});

router.post("/edit/username", async (req, res, next) => {
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

router.get("/socket/:id", async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  const user = await Connected.findOne({ user: id });
  console.log(user);
  return res.json(user);
});
module.exports = router;
