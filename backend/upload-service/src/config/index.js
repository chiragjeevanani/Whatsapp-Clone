require("dotenv").config();

module.exports = {
  port: parseInt(process.env.UPLOAD_SERVICE_PORT || "4005", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET || "fallback_jwt_secret_key_for_whatsapp_clone",
  uploadLimits: {
    imageSize: 10 * 1024 * 1024,      // 10MB
    videoSize: 100 * 1024 * 1024,     // 100MB
    documentSize: 50 * 1024 * 1024,   // 50MB
    audioSize: 20 * 1024 * 1024,      // 20MB
  }
};
