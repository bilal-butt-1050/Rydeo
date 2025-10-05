import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";


import authRoutes from "./routes/auth.js";
import studentRoutes from "./routes/student.js";
import driverRoutes from "./routes/driver.js";
import adminRoutes from "./routes/admin.js";
import seedAdmin from "./config/seedAdmin.js";


dotenv.config();    
connectDB();
seedAdmin();  // ✅ create admin if none exists


const app = express();
app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL 
    credentials: true, // allow cookies
  })
);

// Routes
app.use("/user", authRoutes);
app.use("/student", studentRoutes);
app.use("/driver", driverRoutes);
app.use("/admin", adminRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));