import { Socket as BaseSocket, io } from "socket.io-client";

interface CustomSocket extends BaseSocket {
  userID?: string;
}

const socket: CustomSocket = io("http://192.168.1.9:3000", { autoConnect: false });
// const socket: CustomSocket = io("http://localhost:3000", { autoConnect: false });

export default socket;
