// Enterprise Logger Service (Shared Library)
// Fallback-safe console wrapper for Winston logging, allowing independent service setups.

let winstonInstance = null;
try {
  const winston = require("winston");
  winstonInstance = winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        ),
      }),
      new winston.transports.File({ filename: "logs/error.log", level: "error" }),
      new winston.transports.File({ filename: "logs/combined.log" }),
    ],
  });
} catch (_) {
  // Safe console logger fallback
}

const logger = {
  info: (message, meta = {}) => {
    if (winstonInstance) {
      winstonInstance.info(message, meta);
    } else {
      console.log(`[INFO] ${new Date().toISOString()}: ${message}`, Object.keys(meta).length ? meta : "");
    }
  },
  warn: (message, meta = {}) => {
    if (winstonInstance) {
      winstonInstance.warn(message, meta);
    } else {
      console.warn(`[WARN] ${new Date().toISOString()}: ${message}`, Object.keys(meta).length ? meta : "");
    }
  },
  error: (message, meta = {}) => {
    if (winstonInstance) {
      winstonInstance.error(message, meta);
    } else {
      console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, Object.keys(meta).length ? meta : "");
    }
  },
  debug: (message, meta = {}) => {
    if (winstonInstance) {
      winstonInstance.debug(message, meta);
    } else {
      if (process.env.NODE_ENV !== "production") {
        console.log(`[DEBUG] ${new Date().toISOString()}: ${message}`, Object.keys(meta).length ? meta : "");
      }
    }
  },
};

module.exports = logger;
