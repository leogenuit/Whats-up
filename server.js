const app = require("./app");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const { connected } = require("process");
const io = new Server(server);
const Connected = require("./models/Connected.model");
const Chatroom = require("./models/Chatroom.model");
const Message = require("./models/Message.model");

// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 3000
const PORT = process.env.PORT || 3000;

io.on("connection", (socket) => {
  socket.on("disconnect", async () => {
    const oneUser = await Connected.findOneAndDelete({ socketId: socket.id });
    //console.log(oneUser);
  });

  socket.on("add user", async (id) => {
    const users = await addUserConnected(id, socket.id);
    socket.emit("all users", users);
    //console.log(users);
  });

  socket.on("chatroom on", async (foreignId, userId) => {
    const chatroom = await openChatroom(foreignId, userId);
    socket.emit("all chatroom", chatroom);
    //console.log(userId);
  });

  socket.on("chat message", async (msg, id, foreignId) => {
    const message = await createNewMessage(msg, id, foreignId);
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

async function openChatroom(foreignId, userId) {
  if (!foreignId || !userId) return;
  const chatroom = await Chatroom.findOne({
    users: { $all: [foreignId, userId] },
  });
  if (chatroom) {
  } else {
    await Chatroom.create({ users: [foreignId, userId] });
  }
}

async function createNewMessage(msg, id, foreignId) {
  const getChatroom = await Chatroom.findOne({
    users: { $all: [foreignId, id] },
  }).populate("users");
  console.log(getChatroom._id);

  await Message.create({
    content: msg,
    author: id,
    chatroom: getChatroom._id,
  });
}

server.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});
