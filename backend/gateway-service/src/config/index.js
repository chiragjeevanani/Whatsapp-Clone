require("dotenv").config();

// Define required keys for Gateway Service
const requiredKeys = ["JWT_SECRET", "PORT"];
const missing = requiredKeys.filter((key) => !process.env[key]);

if (missing.length) {
  console.error(`[GATEWAY FATAL CONFIG ERROR] Missing key(s): ${missing.join(", ")}`);
  process.exit(1);
}

module.exports = {
  port: parseInt(process.env.PORT || "4000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET,
  services: {
    auth: process.env.AUTH_SERVICE_URL || "http://localhost:4001",
    user: process.env.USER_SERVICE_URL || "http://localhost:4002",
    chat: process.env.CHAT_SERVICE_URL || "http://localhost:4003",
    upload: process.env.UPLOAD_SERVICE_URL || "http://localhost:4005",
    notification: process.env.NOTIFICATION_SERVICE_URL || "http://localhost:4004",
  },
};
