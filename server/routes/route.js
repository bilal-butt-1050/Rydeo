import express from "express";
import {
  getAllRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
} from "../controllers/route.js";
import { protect, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Public routes (students can view routes)
router.get("/", protect, getAllRoutes);
router.get("/:id", protect, getRouteById);

// Admin-only routes
router.post("/", protect, authorizeRoles("admin"), createRoute);
router.put("/:id", protect, authorizeRoles("admin"), updateRoute);
router.delete("/:id", protect, authorizeRoles("admin"), deleteRoute);

export default router;