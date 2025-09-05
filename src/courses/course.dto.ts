import { z } from "zod";

export const CreateCourseDTO = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().url("Invalid image URL").optional(),
});

export const UpdateCourseDTO = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  image: z.string().url("Invalid image URL").optional(),
});

export type CreateCourseDTOType = z.infer<typeof CreateCourseDTO>;
export type UpdateCourseDTOType = z.infer<typeof UpdateCourseDTO>;
