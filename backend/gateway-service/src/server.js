const app = require("./app");
const config = require("./config");
const logger = require("../../shared/logger");

const server = app.listen(config.port, () => {
  logger.info(`Gateway Service started successfully on port ${config.port} [Mode: ${config.nodeEnv}]`);
});

// Handle graceful shutdown
const gracefulShutdown = (signal) => {
  logger.warn(`Received signal ${signal}. Starting graceful shutdown...`);
  server.close(() => {
    logger.info("Gateway HTTP server closed.");
    process.exit(0);
  });

  // Force exit after 10s
  setTimeout(() => {
    logger.error("Forced shutdown due to timeout.");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at Promise:", { promise, reason });
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception thrown:", { error: error.message, stack: error.stack });
  process.exit(1);
});
