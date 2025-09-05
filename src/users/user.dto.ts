import { z } from "zod";

export const UpdateUserDTO = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
});

export const CreateCoachDTO = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type UpdateUserDTOType = z.infer<typeof UpdateUserDTO>;
export type CreateCoachDTOType = z.infer<typeof CreateCoachDTO>;
