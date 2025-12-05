import dotenv from "dotenv";
import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import { setupGracefulShutdown } from "./utils/shutdown";
import authRoutes from "./routes/authRoutes";
import imageRoutes from "./routes/imageRoutes";
import { errorHandler, notFoundHandler } from "./middleware/errorMiddleware";

dotenv.config();

const app: Application = express();

// Middleware to handle CORS
const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:5173"].filter(
  Boolean
) as string[];

const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins.length > 0 ? allowedOrigins : "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// Health check endpoint (for monitoring and keep-alive)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Connect to database - non-blocking
connectDB().catch((err) => {
  console.error("Failed to connect to database:", err);
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/images", imageRoutes);

// 404 handler - must be after all routes
app.use(notFoundHandler);

// Global error handler - must be last
app.use(errorHandler);

const PORT: number = Number(process.env.PORT) || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

setupGracefulShutdown(server);
