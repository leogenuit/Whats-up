// https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event

document.addEventListener("DOMContentLoaded", () => {
  console.log("Whats-up JS imported successfully!");
});

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

socket.on("chat message", function (msg) {
  msg.forEach((element) => {
    console.log(element);
  });
  let item = document.createElement("li");
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on("delete user", (user) => {
  //console.log(user);
});
