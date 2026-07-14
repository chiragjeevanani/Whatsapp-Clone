require("dotenv").config();

// Validate required env keys
const requiredKeys = ["JWT_SECRET", "MONGO_URI", "PORT"];
const missing = requiredKeys.filter((key) => !process.env[key]);

if (missing.length) {
  console.error(`[CHAT-SERVICE FATAL CONFIG ERROR] Missing key(s): ${missing.join(", ")}`);
  process.exit(1);
}

module.exports = {
  port: parseInt(process.env.PORT || "4003", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET,
  mongoUri: process.env.MONGO_URI,
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
  },
};
