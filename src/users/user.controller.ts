import { Request, Response } from "express";
import { userService } from "./user.service";
import { UpdateUserDTO, CreateCoachDTO } from "./user.dto";
import { ValidationError } from "../shared/errors";

export class UserController {
  getMe(req: Request, res: Response) {
    const user = userService.getProfile(req.user!.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  }

  updateMe(req: Request, res: Response) {
    const validation = UpdateUserDTO.safeParse(req.body);
    if (!validation.success) {
      throw new ValidationError(validation.error.errors[0].message);
    }

    const user = userService.updateProfile(req.user!.id, validation.data);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  }

  async createCoach(req: Request, res: Response) {
    const validation = CreateCoachDTO.safeParse(req.body);
    if (!validation.success) {
      throw new ValidationError(validation.error.errors[0].message);
    }

    const coach = await userService.createCoach(validation.data);

    res.status(201).json({
      success: true,
      message: "Coach created successfully",
      data: coach,
    });
  }
}

export const userController = new UserController();
