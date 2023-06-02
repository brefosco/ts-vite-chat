import { Server } from "socket.io";
import { ExtendedSocket } from "../types";
import { v4 as uuidv4 } from "uuid";
import { roomName } from "../constants";
import * as sessionController from "../controllers/sessionController";

function randomId() {
  return uuidv4();
}

let connectedUsers = 0;

export function handleSession(io: Server) {
  io.use((socket: ExtendedSocket, next) => {
    const sessionID = socket.handshake.auth.sessionID;
    if (sessionID) {
      const session = sessionController.getSession(sessionID);
      if (session) {
        socket.sessionID = sessionID;
        socket.userID = session.userID;
        socket.username = session.username;
        sessionController.saveSession(sessionID, {
          ...session,
          connected: true,
        });
      } else {
        socket.sessionID = randomId();
        socket.userID = randomId();
      }
    } else {
      socket.sessionID = randomId();
      socket.userID = randomId();
    }
    next();
  });

  io.on("connection", (socket: ExtendedSocket) => {
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

    socket.on("activity", () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        console.log(`User ${socket.userID} was disconnected due to inactivity.`);
        socket.disconnect(true);
      }, inactivityTimeout);
    });

    socket.on("set_username", (username: string) => {
      if (!socket.sessionID) {
        socket.sessionID = randomId();
        socket.userID = randomId();
      }

      socket.username = username;
      sessionController.saveSession(socket.sessionID, {
        userID: socket.userID ?? "",
        username: socket.username,
        id: socket.id,
        sessionID: socket.sessionID,
        connected: true,
      });

      const users = sessionController.getAllSessions().filter(
        (session) => session.connected
      );

      io.emit("users", users);
    });

    socket.on("disconnect", () => {
      if (socket.sessionID) {
        sessionController.saveSession(socket.sessionID, {
          userID: socket.userID!,
          username: socket.username!,
          id: socket.id,
          sessionID: socket.sessionID,
          connected: false,
        });
        clearTimeout(timeout);
        connectedUsers--;
      }
      socket.to(roomName).emit("user-joined-room", socket.userID);
    });
  });
}
