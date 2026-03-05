import { Router } from "express";
import { createBoard, getBoard } from "./board.controller";

const router = Router();

router.post("/", createBoard);
router.get("/:id", getBoard);

export default router;
