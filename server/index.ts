import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { SessionStore } from "./stores/sessionStore";
import { MessageStore } from "./stores/messageStore";
import { ChatMessageStore } from "./stores/chatMessageStore";
import { ExtendedSocket } from "./types";
import { handleSession } from "./sessionHandling";
import { handleMessage } from "./messageHandling";

const app = express();
app.use(cors()); // use cors middleware

const httpServer = createServer(app);
const sessionStore = new SessionStore();
const messageStore = new MessageStore();
const chatMessageStore = new ChatMessageStore();

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

handleSession(io, sessionStore);

handleMessage(io, sessionStore, messageStore, chatMessageStore);

const roomName = "permanent";
io.on("connection", (socket: ExtendedSocket) => {
  // const roomUsers = {}; // object to keep track of number of users in each room
  console.log("a user connected");

  // Automatically join the "permanent" room on connection
  socket.join(roomName);
  console.log(`User ${socket.userID} has joined room ${roomName}`);

  // Broadcast to other clients in the room that a new user has joined
  socket.to(roomName).emit("user-joined-room", socket.userID);

  const chatMessages = chatMessageStore.findAllMessages();
  socket.emit("chat messages", chatMessages);

  const privateMessages = messageStore.findMessagesForUser(socket.userID!);

  console.log(privateMessages);
  socket.emit("private messages", privateMessages);

  socket.on("users", (callback) => {
    const users = [...sessionStore.findAllSessions()].filter(
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
