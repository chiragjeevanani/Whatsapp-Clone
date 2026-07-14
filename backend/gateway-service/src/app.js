const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const { v4: uuidv4 } = require("uuid");
const { createProxyMiddleware } = require("http-proxy-middleware");

const config = require("./config");
const logger = require("../../shared/logger");
const errorHandler = require("../../shared/middleware/errorHandler");
const rateLimiter = require("../../shared/middleware/rateLimiter");

const app = express();

// 1. Request ID Generation Middleware
app.use((req, res, next) => {
  const requestId = req.headers["x-request-id"] || uuidv4();
  req.id = requestId;
  res.setHeader("x-request-id", requestId);
  next();
});

// 2. Request Logger Middleware
app.use((req, res, next) => {
  logger.info(`Incoming ${req.method} request to ${req.originalUrl}`, {
    requestId: req.id,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });
  next();
});

// 3. Security & Utility Middlewares
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({
  origin: "*", // Adjust for production environments
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-request-id"],
}));
app.use(compression());
app.use(rateLimiter);

// 4. Gateway Health Check endpoint
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Gateway Service is running and healthy",
    data: {
      timestamp: new Date().toISOString(),
      services: {
        auth: config.services.auth,
        user: config.services.user,
        chat: config.services.chat,
        upload: config.services.upload,
        notification: config.services.notification,
      }
    },
    requestId: req.id,
  });
});

// Helper function to inject requestId header for downstream services
const proxyReq = (proxyReq, req) => {
  proxyReq.setHeader("x-request-id", req.id);
};

// 5. Microservice Proxies mapping /api/v1/<service>/* -> <ServiceURL>/api/v1/<service>/*
app.use(
  "/api/v1/auth",
  createProxyMiddleware({
    target: config.services.auth,
    changeOrigin: true,
    pathRewrite: {
      "^/": "/api/v1/auth/"
    },
    on: { proxyReq },
  })
);

app.use(
  "/api/v1/users",
  createProxyMiddleware({
    target: config.services.user,
    changeOrigin: true,
    pathRewrite: {
      "^/": "/api/v1/users/"
    },
    on: { proxyReq },
  })
);

app.use(
  "/api/v1/profile",
  createProxyMiddleware({
    target: config.services.user,
    changeOrigin: true,
    pathRewrite: {
      "^/": "/api/v1/profile/"
    },
    on: { proxyReq },
  })
);

app.use(
  "/uploads",
  createProxyMiddleware({
    target: config.services.upload,
    changeOrigin: true,
    pathRewrite: {
      "^/": "/uploads/"
    },
    on: { proxyReq },
  })
);

app.use(
  "/api/v1/chats",
  createProxyMiddleware({
    target: config.services.chat,
    changeOrigin: true,
    pathRewrite: {
      "^/": "/api/v1/chats/"
    },
    on: { proxyReq },
  })
);

app.use(
  "/api/v1/upload",
  createProxyMiddleware({
    target: config.services.upload,
    changeOrigin: true,
    pathRewrite: {
      "^/": "/api/v1/upload/"
    },
    on: { proxyReq },
  })
);

app.use(
  "/api/v1/notifications",
  createProxyMiddleware({
    target: config.services.notification,
    changeOrigin: true,
    pathRewrite: {
      "^/": "/api/v1/notifications/"
    },
    on: { proxyReq },
  })
);

// 6. Global Fallback Route
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "API Route not found",
    requestId: req.id,
  });
});

// 7. Global Error Handler Middleware
app.use(errorHandler);

module.exports = app;
