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
const axios = require("axios");

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

  io.of("/").adapter.on("join-room", (room, id) => {
    console.log(`socket ${id} has joined room ${room}`);
  });
  socket.on("chatroom on", async (foreignId, userId) => {
    const chatroom = await openChatroom(foreignId, userId);
    console.log("heeeey");
    socket.emit("one chatroom", chatroom);
  });

  socket.on("some room", async (foreignId, userId) => {
    const chatroom = await getChatroom(foreignId, userId);
    socket.emit("off chatroom", chatroom);
    //console.log(chatroom);
  });

  socket.on("chat message", async (msg, id, foreignId, room) => {
    console.log(foreignId);
    const receiver = await fetchSocket(foreignId);
    const message = await createNewMessage(msg, id, foreignId);
    console.log(message);
    //io.to(receiver).emit("chat message", message);
    io.emit("chat message", { message, foreignId });
  });

  // socket.on("private message", async (id, foreignId, msg) => {
  //   console.log(msg);
  //   const message = await createNewMessage(id, foreignId, msg);
  //   io.emit("private message", message);
  // });

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
    return chatroom;
  } else {
    const created = await Chatroom.create({ users: [foreignId, userId] });
    return created;
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
  return await Message.findById(createdMessage.id).populate("author");
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

async function fetchSocket(id) {
  const rawRes = await axios.get("http://localhost:3000/socket/" + id);
  return rawRes.data.socketId;
}

server.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});
