// https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event
document.addEventListener("DOMContentLoaded", () => {
  console.log("Whats-up JS imported successfully!");
});

let socket = io();
var messages = document.getElementById("messages");
var form = document.getElementById("form");
var input = document.getElementById("input");
const userId = form.dataset.id;

socket.on("connect", () => {
  const sessionID = socket.id;
  console.log(socket.id);
  socket.emit("add user", userId);
  console.log(userId);
  // socket.emit("delete user", userId);
  // socket.on("disconnect", () => {
  //   console.log("disconnected");
  //   socket.emit("delete user", userId);
  // });
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit("chat message", input.value);
    input.value = "";
  }
});

socket.on("chat message", function (msg) {
  let item = document.createElement("li");
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on("all users", (users) => {
  console.log(users);
});

socket.on("delete user", (user) => {
  //console.log(user);
});
