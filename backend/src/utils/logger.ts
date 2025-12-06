import pino from "pino";

const isDevelopment =
  process.env.NODE_ENV === "development" || !process.env.NODE_ENV;

const loggerConfig: pino.LoggerOptions = {
  level: process.env.LOG_LEVEL || (isDevelopment ? "debug" : "info"),
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      remoteAddress: req.remoteAddress,
      remotePort: req.remotePort,
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
    err: pino.stdSerializers.err,
  },
};

if (isDevelopment) {
  loggerConfig.transport = {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "yyyy-mm-dd HH:MM:ss.l",
      ignore: "pid,hostname",
      singleLine: false,
      hideObject: false,
      messageFormat: "{pid} {msg}",
    },
  };
}

export const logger = pino(loggerConfig);

export default logger;
