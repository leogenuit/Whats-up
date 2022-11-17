// https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event

document.addEventListener("DOMContentLoaded", () => {
  console.log("Whats-up JS imported successfully!");
});
const allRooms = document.querySelector(".allsroom");
const dedicatedRoom = document.querySelector(".dedicatedRoom");
const messageTemplate = document.getElementById("message-template");
const messagesContainer = document.querySelector(".messages");

let socket = io();
//let messages = document.querySelector(".messages");
let form = document.getElementById("form");
let input = document.getElementById("input");
let listUsers = document.querySelector(".connected");
let listUsersNotConnected = document.querySelector(".disconnected");

const userId = form.dataset.id;

socket.on("connect", () => {
  const sessionID = socket.id;
  socket.emit("add user", userId);
  socket.emit("get user", userId);
  //socket.emit("chatroom on", userId);
  //socket.emit("get chatroom", userId);
});

socket.on("all users", (users, notConnectUsers) => {
  listUsers.innerHTML = "";
  listUsersNotConnected.innerHTML = "";
  //console.log(users);
  users.forEach((element) => {
    let div = document.createElement("div");
    div.classList.add("room", "flex");
    div.dataset.id = element.user._id;
    div.textContent = element.user.username;
    listUsers.appendChild(div);

    div.addEventListener("click", function (e) {
      e.preventDefault();
      socket.emit("chatroom on", div.dataset.id, userId);
      socket.emit("get messages", userId, div.dataset.id);
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (input.value) {
        socket.emit("chat message", input.value, userId, div.dataset.id);
        input.value = "";
      }
    });
  });

  notConnectUsers.forEach((element) => {
    let div = document.createElement("div");
    div.classList.add("room", "flex", "grey");
    div.dataset.id = element._id;
    div.textContent = element.username;
    listUsersNotConnected.appendChild(div);

    div.addEventListener("click", function (e) {
      e.preventDefault();
      socket.emit("some room", div.dataset.id, userId);
      socket.emit("get messages", div.dataset.id, userId);
    });
  });
});

socket.on("all messages", function (msg) {
  allRooms.classList.add("hidden");
  listUsersNotConnected.classList.add("hidden");
  dedicatedRoom.classList.remove("hidden");
  messagesContainer.innerHTML = "";
  msg.forEach((element) => {
    formatMessage(element);
  });
});

socket.on("chat message", function (msg) {
  formatMessage(msg);
});

socket.on("delete user", (user) => {
  //console.log(user);
});

function formatMessage(element) {
  const clone = messageTemplate.content.cloneNode(true);
  clone.querySelector("img").href = element.author.picture;
  clone.querySelector("p").textContent = element.content;
  clone.querySelector("small").textContent = element.createdAt;
  messagesContainer.append(clone);
}
