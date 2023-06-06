import socket from "../socket";

export const loadSession = () => {
    const sessionID = localStorage.getItem("sessionID");
    if (sessionID) {
      socket.auth = { sessionID };
      socket.connect();
    }
  };