require("dotenv").config();
require("./db");
const express = require("express");
const hbs = require("hbs");
const app = express();
require("./config")(app);

// Socket.io initialization
app.use((req, res, next) => {
  if (req.session.currentUser) {
    res.locals.currentUser = req.session.currentUser;
    res.locals.isLoggedIn = true;
  } else {
    console.log("pas de session on");
  }
  next();
});
const capitalize = require("./utils/capitalize");
const projectName = "Whats-up";

app.locals.appTitle = `${capitalize(projectName)} created with IronLauncher`;

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const testRoutes = require("./routes/test.routes");
app.use("/test", testRoutes);

const profileRoutes = require("./routes/profile.routes");
app.use("/", profileRoutes);

const chatroomRoutes = require("./routes/chatroom.routes");
app.use("/", chatroomRoutes);

const userRoutes = require("./routes/users.routes");
app.use("/", userRoutes);

require("./error-handling")(app);

module.exports = app;
