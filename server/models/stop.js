import mongoose from "mongoose";

const stopSchema = new mongoose.Schema({
  stopName: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  route: { type: mongoose.Schema.Types.ObjectId, ref: "Route" },
});

export default mongoose.model("Stop", stopSchema);
