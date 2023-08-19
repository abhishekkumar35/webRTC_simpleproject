const socketServer = require("socket.io");
const cors = require("cors");
const express = require("express");
const path = require("path");

const UserDB = {
  clients: [],
};

const app = express();
const PORT = 8002 || process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const io = socketServer(
  app.listen(PORT, () => {
    console.log("listening to " + PORT);
  })
);
io.on("connection", (socket) => {
  UserDB.clients.push(socket.id);
  socket.broadcast.emit("new_connection", "yes");
  socket.on("offer", (sdpOffer) => {
    socket.broadcast.emit("offer", sdpOffer);
  });
  socket.on("answer", (sdpAnswer) => {
    socket.broadcast.emit("answer", sdpAnswer);
  });
  socket.on("candidate", (candidate) => {
    socket.broadcast.emit("candidate", candidate);
  });
  socket.on("disconnect", () => {
    UserDB.clients = UserDB.clients.filter((user) => {
      return user?.id !== socket.id;
    });
  });
});

// app.put("/update", (req, res) => {
//   const { name, id } = req.body;
//   if (!name && !id) {
//     res.send({ updated: false, message: "name or id missing" });
//     return;
//   }
//   const user = UserDB.clients.find((user) => {
//     return user.id === id || user.name === name;
//   });
//   if (user) {
//     user.name = name;
//     user.id = id;
//   }
//   res.send({
//     updated: true,
//     message: "user updated successfully",
//     data: user,
//   });
// });

// app.get("/users", (req, res) => {
//   res.send(UserDB.clients);
// });
