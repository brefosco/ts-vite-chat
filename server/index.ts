import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { ExtendedSocket } from "./types";
import { handleSession } from "./sessionHandling";
import { handleMessage } from "./messageHandling";

// Import controllers
import * as sessionController from "./controllers/sessionController";
import * as messageController from "./controllers/messageController";
import * as chatMessageController from "./controllers/chatMessageController";

const app = express();
app.use(cors()); // Use CORS middleware

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

handleSession(io); // No need to pass the session store
handleMessage(io); // No need to pass the message stores

const roomName = "permanent";
io.on("connection", (socket: ExtendedSocket) => {
  console.log("a user connected");

  // Automatically join the "permanent" room on connection
  socket.join(roomName);
  console.log(`User ${socket.userID} has joined room ${roomName}`);

  // Broadcast to other clients in the room that a new user has joined
  socket.to(roomName).emit("user-joined-room", socket.userID);

  const chatMessages = chatMessageController.getAllChatMessages();
  socket.emit("chat messages", chatMessages);

  const privateMessages = messageController.getMessagesForUser(socket.userID!);
  socket.emit("private messages", privateMessages);

  socket.on("users", (callback) => {
    const users = sessionController.getAllSessions().filter(
      (session) => session.connected
    );
    callback(users);
  });

  socket.emit("session", {
    sessionID: socket.sessionID,
    userID: socket.userID,
    username: socket.username,
  });

  socket.on("error", (error) => {
    console.log(error);
  });
});

httpServer.listen(3000, () => {
  console.log("listening on *:3000");
});
