import express from "express";
import { createServer } from "http";
import { Server, Socket as BaseSocket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { SessionStore } from "./stores/sessionStore";

import cors from "cors";
import { MessageStore } from "./stores/messageStore";
import { ChatMessageStore } from "./stores/chatMessageStore";
import { ChatMessage, ExtendedSocket } from "./types";

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

function randomId() {
  return uuidv4();
}

// v5 of this with emitting user and setting connected back to true
// solving a bug of recreating user (insanity)
io.use((socket: ExtendedSocket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  if (sessionID) {
    // find existing session
    const session = sessionStore.findSession(sessionID);
    if (session) {
      socket.sessionID = sessionID;
      socket.userID = session.userID;
      socket.username = session.username;

      // Update the session to mark the user as connected
      sessionStore.saveSession(sessionID, {
        ...session,
        connected: true,
      });
    } else {
      // assign new sessionID and userID only if session is not found
      socket.sessionID = randomId();
      socket.userID = randomId();
    }
  } else {
    // assign new sessionID and userID if there is no sessionID in handshake
    socket.sessionID = randomId();
    socket.userID = randomId();
  }
  next();
});

io.on("connection", (socket: ExtendedSocket) => {
  console.log("a user connected");

  const chatMessages = chatMessageStore.findAllMessages();
  socket.emit("chat messages", chatMessages);

  socket.emit("session", {
    sessionID: socket.sessionID,
    userID: socket.userID,
    username: socket.username,
  });

  // When a user sets their username
  socket.on("set_username", (username: string) => {
    if (!socket.sessionID) {
      socket.sessionID = randomId();
      socket.userID = randomId();
    }

    socket.username = username;
    sessionStore.saveSession(socket.sessionID, {
      userID: socket.userID ?? "",
      username: socket.username,
      id: socket.id,
      sessionID: socket.sessionID,
      connected: true,
    });

    // Emit the list of connected users
    const users = [...sessionStore.findAllSessions()].filter(
      (session) => session.connected
    );

    io.emit("users", users);

    console.log("emit users");
    console.log(users);
  });

  socket.on("users", (callback) => {
    const users = [...sessionStore.findAllSessions()].filter(
      (session) => session.connected
    );
    console.log("users");
    console.log(users);
    callback(users);
  });

  socket.on("disconnect", () => {
    if (socket.sessionID) {
      sessionStore.saveSession(socket.sessionID, {
        userID: socket.userID ?? "",
        username: socket.username ?? " undefined. fuck",
        id: socket.id,
        sessionID: socket.sessionID,
        connected: false,
      });
    }
  });

  socket.on("chat message", (msg: string) => {
    const message: ChatMessage = {
      content: msg,
      from: socket.userID ?? "this shit is broken",
      username: socket.username ?? "Unknown user kjkkj",
    };

    console.log("message");
    console.log(message);

    io.emit("chat message", message); // changed from socket.emit to io.emit
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

  socket.on("error", (error) => {
    console.log(error);
  });
});

httpServer.listen(3000, () => {
  console.log("listening on *:3000");
});
