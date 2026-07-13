const app = require("./app");
const config = require("./config");
const logger = require("../../shared/logger");
const { connectDatabase } = require("../../shared/database/connect");
const redisClient = require("../../shared/redis");

async function startServer() {
  try {
    // 1. Connect MongoDB
    await connectDatabase();

    // 2. Connect Redis (lazy connection check)
    await redisClient.connect();
    
    // Strict Redis Check in Production
    const redisPingSuccessful = await redisClient.set("ping", "pong", "EX", 1).then(() => true).catch(() => false);
    if (config.nodeEnv === "production" && !redisPingSuccessful) {
      logger.error("FATAL: Redis server connection failed on startup in production. Exiting...");
      process.exit(1);
    } else if (!redisPingSuccessful) {
      logger.warn("Redis offline. Running user-service with in-memory memoryStore fallback");
    }

    // 3. Start Express server
    const server = app.listen(config.port, () => {
      logger.info(`User Service started successfully on port ${config.port} [Mode: ${config.nodeEnv}]`);
    });

    const gracefulShutdown = (signal) => {
      logger.warn(`Received signal ${signal}. Starting graceful shutdown...`);
      server.close(() => {
        logger.info("User HTTP server closed.");
        process.exit(0);
      });
      setTimeout(() => {
        logger.error("Forced shutdown due to timeout.");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

  } catch (error) {
    logger.error(`Failed to start User Service: ${error.message}`);
    process.exit(1);
  }
}

startServer();
