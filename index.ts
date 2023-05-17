import express from "express";
import { createServer } from "http";
import { Server, Socket as BaseSocket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { SessionStore } from "./sessionStore";

import cors from "cors";

const app = express();
app.use(cors()); // use cors middleware

const httpServer = createServer(app);
const sessionStore = new SessionStore();

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    // allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});
interface ExtendedSocket extends BaseSocket {
  sessionID?: string;
  userID?: string;
  username?: string;
}

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

    console.log(users);
  });

  socket.on("users", (callback) => {
    const users = [...sessionStore.findAllSessions()].filter(
      (session) => session.connected
    );
    callback(users);
  });

  socket.on("disconnect", () => {
    if (socket.sessionID) {
      sessionStore.saveSession(socket.sessionID, {
        userID: socket.userID ?? "",
        username: socket.username ?? "if you can see this, username is undefined. fuck",
        id: socket.id,
        sessionID: socket.sessionID,
        connected: false,
      });
    }
  });

  socket.on("chat message", (msg: string) => {
    // Emit the list of connected users
    const users = [...sessionStore.findAllSessions()]
      .filter((session) => session.connected)
      .map((session) => session.username);

    // const username = users[socket.id];
    console.log(
      "DEBUGGING WHY ON EARTH THE USERNAME ON A RELOADED USER message does not appear"
    );
    console.log("socket.id");
    console.log(socket.id);
    console.log(socket.username);

    console.log("users");
    console.log(users);
    console.log("username");
    // console.log(username);
    io.emit("chat message", {
      author: socket.username,
      text: msg,
      timestamp: Date.now(),
    });
  });

  socket.on("private message", ({ recipient, text }, callback) => {
    console.log("there is a private message somewhere");

    const senderSession = sessionStore.findSession(socket.sessionID ?? "");
    const recipientSession = sessionStore.findSessionByUsername(recipient);

    if (senderSession && recipientSession) {
      const sender = senderSession.username;
      const recipientSocketId = recipientSession.id; // Get socket id from the recipient's session

      if (recipientSocketId) {
        io.to(recipientSocketId).emit("private message", {
          author: sender,
          text,
          timestamp: Date.now(),
        });
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
