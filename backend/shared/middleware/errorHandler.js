const logger = require("../logger");

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";

  logger.error(`Error handling request to ${req.originalUrl}: ${err.message}`, {
    stack: err.stack,
    statusCode,
  });

  res.status(statusCode).json({
    success: false,
    message: err.message || "An unexpected error occurred",
    error: {
      code: err.status || "error",
      details: err.details || undefined,
    },
    requestId: req.id || req.headers["x-request-id"],
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}

module.exports = errorHandler;
