import express from "express";
import { 
  getStudentProfile, 
  getBusLocation,
  getRouteStops 
} from "../controllers/student.js";
import { protect, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.get("/profile", protect, authorizeRoles("student"), getStudentProfile);
router.get("/bus-location", protect, authorizeRoles("student"), getBusLocation);
router.get("/route-stops", protect, authorizeRoles("student"), getRouteStops);

export default router;