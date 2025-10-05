import mongoose from "mongoose";

const routeSchema = new mongoose.Schema({
  routeName: { type: String, required: true },
  startPoint: { type: String, required: true },
  endPoint: { type: String, required: true },
});


export default mongoose.model("Route", routeSchema);
