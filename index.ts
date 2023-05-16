import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from "cors"
// ...
const app = express();
app.use(cors()); // use cors middleware

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

const users: Record<string, string> = {}; // {socketId: username}

io.on('connection', (socket) => {
    console.log('a user connected');

    // When a user sets their username
    socket.on('set_username', (username: string) => {
        users[socket.id] = username;
        io.emit('users', users); // Broadcast the updated user list
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        delete users[socket.id]; // Remove the disconnected user
        io.emit('users', users); // Broadcast the updated user list
    });

    socket.on('chat message', (msg: string) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
});

httpServer.listen(3000, () => {
    console.log('listening on *:3000');
});
