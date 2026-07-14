const app = require("./app");
const config = require("./config");
const logger = require("../../shared/logger");

const server = app.listen(config.port, () => {
  logger.info(`Upload Service started successfully on port ${config.port} [Mode: ${config.nodeEnv}]`);
});

process.on("unhandledRejection", (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

process.on("SIGTERM", () => {
  logger.info("SIGTERM signal received. Shutting down gracefully...");
  server.close(() => process.exit(0));
});
