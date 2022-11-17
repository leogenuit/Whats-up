const app = require("./app");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
//const { connected } = require("process");
const io = new Server(server);
const Connected = require("./models/Connected.model");
const Chatroom = require("./models/Chatroom.model");
const Message = require("./models/Message.model");
const User = require("./models/User.model");

// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 3000
const PORT = process.env.PORT || 3000;

io.on("connection", (socket) => {
  socket.on("disconnect", async () => {
    const oneUser = await Connected.findOneAndDelete({ socketId: socket.id });
  });

  socket.on("add user", async (id) => {
    const [notConnectUsers, users] = await addUserConnected(id, socket.id);
    socket.emit("all users", users, notConnectUsers);
  });

  socket.on("get user", async (id) => {
    const users = await getUsers(id);
    socket.emit("all users disconnected", users);
  });

  socket.on("chatroom on", async (foreignId, userId) => {
    const chatroom = await openChatroom(foreignId, userId);
    socket.emit("all chatroom", chatroom);
  });

  socket.on("some room", async (foreignId, userId) => {
    const chatroom = await getChatroom(foreignId, userId);
    socket.emit("off chatroom", chatroom);
    console.log(chatroom);
  });

  socket.on("chat message", async (msg, id, foreignId) => {
    const message = await createNewMessage(msg, id, foreignId);
    io.emit("chat message", message);
  });

  socket.on("get messages", async (id, foreignId) => {
    const messages = await getAllMessages(id, foreignId);
    io.emit("all messages", messages);
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
  const notConnectUsers = await User.aggregate([
    {
      $lookup: {
        from: "connecteds",
        localField: "_id",
        foreignField: "user",
        as: "result",
      },
    },
    {
      $match: {
        result: {
          $size: 0,
        },
      },
    },
  ]);
  const connected = await Connected.find({ user: { $ne: userId } }).populate(
    "user"
  );
  return [notConnectUsers, connected];
}

async function getUsers(userId) {
  const foundAllUser = await User.findOne({ user: userId });
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

async function getChatroom(foreignId, userId) {
  const greyChatroom = await Chatroom.findOne({
    users: { $all: [foreignId, userId] },
  });
  return greyChatroom;
}

async function createNewMessage(msg, id, foreignId) {
  const getChatroom = await Chatroom.findOne({
    users: { $all: [foreignId, id] },
  }).populate("users");

  const createdMessage = await Message.create({
    content: msg,
    author: id,
    chatroom: getChatroom._id,
  });
  return await Message.findById(createdMessage.id);
}

async function getAllMessages(id, foreignId) {
  const getChatroom = await Chatroom.findOne({
    users: { $all: [id, foreignId] },
  }).populate("users");

  const allMessages = await Message.find({
    chatroom: getChatroom.id,
  }).populate("author");

  return allMessages;
}

server.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});
