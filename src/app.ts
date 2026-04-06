import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { globalErrorHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import recordRoutes from "./routes/record.routes";
import dashboardRoutes from "./routes/dashboard.routes";

export const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// API docs
const openapiPath = path.resolve(process.cwd(), "openapi.yaml");
const openapiSpec = YAML.load(openapiPath);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Global Error Handler
app.use(globalErrorHandler);
