import pinoHttp from "pino-http";
import { logger } from "../utils/logger";

export const requestLogger = pinoHttp({
  logger,
  customLogLevel: (req, res, err) => {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return "warn";
    } else if (res.statusCode >= 500 || err) {
      return "error";
    }
    return "info";
  },
  customSuccessMessage: (req, res) => {
    return `${req.method} ${req.url} - ${res.statusCode}`;
  },
  customErrorMessage: (req, res, err) => {
    return `${req.method} ${req.url} - ${res.statusCode || 500} (${err?.message || "error"})`;
  },
  autoLogging: {
    ignore: (req) => req.url === "/health",
  },
  customAttributeKeys: {
    req: "request",
    res: "response",
    err: "error",
    responseTime: "duration",
  },
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      remoteAddress: req.remoteAddress,
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
  },
});

