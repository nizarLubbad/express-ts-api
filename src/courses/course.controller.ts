import type { Request, Response } from "express";
import { courseService } from "./course.service.js";
import { CreateCourseDTO, UpdateCourseDTO } from "./course.dto.js";
import { ValidationError } from "../shared/errors.js";

export class CourseController {
  getAllCourses(req: Request, res: Response) {
    const courses = courseService.getAllCourses();

    res.status(200).json({
      success: true,
      data: courses,
    });
  }

  getCourseById(req: Request, res: Response) {
    if (!req.params.id) {
      throw new ValidationError("Course ID is required");
    }
    const course = courseService.getCourseById(req.params.id);

    res.status(200).json({
      success: true,
      data: course,
    });
  }

  createCourse(req: Request, res: Response) {
    const validation = CreateCourseDTO.safeParse(req.body);
    if (!validation.success) {
      throw new ValidationError(
        validation.error.issues[0]?.message || "Validation failed"
      );
    }

    const course = courseService.createCourse(validation.data, req.user!.id);

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  }

  updateCourse(req: Request, res: Response) {
    if (!req.params.id) {
      throw new ValidationError("Course ID is required");
    }

    const validation = UpdateCourseDTO.safeParse(req.body);
    if (!validation.success) {
      throw new ValidationError(
        validation.error.issues[0]?.message || "Validation failed"
      );
    }

    const course = courseService.updateCourse(
      req.params.id,
      validation.data,
      req.user!.id,
      req.user!.role
    );

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  }

  deleteCourse(req: Request, res: Response) {
    if (!req.params.id) {
      throw new ValidationError("Course ID is required");
    }
    courseService.deleteCourse(req.params.id, req.user!.id, req.user!.role);

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  }
}

export const courseController = new CourseController();
