import mongoose from "mongoose";

const busSchema = new mongoose.Schema({
  busNumber: { type: String, required: true, unique: true },
  route: { type: mongoose.Schema.Types.ObjectId, ref: "Route", required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
  capacity: { type: Number, default: 50 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Bus", busSchema);