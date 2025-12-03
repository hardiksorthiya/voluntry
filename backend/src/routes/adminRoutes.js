import { Router } from "express";
import {
  listUsers,
  changeUserRole,
  removeUser,
  listActivities,
} from "../controllers/adminController.js";
import { requireAuth, requireAdmin } from "../middleware/authMiddleware.js";

const router = Router();

// All admin routes require authentication and admin role
router.use(requireAuth);
router.use(requireAdmin);

// User management
router.get("/users", listUsers);
router.put("/users/:id/role", changeUserRole);
router.delete("/users/:id", removeUser);

// Activity management
router.get("/activities", listActivities);

export default router;

