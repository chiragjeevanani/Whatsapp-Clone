const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");

const chatRoutes = require("./routes/chat");
const errorHandler = require("../../shared/middleware/errorHandler");
const logger = require("../../shared/logger");
require("./models/user");

const app = express();

app.use(express.json());

// Request ID propagation middleware
app.use((req, res, next) => {
  req.id = req.headers["x-request-id"] || req.id || "local-req-id";
  next();
});

// Request Logger
app.use((req, res, next) => {
  logger.info(`Chat Service handling ${req.method} request to ${req.originalUrl}`, {
    requestId: req.id,
  });
  next();
});

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors());
app.use(compression());

// Mount chat routes at /api/v1/chats
app.use("/api/v1/chats", chatRoutes);

// Fallback Route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Chat API endpoint not found",
    requestId: req.id,
  });
});

app.use(errorHandler);

module.exports = app;
