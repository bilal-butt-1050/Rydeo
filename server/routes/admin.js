import express from "express";
import { 
  getAdminDashboard, 
  createStudent, 
  createDriver,
  createRoute,
  getAllRoutes,
  getRouteById,
  updateRoute,
  deleteRoute
} from "../controllers/admin.js";
import { protect, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.get("/dashboard", protect, authorizeRoles("admin"), getAdminDashboard);
router.post("/create-student", protect, authorizeRoles("admin"), createStudent);
router.post("/create-driver", protect, authorizeRoles("admin"), createDriver);

// Route management
router.post("/create-route", protect, authorizeRoles("admin"), createRoute);
router.get("/routes", protect, authorizeRoles("admin"), getAllRoutes);
router.get("/routes/:id", protect, authorizeRoles("admin"), getRouteById);
router.put("/routes/:id", protect, authorizeRoles("admin"), updateRoute);
router.delete("/routes/:id", protect, authorizeRoles("admin"), deleteRoute);

export default router;