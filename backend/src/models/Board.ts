import mongoose from "mongoose";

const BoardSchema = new mongoose.Schema({
  boardId: { type: String, required: true, unique: true },
  snapshot: { type: String, default: "" },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Board", BoardSchema);
