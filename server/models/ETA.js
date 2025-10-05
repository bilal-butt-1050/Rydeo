import mongoose from "mongoose";

const etaRecordSchema = new mongoose.Schema({
  bus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus" },
  stop: { type: mongoose.Schema.Types.ObjectId, ref: "Stop" },
  predictedArrivalTime: { type: Date, required: true },
  generatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("ETARecord", etaRecordSchema);
