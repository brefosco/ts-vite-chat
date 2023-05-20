import { Server } from "socket.io";
import { SessionStore } from "./stores/sessionStore";
import { MessageStore } from "./stores/messageStore";
import { ChatMessageStore } from "./stores/chatMessageStore";
import { ChatMessage, ExtendedSocket } from "./types";

export function handleMessage(
  io: Server,
  sessionStore: SessionStore,
  messageStore: MessageStore,
  chatMessageStore: ChatMessageStore
) {
  // Your message related functionality goes here...
  io.on("connection", (socket: ExtendedSocket) => {
    const roomName = "permanent";

    socket.on("chat message", (msg: string) => {
      const message: ChatMessage = {
        content: msg,
        from: socket.userID ?? "this shit is broken",
        username: socket.username ?? "Unknown user kjkkj",
      };

      io.to(roomName).emit("chat message", message); // changed from io.emit to io.to(roomName).emit
      chatMessageStore.saveMessage(message);
    });

    socket.on("private message", ({ recipient, text }, callback) => {
      const senderSession = sessionStore.findSession(socket.sessionID ?? "");
      const recipientSession = sessionStore.findSessionByUsername(recipient);

      if (senderSession && recipientSession) {
        const sender = senderSession.username;
        const recipientSocketId = recipientSession.id; // Get socket id from the recipient's session

        if (recipientSocketId) {
          const message = {
            from: sender,
            content: text,
            to: recipientSocketId,
          };

          io.to(recipientSocketId).emit("private message", message);
          // Also emit the message back to the sender's socket
          socket.emit("private message", message);

          // Save the message
          messageStore.saveMessage(message);

          callback(null, "Message sent"); // Call the callback function to send an acknowledgement back to the client
        } else {
          callback("Recipient not found"); // Call the callback function with an error message
        }
      } else {
        callback("Either sender or recipient not found");
      }
    });
  });
}
