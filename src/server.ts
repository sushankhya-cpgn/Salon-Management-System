import http from "http";
import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import { initSocket } from "./utils/socket.js";


const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

initSocket(server);

server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})

