import { Server } from "http";
import { disconnectDB } from "../config/db";

const SHUTDOWN_TIMEOUT_MS = 10000;

export const setupGracefulShutdown = (server: Server): void => {
  const gracefulShutdown = async (signal: string) => {
    console.log(`\n${signal} received. Starting graceful shutdown...`);

    server.close(async () => {
      console.log("HTTP server closed");
      try {
        await disconnectDB();
        console.log("Graceful shutdown completed");
        process.exit(0);
      } catch (err) {
        console.error("Error during shutdown:", err);
        process.exit(1);
      }
    });

    // Force shutdown after timeout
    setTimeout(() => {
      console.error("Forced shutdown after timeout");
      process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS);
  };

  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
};

