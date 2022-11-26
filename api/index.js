import express from "express";
import morgan from "morgan";
import http from "http";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import { Server as SocketServer } from "socket.io";

import cors from "cors";

import { PORT, ORIGIN } from "./config.js"; // config file

// inits
const app = express(); // init express

const server = http.createServer(app); // http server

const io = new SocketServer(server, {
    cors: {
        origin: ORIGIN,
    },
}); // start socket.io server

// middelwares
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(join(__dirname, "../client/build")));

// socket.io listeners
io.on("connection", (socket) => {
    console.log(`A new user connected, id: ${socket.id}`);

    socket.on("msg", (msg) => {
        socket.broadcast.emit("msg", msg); // resend msg
    });
});

// express listener
server.listen(PORT, () => console.log(`Server on port: ${PORT}`));
