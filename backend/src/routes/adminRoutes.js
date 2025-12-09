import { Router } from "express";
import {
  listUsers,
  changeUserRole,
  removeUser,
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

export default router;

