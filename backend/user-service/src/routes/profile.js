const express = require("express");
const path = require("path");
const multer = require("multer");
const profileController = require("../controllers/profile");
const authMiddleware = require("../../../shared/middleware/authMiddleware");
const redisClient = require("../../../shared/redis");
const AppError = require("../../../shared/errors/AppError");

const router = express.Router();

// Apply authentication middleware to all profile routes
router.use(authMiddleware);

// Define Multer memory storage and limits
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowed.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new AppError("Only JPG, JPEG, PNG, and WEBP image formats are supported", 400));
    }
  }
});

// Custom rate-limiter: Max 5 avatar uploads per minute
const avatarRateLimiter = async (req, res, next) => {
  const ip = req.ip || req.headers["x-forwarded-for"] || "unknown-ip";
  const limitKey = `ratelimit:avatar:${ip}`;
  const limit = 5;

  try {
    const current = await redisClient.get(limitKey);
    const count = current ? parseInt(current, 10) : 0;
    if (count >= limit) {
      return res.status(429).json({
        success: false,
        message: "Too many profile photo uploads. Please wait a minute before trying again.",
      });
    }
    await redisClient.set(limitKey, count + 1, "EX", 60);
    next();
  } catch (err) {
    next();
  }
};

// Routes Mapping
router.get("/", profileController.getProfile);
router.put("/", profileController.updateProfile);
router.delete("/", profileController.deleteAccount);

router.post(
  "/avatar",
  upload.single("avatar"),
  avatarRateLimiter,
  profileController.uploadAvatar
);

router.delete("/avatar", profileController.deleteAvatar);

module.exports = router;
