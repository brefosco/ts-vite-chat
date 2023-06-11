// Import controllers
import * as sessionController from "../controllers/sessionController";
import * as messageController from "../controllers/messageController";
import * as chatMessageController from "../controllers/chatMessageController";

import { ExtendedSocket } from "../types";
import { Server } from "socket.io";
import { CHAT_MESSAGES, PRIVATE_MESSAGE, USER_JOINED_ROOM, roomName } from "../../constants";

export function handleConnection(io: Server) {
  io.on("connection", (socket: ExtendedSocket) => {
    // Automatically join the "permanent" room on connection
    socket.join(roomName);
    console.log(`User ${socket.userID} has joined room ${roomName}`);

    // Broadcast to other clients in the room that a new user has joined
    socket.to(roomName).emit(USER_JOINED_ROOM, socket.userID);

    const chatMessages = chatMessageController.getAllChatMessages();
    socket.emit(CHAT_MESSAGES, chatMessages);

    const privateMessages = messageController.getMessagesForUser(
      socket.userID!
    );
    socket.emit(PRIVATE_MESSAGE, privateMessages);

    socket.on("users", (callback) => {
      const users = sessionController
        .getAllSessions()
        .filter((session) => session.connected);
      callback(users);
      // Emit an event for other clients to update their user lists
      socket.broadcast.emit("users-update", users);
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
