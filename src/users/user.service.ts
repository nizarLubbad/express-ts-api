import bcrypt from "bcryptjs";
import { authService } from "../auth/auth.service.js";
import { NotFoundError, ValidationError } from "../shared/errors.js";
import type { UpdateUserDTOType, CreateCoachDTOType } from "./user.dto.js";

class UserService {
  private userRepository = authService.getUserRepository();

  getProfile(userId: string) {
    const user = this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  updateProfile(userId: string, data: UpdateUserDTOType) {
    const user = this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (data.email && data.email !== user.email) {
      const existingUser = this.userRepository.findOne(
        (u) => u.email === data.email
      );
      if (existingUser) {
        throw new ValidationError("Email already in use");
      }
    }

    const updatedUser = this.userRepository.update(userId, data);
    if (!updatedUser) {
      throw new NotFoundError("User not found");
    }

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async createCoach(data: CreateCoachDTOType) {
    const existingUser = this.userRepository.findOne(
      (user) => user.email === data.email
    );
    if (existingUser) {
      throw new ValidationError("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const coach = this.userRepository.create({
      ...data,
      password: hashedPassword,
      role: "COACH",
    });

    const { password, ...coachWithoutPassword } = coach;
    return coachWithoutPassword;
  }
}

export const userService = new UserService();
