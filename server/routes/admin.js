import express from "express";
import { 
  getAdminDashboard, 
  createStudent, 
  createDriver,
  createRoute 
} from "../controllers/admin.js";
import { protect, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.get("/dashboard", protect, authorizeRoles("admin"), getAdminDashboard);
router.post("/create-student", protect, authorizeRoles("admin"), createStudent);
router.post("/create-driver", protect, authorizeRoles("admin"), createDriver);
router.post("/create-route", protect, authorizeRoles("admin"), createRoute);

export default router;