import mongoose from "mongoose";
import { logger } from "../utils/logger";

// Connection configuration
const getConnectionOptions = (): mongoose.ConnectOptions => ({
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  heartbeatFrequencyMS: 10000,
  retryWrites: true,
  retryReads: true,
  bufferCommands: true,
});

// Setup event handlers (runs once)
let handlersInitialized = false;
let hasBeenConnected = false; // Track if we've ever been connected before

const initializeEventHandlers = () => {
  if (handlersInitialized) return;

  const connection = mongoose.connection;

  connection.on("connected", () => {
    if (!hasBeenConnected) {
      logger.info("MongoDB connected");
      hasBeenConnected = true;
    }
  });
  connection.on("error", (err) => logger.error({ err }, "MongoDB error"));
  connection.on("disconnected", () => logger.warn("MongoDB disconnected"));
  connection.on("reconnected", () => {
    if (hasBeenConnected) {
      logger.info("MongoDB reconnected");
    }
  });
  connection.on("close", () => logger.info("MongoDB connection closed"));

  handlersInitialized = true;
};

// Track ongoing connection attempts to prevent duplicates
let connectingPromise: Promise<void> | null = null;

const connectDB = async (): Promise<void> => {
  initializeEventHandlers();

  // Already connected
  if (mongoose.connection.readyState === 1) {
    return;
  }

  // Connection in progress - reuse existing promise
  if (connectingPromise) {
    return connectingPromise;
  }

  // Start new connection
  connectingPromise = (async () => {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      throw new Error("MONGO_URI environment variable is required");
    }

    try {
      await mongoose.connect(mongoURI, getConnectionOptions());
      // Connection logged by event handler
    } catch (error) {
      connectingPromise = null; // Allow retry
      throw error;
    }
  })();

  return connectingPromise;
};

export const disconnectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState === 0) {
    return; // Already disconnected
  }

  await mongoose.disconnect();
  connectingPromise = null;
  logger.info("MongoDB disconnected");
};

export default connectDB;
