// https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event

document.addEventListener("DOMContentLoaded", () => {
  console.log("Whats-up JS imported successfully!");
});
const allRooms = document.querySelector(".allsroom");
const dedicatedRoom = document.querySelector(".dedicatedRoom");
const messageTemplate = document.getElementById("message-template");
const messagesContainer = document.querySelector("ul.messages");

let socket = io();
let messages = document.querySelector("ul");
let form = document.getElementById("form");
let input = document.getElementById("input");
let listUsers = document.querySelector(".allsroom");

const userId = form.dataset.id;

socket.on("connect", () => {
  const sessionID = socket.id;
  socket.emit("add user", userId);
  socket.emit("chatroom on", userId);
});

socket.on("all users", (users) => {
  //console.log(users);
  users.forEach((element) => {
    let a = document.createElement("a");
    a.classList.add("room", "flex");
    a.dataset.id = element.user._id;
    a.textContent = element.user.username;
    listUsers.appendChild(a);
    a.addEventListener("click", function (e) {
      e.preventDefault();
      console.log(a.dataset.id);
      socket.emit("chatroom on", a.dataset.id, userId);
      socket.emit("get messages", userId, a.dataset.id);
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (input.value) {
        socket.emit("chat message", input.value, userId, a.dataset.id);
        input.value = "";
      }
    });
  });
});

socket.on("all messages", function (msg) {
  allRooms.classList.add("hidden");
  dedicatedRoom.classList.remove("hidden");

  msg.forEach((element) => {
    formatMessage(element);
    // console.log(element.content);

    // console.log(element.author.username);
  });
});

socket.on("chat message", function (msg) {
  formatMessage(msg);
  // let item = document.createElement("li");
  // item.textContent = msg;
  // messages.appendChild(item);
  // window.scrollTo(0, document.body.scrollHeight);
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
