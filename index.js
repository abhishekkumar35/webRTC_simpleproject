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
    // console.log("sdpOffer", sdpOffer);
    socket.broadcast.emit("offer", sdpOffer);
  });
  socket.on("answer", (sdpAnswer) => {
    // console.log("sdpanswer", sdpAnswer);
    socket.broadcast.emit("answer", sdpAnswer);
  });
  socket.on("rcandidate", (candidate) => {
    if (candidate !== null) {
      socket.broadcast.emit("rcandidate", candidate);
      // console.log("rcandidate", candidate);
    }
  });
  socket.on("lcandidate", (candidate) => {
    if (candidate !== null) {
      socket.broadcast.emit("lcandidate", candidate);
      // console.log("lcandidate", candidate);
    }
  });
  // socket.on("candidate", (candidate) => {
  //   if (candidate !== null) {
  //     socket.broadcast.emit("candidate", candidate);
  //     // console.log("candidate", candidate);
  //   }
  // });
  socket.on("disconnect", () => {
    // UserDB.clients = UserDB.clients.filter((user) => {
    //   return user?.id !== socket.id;
    // });
    console.log("user-disconnected");
  });
});
