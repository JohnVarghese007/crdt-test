import { Request, Response } from "express";
import Board from "../models/Board";

type CreateBoardBody = { boardId: string };
type BoardParams = { id: string };

export const createBoard = async (
  req: Request<Record<string, never>, unknown, CreateBoardBody>,
  res: Response
) => {
  const { boardId } = req.body;
  if (!boardId) {
    return res.status(400).json({ message: "boardId is required" });
  }

  const board = await Board.create({ boardId });
  res.json(board);
};

export const getBoard = async (req: Request<BoardParams>, res: Response) => {
  const board = await Board.findOne({ boardId: req.params.id });
  res.json(board);
};
