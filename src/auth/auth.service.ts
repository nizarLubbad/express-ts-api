import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Repository } from "../shared/repository.js";
import type { User } from "../shared/types.js";
import { UnauthorizedError, ValidationError } from "../shared/errors.js";
import type { RegisterDTOType, LoginDTOType } from "./auth.dto.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key";
const JWT_EXPIRES_IN = "24h";

class AuthService {
  private userRepository = new Repository<User>();

  constructor() {
    this.initializeAdminUser();
  }

  private async initializeAdminUser() {
    const adminExists = this.userRepository.findOne(
      (user) => user.email === "admin@no.com"
    );
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      this.userRepository.create({
        name: "Admin User",
        email: "admin@no.com",
        password: hashedPassword,
        role: "ADMIN",
      });
    }
  }

  async register(data: RegisterDTOType) {
    const existingUser = this.userRepository.findOne(
      (user) => user.email === data.email
    );
    if (existingUser) {
      throw new ValidationError("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = this.userRepository.create({
      ...data,
      password: hashedPassword,
      role: "STUDENT",
    });

    const token = this.generateToken(user);
    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  async login(data: LoginDTOType) {
    const user = this.userRepository.findOne((u) => u.email === data.email);
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const token = this.generateToken(user);
    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  getUserRepository() {
    return this.userRepository;
  }

  private generateToken(user: User): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }
}

export const authService = new AuthService();
