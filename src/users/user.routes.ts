import { Router } from "express";
import { userController } from "./user.controller.js";
import {
  authenticateToken,
  requireRole,
  asyncHandler,
} from "../shared/middleware.js";

const router = Router();

router.get("/me", authenticateToken, asyncHandler(userController.getMe));
router.put("/me", authenticateToken, asyncHandler(userController.updateMe));
router.post(
  "/coach",
  authenticateToken,
  requireRole(["ADMIN"]),
  asyncHandler(userController.createCoach)
);

export { router as userRoutes };
