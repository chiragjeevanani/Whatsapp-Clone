function sendResponse(res, statusCode, data = null, message = "Success", meta = {}) {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta
    },
    requestId: res.req ? res.req.id || res.req.headers["x-request-id"] : undefined,
  });
}

module.exports = { sendResponse };
