import { Server } from "socket.io";
import { ExtendedSocket } from "../types";
import { v4 as uuidv4 } from "uuid";
import * as sessionController from "../controllers/sessionController";
import {
  ACTIVITY,
  SET_USERNAME,
  USER_JOINED_ROOM,
  roomName,
} from "../../constants";

function randomId() {
  return uuidv4();
}

function checkUsernameUnique(username: string) {
  const sessions = sessionController.getAllSessions();

  return !sessions.some(
    (session) => session.username === username && session.connected
  );
}

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
    const connectedUsers = io.engine.clientsCount;
    const inactivityTimeout = 15 * 60 * 1000; // 15 minutes
    if (connectedUsers >= 10) {
      socket.disconnect(true);
      console.log("Max users limit reached. Disconnecting new user.");
      return;
    }
    let timeout = setTimeout(() => {
      console.log(
        `User ${socket.username} was disconnected due to inactivity.`
      );
      socket.disconnect(true);
    }, inactivityTimeout);

    socket.on(ACTIVITY, () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        console.log(
          `User ${socket.username} was disconnected due to inactivity.`
        );
        socket.disconnect(true);
      }, inactivityTimeout);
    });

    socket.on(SET_USERNAME, (username: string, callback: Function) => {
      const isUsernameUnique = checkUsernameUnique(username);

      if (!isUsernameUnique) {
        callback("Username already taken");
        return;
      }

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

      const users = sessionController
        .getAllSessions()
        .filter((session) => session.connected);

      io.emit("users", users);

      callback(null); // No error
    });

    socket.on("disconnect", () => {
      console.log(`Disconnecting ${socket.sessionID}`);
      if (socket.sessionID) {
        sessionController.saveSession(socket.sessionID, {
          userID: socket.userID!,
          username: socket.username!,
          id: socket.id,
          sessionID: socket.sessionID,
          connected: false,
        });
        clearTimeout(timeout);
      }
      socket.to(roomName).emit(USER_JOINED_ROOM, socket.userID);
    });
  });
}
