import { Server } from "http";
import { disconnectDB } from "../config/db";
import { logger } from "./logger";

const SHUTDOWN_TIMEOUT_MS = 10000;

export const setupGracefulShutdown = (server: Server): void => {
  const gracefulShutdown = async (signal: string) => {
    logger.info({ signal }, "Starting graceful shutdown");

    server.close(async () => {
      logger.info("HTTP server closed");
      try {
        await disconnectDB();
        logger.info("Graceful shutdown completed");
        process.exit(0);
      } catch (err) {
        logger.error({ err }, "Error during shutdown");
        process.exit(1);
      }
    });

    // Force shutdown after timeout
    setTimeout(() => {
      logger.fatal("Forced shutdown after timeout");
      process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS);
  };

  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
};
