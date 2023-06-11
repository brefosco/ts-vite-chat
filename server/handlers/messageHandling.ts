import { Server } from "socket.io";
import { ExtendedSocket, ChatMessage } from "../types";
import * as sessionController from "../controllers/sessionController";
import * as messageController from "../controllers/messageController";
import * as chatMessageController from "../controllers/chatMessageController";
import {
  ACTIVITY,
  CHAT_MESSAGE,
  CHECK_USER_CONNECTION,
  PRIVATE_MESSAGE,
  roomName,
} from "../../constants";

export function handleMessage(io: Server) {
  io.on("connection", (socket: ExtendedSocket) => {
    socket.on(CHAT_MESSAGE, (msg: string) => {
      const timestamp = new Date();

      const message: ChatMessage = {
        timestamp: timestamp,
        content: msg,
        from: socket.userID!,
        username: socket.username!,
      };

      io.to(roomName).emit(CHAT_MESSAGE, message);
      socket.emit(ACTIVITY);
      chatMessageController.saveChatMessage(message);
    });

    socket.on(CHECK_USER_CONNECTION, (username, callback) => {
      const session = sessionController.getSessionByUsername(username);
      console.log(session);
      callback(session !== null && session?.connected);
    });

    socket.on(PRIVATE_MESSAGE, ({ recipient, text }, callback) => {
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

          io.to(recipientSocketId).emit(PRIVATE_MESSAGE, message);
          socket.emit(PRIVATE_MESSAGE, message);

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
