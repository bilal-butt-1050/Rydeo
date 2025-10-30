import express from "express";
import { 
  getAdminDashboard, 
  createStudent, 
  createDriver,
  createRoute,
  createBus,
  createStop,
  getAllRoutes,
  getAllBuses,
  getAllStops,
  getAllDrivers
} from "../controllers/admin.js";
import { protect, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.get("/dashboard", protect, authorizeRoles("admin"), getAdminDashboard);
router.post("/create-student", protect, authorizeRoles("admin"), createStudent);
router.post("/create-driver", protect, authorizeRoles("admin"), createDriver);
router.post("/create-route", protect, authorizeRoles("admin"), createRoute);
router.post("/create-bus", protect, authorizeRoles("admin"), createBus);
router.post("/create-stop", protect, authorizeRoles("admin"), createStop);

// Get all resources
router.get("/routes", protect, authorizeRoles("admin"), getAllRoutes);
router.get("/buses", protect, authorizeRoles("admin"), getAllBuses);
router.get("/stops", protect, authorizeRoles("admin"), getAllStops);
router.get("/drivers", protect, authorizeRoles("admin"), getAllDrivers);

export default router;