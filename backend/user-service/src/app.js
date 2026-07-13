const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const path = require("path");

const userRoutes = require("./routes/user");
const profileRoutes = require("./routes/profile");
const errorHandler = require("../../shared/middleware/errorHandler");
const logger = require("../../shared/logger");

const app = express();

app.use(express.json());

// Request ID propagation middleware
app.use((req, res, next) => {
  req.id = req.headers["x-request-id"] || req.id || "local-req-id";
  next();
});

// Request Logger
app.use((req, res, next) => {
  logger.info(`User Service handling ${req.method} request to ${req.originalUrl}`, {
    requestId: req.id,
  });
  next();
});

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors());
app.use(compression());

// Mount user routes at /api/v1/users
app.use("/api/v1/users", userRoutes);

// Mount profile routes at /api/v1/profile
app.use("/api/v1/profile", profileRoutes);

// Serve static uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Fallback Route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "User API endpoint not found",
    requestId: req.id,
  });
});

app.use(errorHandler);

module.exports = app;
