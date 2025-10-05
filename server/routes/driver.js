import express from "express";
import { getDriverProfile } from "../controllers/driver.js";
import { protect, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.get("/profile", protect, authorizeRoles("driver"), getDriverProfile);

export default router;
