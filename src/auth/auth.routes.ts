import { Router } from "express";
import { authController } from "./auth.controller.js";
import { asyncHandler } from "../shared/middleware.js";

const router = Router();

router.post("/register", asyncHandler(authController.register));
router.post("/login", asyncHandler(authController.login));

export { router as authRoutes };
