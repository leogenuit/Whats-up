const app = require("./app");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const { connected } = require("process");
const io = new Server(server);
const Connected = require("./models/Connected.model");
const Chatroom = require("./models/Chatroom.model");

//const connectedUsersId

// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 3000
const PORT = process.env.PORT || 3000;

io.on("connection", (socket) => {
  //console.log("a user connected");
  socket.on("disconnect", async () => {
    //console.log("disconnected");
    //console.log(socket.id);
    const oneUser = await Connected.findOneAndDelete({ socketId: socket.id });
    console.log(oneUser);
  });

  socket.on("add user", async (id) => {
    const users = await addUserConnected(id, socket.id);
    socket.emit("all users", users);
    //console.log(users);
  });

  socket.on("chatroom on", async (id) => {
    const chatroom = await openChatroom(id, socket.id);
    socket.emit("all chatroom", chatroom);
    //console.log(users);
  });

  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
});

async function addUserConnected(userId, socketId) {
  const foundUser = await Connected.findOne({ user: userId });
  if (foundUser) {
    foundUser.socketId = socketId;
    await foundUser.save();
  } else {
    await Connected.create({ socketId, user: userId });
  }
  return await Connected.find({ user: { $ne: userId } }).populate("user");
}

async function openChatroom(userId, socketId) {
  console.log(`chat : ${userId}`);
}

server.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});
