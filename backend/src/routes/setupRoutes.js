import { Router } from "express";
import { makeUserAdmin } from "../controllers/setupController.js";

const router = Router();

// Setup route - allows making first user admin (NO AUTHENTICATION REQUIRED)
// This is for initial setup when no admin exists yet
// WARNING: Remove or secure this route in production after initial setup
router.put("/make-admin/:id", makeUserAdmin);

export default router;

