const express = require("express");
const cors = require("cors");
const path = require("path");
const uploadRoutes = require("./routes/upload");
const errorHandler = require("../../shared/middleware/errorHandler");
const { uploadsDir } = require("./middleware/multerConfig");

const app = express();

// Middlewares
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static upload files
app.use("/uploads", express.static(uploadsDir));

// API routes
app.use("/api/v1/upload", uploadRoutes);

// Gateway Health check endpoint
app.get("/api/v1/upload/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Upload Service is running and healthy",
    data: { timestamp: new Date().toISOString() }
  });
});

// Fallback Route
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found in Upload Service",
  });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;
