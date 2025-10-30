import mongoose from "mongoose";

const stopSchema = new mongoose.Schema({
  stopName: { type: String, required: true },
  address: { type: String, required: true }, // Full address from Geoapify
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  route: { type: mongoose.Schema.Types.ObjectId, ref: "Route" },
  order: { type: Number, default: 0 }, // Order of stop in the route
}, { timestamps: true });

export default mongoose.model("Stop", stopSchema);