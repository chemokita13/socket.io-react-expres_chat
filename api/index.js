import express from "express";
import morgan from "morgan";
import http from "http";

import { Server as SocketServer } from "socket.io";

import cors from "cors";

import { PORT } from "./config.js"; // config file

// inits
const app = express(); // init express

const server = http.createServer(app); // http server

const io = new SocketServer(server, {
    cors: {
        origin: "http://localhost:3000",
    },
}); // start socket.io server

// middelwares
app.use(cors());
app.use(morgan("dev"));

// socket.io listeners
io.on("connection", (socket) => {
    console.log(`A new user connected, id: ${socket.id}`);

    socket.on("msg", (msg) => {
        socket.broadcast.emit("msg", {msg, author:socket.id}); // resend msg
    });
});

// express listener
server.listen(PORT, () => console.log(`Server on port: ${PORT}`));
