const redisClient = require("../redis");
const logger = require("../logger");

async function rateLimiter(req, res, next) {
  const ip = req.ip || req.headers["x-forwarded-for"] || "unknown-ip";
  const limitKey = `ratelimit:${ip}`;
  const limit = parseInt(process.env.RATE_LIMIT_PER_MINUTE || "60", 10);

  try {
    const currentRequestsStr = await redisClient.get(limitKey);
    const currentRequests = currentRequestsStr ? parseInt(currentRequestsStr, 10) : 0;

    if (currentRequests >= limit) {
      logger.warn(`Rate limit exceeded for IP: ${ip}`);
      return res.status(429).json({
        success: false,
        message: "Too many requests, please try again later",
      });
    }

    await redisClient.set(limitKey, currentRequests + 1, "EX", 60);
    next();
  } catch (error) {
    logger.error(`Rate limiting error for IP ${ip}: ${error.message}`);
    // Non-blocking fallback if rate limiter fails
    next();
  }
}

module.exports = rateLimiter;
