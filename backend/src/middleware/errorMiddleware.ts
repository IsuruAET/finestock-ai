import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

// Custom Error class with status code
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Global error handler middleware
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default error properties
  let statusCode = 500;
  let message = "Internal Server Error";

  // Handle AppError instances
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }
  // Handle known error types
  else if (err instanceof Error) {
    message = err.message;

    // Handle JWT errors
    if (err.name === "JsonWebTokenError") {
      statusCode = 401;
      message = "Invalid token";
    } else if (err.name === "TokenExpiredError") {
      statusCode = 401;
      message = "Token expired";
    }
    // Handle validation errors (Mongoose)
    else if (err.name === "ValidationError") {
      statusCode = 400;
      message = err.message;
    }
    // Handle cast errors (Mongoose)
    else if (err.name === "CastError") {
      statusCode = 400;
      message = "Invalid ID format";
    }
  }

  // Log errors that need investigation:
  // - All 5xx errors (server errors)
  // - Unexpected errors (non-AppError) that might indicate bugs
  // Skip expected 4xx AppErrors as pinoHttp already logs them
  const shouldLog =
    statusCode >= 500 || (statusCode >= 400 && !(err instanceof AppError));

  if (shouldLog) {
    logger.error(
      {
        err,
        message: err.message,
        stack: err.stack,
        statusCode,
        path: req.path,
        method: req.method,
      },
      "Request error"
    );
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

// Async handler wrapper to catch errors in async route handlers
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 404 handler for undefined routes
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};
