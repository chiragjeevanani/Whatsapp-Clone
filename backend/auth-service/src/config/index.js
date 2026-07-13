require("dotenv").config();

// Validate required env keys
const requiredKeys = ["JWT_SECRET", "MONGO_URI", "PORT"];
const missing = requiredKeys.filter((key) => !process.env[key]);

if (missing.length) {
  console.error(`[AUTH-SERVICE FATAL CONFIG ERROR] Missing key(s): ${missing.join(", ")}`);
  process.exit(1);
}

module.exports = {
  port: parseInt(process.env.PORT || "4001", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  jwt: {
    secret: process.env.JWT_SECRET,
    expiry: process.env.JWT_EXPIRY || "1h",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "refresh_secret_key_98765",
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY || "7d",
  },
  mongoUri: process.env.MONGO_URI,
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
  },
};
