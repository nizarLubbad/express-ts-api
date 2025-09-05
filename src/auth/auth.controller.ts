import type { Request, Response } from "express";
import { authService } from "./auth.service.js";
import { RegisterDTO, LoginDTO } from "./auth.dto.js";
import { ValidationError } from "../shared/errors.js";

export class AuthController {
  async register(req: Request, res: Response) {
    const validation = RegisterDTO.safeParse(req.body);
    if (!validation.success) {
      throw new ValidationError(
        validation.error.issues[0]?.message || "Validation failed"
      );
    }

    const result = await authService.register(validation.data);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  }

  async login(req: Request, res: Response) {
    const validation = LoginDTO.safeParse(req.body);
    if (!validation.success) {
      throw new ValidationError(
        validation.error.issues[0]?.message || "Validation failed"
      );
    }

    const result = await authService.login(validation.data);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  }
}

export const authController = new AuthController();
