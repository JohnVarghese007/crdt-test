import express from "express";
import cors from "cors";
import * as http from "http";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import boardRoutes from "./api/board.routes";
import authRoutes from "./api/auth.routes"; 
import { initSocket } from "./ws/socket";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/boards", boardRoutes);
app.use("/api/auth", authRoutes);

const server = http.createServer(app);
initSocket(server);

server.listen(4000, () => console.log("Backend running on port 4000"));
