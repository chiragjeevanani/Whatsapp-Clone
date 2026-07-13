// Common configuration utility
require("dotenv").config();

module.exports = {
  nodeEnv: process.env.NODE_ENV || "development",
  logLevel: process.env.LOG_LEVEL || "info",
  jwtSecret: process.env.JWT_SECRET || "default_jwt_secret_key_12345",
  jwtExpiry: process.env.JWT_EXPIRY || "1h",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "default_jwt_refresh_key_54321",
  jwtRefreshExpiry: process.env.JWT_REFRESH_EXPIRY || "7d",
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/AppMetaChat",
  redisHost: process.env.REDIS_HOST || "localhost",
  redisPort: parseInt(process.env.REDIS_PORT || "6379", 10),
  redisPassword: process.env.REDIS_PASSWORD || undefined,
};
