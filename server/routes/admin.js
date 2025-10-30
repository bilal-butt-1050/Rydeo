import express from "express";
import { 
  getAdminDashboard, 
  createStudent, 
  createDriver 
} from "../controllers/admin.js";
import {
  getAllRoutes,
  getRouteDetails,
  createRoute,
  updateRoute,
  deleteRoute,
} from "../controllers/route.js";
import { protect, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Admin dashboard
router.get("/dashboard", protect, authorizeRoles("admin"), getAdminDashboard);

// User management
router.post("/create-student", protect, authorizeRoles("admin"), createStudent);
router.post("/create-driver", protect, authorizeRoles("admin"), createDriver);

// Route management
router.get("/routes", protect, authorizeRoles("admin"), getAllRoutes);
router.get("/routes/:id", protect, authorizeRoles("admin"), getRouteDetails);
router.post("/routes", protect, authorizeRoles("admin"), createRoute);
router.put("/routes/:id", protect, authorizeRoles("admin"), updateRoute);
router.delete("/routes/:id", protect, authorizeRoles("admin"), deleteRoute);

export default router;