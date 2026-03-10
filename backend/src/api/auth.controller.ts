import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";

// register endpoint: POST /api/auth/register
export async function register(req: Request, res: Response) {
  const { username, password } = req.body;

  try {
    const user = await User.create({ username, password });
    res.json({ user });
  } catch (err) {
    res.status(400).json({ error: "User already exists" });
  }
}

// login endpoint: POST /api/auth/login
export async function login(req: Request, res: Response) {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET!
  );

  res.json({ token, user });
}
