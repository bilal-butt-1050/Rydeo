import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  messageText: { type: String, required: true },
  responseText: { type: String },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("ChatMessage", chatMessageSchema);
