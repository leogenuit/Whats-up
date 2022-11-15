const app = require("./app");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const { connected } = require("process");
const io = new Server(server);
const Connected = require("./models/Connected.model");

// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 3000
const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log(`Server listening on http://localhost:${PORT}`);
// });

// io.on("connection", (socket) => {
//   console.log("a user connected");
//   socket.on("disconnect", async () => {
//     console.log("disconnected");
//     console.log(socket.id);
//     const oneUser = await Connected.findOneAndDelete({ socketId: socket.id });
//     console.log(oneUser);
//   });
// });

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", async () => {
    console.log("disconnected");
    console.log(socket.id);
    const oneUser = await Connected.findOneAndDelete({ socketId: socket.id });
    console.log(oneUser);
  });

  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
  socket.on("add user", async (id) => {
    const users = await addUserConnected(id, socket.id);
    socket.emit("all users", users);
    //console.log(users);
  });
  // socket.on("delete user", async (id) => {
  //   const oneUser = await deleteUserConnected(id);
  //   socket.emit("deconnectedUser", oneUser);
  //   //console.log(oneUser);
  // });
});

async function addUserConnected(userId, socketId) {
  const foundUser = await Connected.findOne({ user: userId });
  if (foundUser) {
    foundUser.socketId = socketId;
    await foundUser.save();
  } else {
    await Connected.create({ socketId, user: userId });
  }
  return await Connected.find().populate("user");
}

// async function deleteUserConnected(userId) {
//   const oneUser = await Connected.findOneAndDelete({ user: userId });
//   console.log(oneUser);
//   //await Connected.findOneAndRemove({});
// }

server.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});
