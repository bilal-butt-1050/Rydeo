import mongoose from "mongoose";

const routeSchema = new mongoose.Schema({
  routeName: { type: String, required: true, unique: true },
  busNumber: { type: String, required: true },
  startPoint: { type: String, required: true },
  endPoint: { type: String, required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export default mongoose.model("Route", routeSchema);