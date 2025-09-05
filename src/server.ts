import express from "express";
import cors from "cors";
import helmet from "helmet";
import { authRoutes } from "./auth/auth.routes.js";
import { userRoutes } from "./users/user.routes.js";
import { courseRoutes } from "./courses/course.routes.js";
import { errorHandler, notFoundHandler } from "./shared/middleware.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/courses", courseRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`efault admin: admin@no.com / admin123`);
});

export default app;
