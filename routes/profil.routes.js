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

router.get("/update", isLoggedIn, (req, res, next) => {
  try {
    res.render("profile/profile-edit", { pagecss: "profile-edit.css" });
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
        //picture: req.file.path,
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

module.exports = router;
