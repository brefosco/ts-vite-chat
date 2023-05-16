import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
// ...
const app = express();
app.use(cors()); // use cors middleware

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    // allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

const users: Record<string, string> = {}; // {socketId: username}
let userSockets: Record<string, string> = {}; // Key is username, value is socket id

io.on("connection", (socket) => {
  console.log("a user connected");

  // When a user sets their username
  socket.on("set_username", (username: string) => {
    users[socket.id] = username;
    userSockets[username] = socket.id;
    io.emit("users", users); // Broadcast the updated user list
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    delete users[socket.id]; // Remove the disconnected user
    io.emit("users", users); // Broadcast the updated user list
  });

  socket.on("chat message", (msg: string) => {
    const username = users[socket.id];
    io.emit("chat message", {
      author: username,
      text: msg,
      timestamp: Date.now(),
    });
  });

  //   socket.on("private message", ({ recipient, text }, callback) => {
  //     const sender = users[socket.id];
  //     const recipientSocketId = userSockets[recipient];
  //     if (recipientSocketId) {
  //       io.to(recipientSocketId).emit("private message", {
  //         author: sender,
  //         text,
  //         timestamp: Date.now(),
  //       });
  //       callback();
  //     } else {
  //       callback("Recipient not found");
  //     }
  //   });
});

httpServer.listen(3000, () => {
  console.log("listening on *:3000");
});
