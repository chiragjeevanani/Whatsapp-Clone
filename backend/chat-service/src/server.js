const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const config = require("./config");
const logger = require("../../shared/logger");
const { connectDatabase } = require("../../shared/database/connect");
const { handleSocketConnection } = require("./socket/handler");

async function startServer() {
  try {
    // 1. Connect MongoDB
    await connectDatabase();

    // 2. Create HTTP server & Socket.io server
    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    app.set("io", io);

    // 3. Initialize Socket connection handlers
    handleSocketConnection(io);

    // 4. Start HTTP + WS server
    server.listen(config.port, () => {
      logger.info(`Chat Service + WebSockets started successfully on port ${config.port} [Mode: ${config.nodeEnv}]`);
    });

    const gracefulShutdown = (signal) => {
      logger.warn(`Received signal ${signal}. Starting graceful shutdown...`);
      server.close(() => {
        logger.info("Chat HTTP/WS server closed.");
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
    logger.error(`Failed to start Chat Service: ${error.message}`);
    process.exit(1);
  }
}

startServer();
