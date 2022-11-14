const app = require("./app");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const { connected } = require("process");
const io = new Server(server);

// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 3000
const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log(`Server listening on http://localhost:${PORT}`);
// });

io.on("connection", (socket) => {
  console.log("a user connected");
});

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
  socket.on("add user", (id) => {
    const users = addUserConnected(id, socket.id);
    socket.emit("all users", users);
  });
});

// async function addUserConnected(userId, socketId) {
//   const foundUser = await Connected.findOne({ userId });
//   if (foundUser) {
//     foundUser.socketId = socketId;
//     await foundUser.save();
//   } else {
//     await Connected.create({ socketId, userId });
//   }
//   return await Connected.find().populate("userId");
// }

server.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});
