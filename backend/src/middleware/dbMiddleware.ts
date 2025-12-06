import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import connectDB from "../config/db";
import { logger } from "../utils/logger";

const CONNECTION_TIMEOUT_MS = 5000; // Matches serverSelectionTimeoutMS in db config
const CONNECTED_STATE = 1;

/**
 * Middleware to ensure database connection before handling requests.
 * Leverages connectDB's built-in connection state management and promise reuse.
 */
export const ensureDBConnection = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Fast path: already connected
  if (Number(mongoose.connection.readyState) === CONNECTED_STATE) {
    return next();
  }

  try {
    // connectDB() handles:
    // - Already connected check (idempotent)
    // - Reusing existing connection promise (prevents duplicate connections)
    // - Starting new connection if needed
    await Promise.race([connectDB(), createTimeout(CONNECTION_TIMEOUT_MS)]);

    // Verify connection succeeded
    if (Number(mongoose.connection.readyState) !== CONNECTED_STATE) {
      throw new Error("Database connection failed");
    }

    next();
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Database connection unavailable";

    logger.error({ error: errorMessage }, "DB Middleware: Connection failed");

    res.status(503).json({
      error: "Service Unavailable",
      message: "Database connection unavailable. Please try again later.",
    });
  }
};

/**
 * Creates a promise that rejects after the specified timeout.
 * Prevents requests from hanging indefinitely if connection fails silently.
 */
const createTimeout = (ms: number): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error("Connection timeout")), ms);
  });
};
