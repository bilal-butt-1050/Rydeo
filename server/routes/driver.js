import express from "express";
import { 
  getDriverProfile, 
  toggleLocation, 
  updateLocation,
  getRouteStops 
} from "../controllers/driver.js";
import { protect, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.get("/profile", protect, authorizeRoles("driver"), getDriverProfile);
router.post("/toggle-location", protect, authorizeRoles("driver"), toggleLocation);
router.post("/update-location", protect, authorizeRoles("driver"), updateLocation);
router.get("/route-stops", protect, authorizeRoles("driver"), getRouteStops);

export default router;