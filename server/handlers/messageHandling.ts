import { Server } from "socket.io";
import { ExtendedSocket, ChatMessage } from "../types";
import { roomName } from "../constants";

// Import controllers
import * as sessionController from "../controllers/sessionController";
import * as messageController from "../controllers/messageController";
import * as chatMessageController from "../controllers/chatMessageController";

export function handleMessage(io: Server) {
  io.on("connection", (socket: ExtendedSocket) => {
    socket.on("chat message", (msg: string) => {
      const timestamp = new Date();

      const message: ChatMessage = {
        timestamp: timestamp,
        content: msg,
        from: socket.userID!,
        username: socket.username!,
      };

      io.to(roomName).emit("chat message", message);
      socket.emit("activity");
      chatMessageController.saveChatMessage(message);
    });

    socket.on("private message", ({ recipient, text }, callback) => {
      const senderSession = sessionController.getSession(
        socket.sessionID ?? ""
      );
      const recipientSession =
        sessionController.getSessionByUsername(recipient);

      if (senderSession && recipientSession) {
        const sender = senderSession.username;
        const recipientSocketId = recipientSession.id;

        if (recipientSocketId) {
          const message = {
            from: sender,
            content: text,
            to: recipientSocketId,
          };

          io.to(recipientSocketId).emit("private message", message);
          socket.emit("private message", message);

          messageController.saveMessage(message);

          callback(null, "Message sent");
        } else {
          callback("Recipient not found");
        }
      } else {
        callback("Either sender or recipient not found");
      }
    });
  });
}
