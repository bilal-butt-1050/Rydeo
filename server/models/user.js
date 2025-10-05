import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const options = { discriminatorKey: "role", timestamps: true };

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  loginID: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, options);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model("User", userSchema);

const studentSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  defaultStop: { type: mongoose.Schema.Types.ObjectId, ref: "Stop" },
  bus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus" },
  route: { type: mongoose.Schema.Types.ObjectId, ref: "Route" },
});
export const Student = User.discriminator("student", studentSchema);

const driverSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  bus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus" },
  route: { type: mongoose.Schema.Types.ObjectId, ref: "Route" },
  isLocationActive: { type: Boolean, default: false },
  currentLocation: {
    latitude: { type: Number },
    longitude: { type: Number },
    lastUpdated: { type: Date }
  }
});
export const Driver = User.discriminator("driver", driverSchema);

const adminSchema = new mongoose.Schema({
  permissions: [{ type: String }],
});
export const Admin = User.discriminator("admin", adminSchema);