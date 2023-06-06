// Import controllers
import * as sessionController from "../controllers/sessionController";
import * as messageController from "../controllers/messageController";
import * as chatMessageController from "../controllers/chatMessageController";

import { roomName } from "../constants";
import { ExtendedSocket } from "../types";
import { Server } from "socket.io";

export function handleConnection(io: Server) {
  io.on("connection", (socket: ExtendedSocket) => {
    // Automatically join the "permanent" room on connection
    socket.join(roomName);
    console.log(`User ${socket.userID} has joined room ${roomName}`);

    // Broadcast to other clients in the room that a new user has joined
    socket.to(roomName).emit("user_joined_room", socket.userID);

    const chatMessages = chatMessageController.getAllChatMessages();
    socket.emit("chat messages", chatMessages);

    const privateMessages = messageController.getMessagesForUser(
      socket.userID!
    );
    socket.emit("private messages", privateMessages);

    socket.on("users", (callback) => {
      const users = sessionController
        .getAllSessions()
        .filter((session) => session.connected);
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
}
