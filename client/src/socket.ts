import { Socket as BaseSocket, io } from "socket.io-client";

interface CustomSocket extends BaseSocket {
  userID?: string;
}

const socket: CustomSocket = io(`${import.meta.env.VITE_SOCKET_URL}`, { autoConnect: false });

export default socket;
