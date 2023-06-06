import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { handleSession } from "./handlers/sessionHandling";
import { handleMessage } from "./handlers/messageHandling";
import { handleConnection } from "./handlers/connectionHandling";

const app = express();
app.use(cors()); 

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

handleSession(io);
handleMessage(io);
handleConnection(io);

httpServer.listen(3000, () => {
  console.log("listening on *:3000");
});
