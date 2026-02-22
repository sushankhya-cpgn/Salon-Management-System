import { Server } from "socket.io"
import jwt from "jsonwebtoken"

let io: Server;

const cors = {
    origin: "*",
    methods: ["GET", "POST"],

}

export const initSocket = (server: any) => {
    io = new Server(server, {
        cors: cors
    })

    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error("Authentication error: Token missing"));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { _id: string };
            socket.data.user = decoded;
            next();

        }

        catch (err) {
            console.error("Socket authentication error:", err);
            next(new Error("Authentication error: Invalid token"));
        }
    })

    io.on("connection", (socket) => {
        console.log("New client connected: ", socket.id);

        // User Specific Room
        const userId = socket.data.user?._id;
        if (userId) {
            socket.join(userId.toString());
        }
        socket.on("disconnect", () => {
            console.log("Client disconnected: ", socket.id);
        })
    })
    return io;
}

export const getIo = () => {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
}