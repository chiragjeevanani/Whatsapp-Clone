const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");

const authRoutes = require("./routes/auth");
const errorHandler = require("../../shared/middleware/errorHandler");
const logger = require("../../shared/logger");

const app = express();

app.use(express.json());

// Request ID Propagation / Generation Middleware
app.use((req, res, next) => {
  req.id = req.headers["x-request-id"] || req.id || "local-req-id";
  next();
});

// Request Logger
app.use((req, res, next) => {
  logger.info(`Auth Service handling ${req.method} request to ${req.originalUrl}`, {
    requestId: req.id,
  });
  next();
});

app.use(helmet());
app.use(cors());
app.use(compression());

// Mount routes at /api/v1/auth
app.use("/api/v1/auth", authRoutes);

// Fallback Route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Auth API endpoint not found",
    requestId: req.id,
  });
});

app.use(errorHandler);

module.exports = app;
