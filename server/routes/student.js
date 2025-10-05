import express from "express";
import { getStudentProfile } from "../controllers/student.js";
import { protect, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.get("/profile", protect, authorizeRoles("student"), getStudentProfile);

export default router;
