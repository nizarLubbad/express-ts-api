import { Router } from "express";
import { courseController } from "./course.controller.js";
import {
  authenticateToken,
  requireRole,
  asyncHandler,
} from "../shared/middleware.js";

const router = Router();

router.get("/", asyncHandler(courseController.getAllCourses));
router.get("/:id", asyncHandler(courseController.getCourseById));
router.post(
  "/",
  authenticateToken,
  requireRole(["COACH", "ADMIN"]),
  asyncHandler(courseController.createCourse)
);
router.put(
  "/:id",
  authenticateToken,
  requireRole(["COACH", "ADMIN"]),
  asyncHandler(courseController.updateCourse)
);
router.delete(
  "/:id",
  authenticateToken,
  requireRole(["COACH", "ADMIN"]),
  asyncHandler(courseController.deleteCourse)
);

export { router as courseRoutes };
