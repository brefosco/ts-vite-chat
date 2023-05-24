import { Server } from "socket.io";
import { SessionStore } from "./stores/sessionStore";
import { ExtendedSocket } from "./types";
import { v4 as uuidv4 } from "uuid";

function randomId() {
  return uuidv4();
}
let connectedUsers = 0;

export function handleSession(io: Server, sessionStore: SessionStore) {
  // Your session related functionality goes here...
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
    const roomName = "permanent";
    const inactivityTimeout = 15 * 60 * 1000; // 15 minutes
    if (connectedUsers >= 10) {
      socket.disconnect(true);
      console.log("Max users limit reached. Disconnecting new user.");
      return;
    }
    connectedUsers++;

    let timeout = setTimeout(() => {
      console.log(`User ${socket.userID} was disconnected due to inactivity.`);
      socket.disconnect(true);
    }, inactivityTimeout);

    // Reset timeout on any activity
    socket.on("activity", () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        console.log(
          `User ${socket.userID} was disconnected due to inactivity.`
        );
        socket.disconnect(true);
      }, inactivityTimeout);
    });

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
    });

    socket.on("disconnect", () => {
      if (socket.sessionID) {
        sessionStore.saveSession(socket.sessionID, {
          userID: socket.userID!,
          username: socket.username!,
          id: socket.id,
          sessionID: socket.sessionID,
          connected: false,
        });
        clearTimeout(timeout);
        connectedUsers--;
      }
      // Broadcast to other clients in the room that a new user has joined
      socket.to(roomName).emit("user-joined-room", socket.userID);
    });
  });
}
