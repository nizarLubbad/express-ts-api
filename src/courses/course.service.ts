import { Repository } from "../shared/repository.js";
import type { Course } from "../shared/types.js";
import { NotFoundError, ForbiddenError } from "../shared/errors.js";
import type { CreateCourseDTOType, UpdateCourseDTOType } from "./course.dto.js";

class CourseService {
  private courseRepository = new Repository<Course>();

  getAllCourses() {
    return this.courseRepository.findAll();
  }

  getCourseById(id: string) {
    const course = this.courseRepository.findById(id);
    if (!course) {
      throw new NotFoundError("Course not found");
    }
    return course;
  }

  createCourse(data: CreateCourseDTOType, createdBy: string) {
    const courseData = {
      title: data.title,
      description: data.description,
      createdBy,
      ...(data.image !== undefined && { image: data.image }),
    };

    return this.courseRepository.create(courseData);
  }

  updateCourse(
    id: string,
    data: UpdateCourseDTOType,
    userId: string,
    userRole: string
  ) {
    const course = this.courseRepository.findById(id);
    if (!course) {
      throw new NotFoundError("Course not found");
    }

    // Check permissions: only course creator or ADMIN can update
    if (course.createdBy !== userId && userRole !== "ADMIN") {
      throw new ForbiddenError("You can only update your own courses");
    }

    // Filter out undefined values
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined)
    );

    const updatedCourse = this.courseRepository.update(id, updateData);
    return updatedCourse!;
  }

  deleteCourse(id: string, userId: string, userRole: string) {
    const course = this.courseRepository.findById(id);
    if (!course) {
      throw new NotFoundError("Course not found");
    }

    // Check permissions: only course creator or ADMIN can delete
    if (course.createdBy !== userId && userRole !== "ADMIN") {
      throw new ForbiddenError("You can only delete your own courses");
    }

    return this.courseRepository.delete(id);
  }
}

export const courseService = new CourseService();
