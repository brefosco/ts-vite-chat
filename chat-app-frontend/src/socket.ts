import { Socket as BaseSocket, io } from "socket.io-client";

interface CustomSocket extends BaseSocket {
  userID?: string;
}

const socket: CustomSocket = io("http://localhost:3000", { autoConnect: false });

export default socket;
