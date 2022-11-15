// https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event

document.addEventListener("DOMContentLoaded", () => {
  console.log("Whats-up JS imported successfully!");
});

let socket = io();
let messages = document.getElementById("messages");
let form = document.getElementById("form");
let input = document.getElementById("input");
let listUsers = document.querySelector(".allsroom");

const userId = form.dataset.id;

socket.on("connect", () => {
  const sessionID = socket.id;
  socket.emit("add user", userId);
  socket.emit("chatroom on", userId);
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
  //console.log(users);
  users.forEach((element) => {
    //console.log(element.user._id);
    //if (!element.user._id === res.locals.currentUser) {
    let div = document.createElement("div");
    div.dataset.id = element.user._id;
    console.log(div.dataset.id);
    div.classList.add("room", "flex");
    div.textContent = element.user.username;
    listUsers.appendChild(div);
    //}
  });
});

socket.on("delete user", (user) => {
  //console.log(user);
});
