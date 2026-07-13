const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const User = require("../models/user");
const redisClient = require("../../../shared/redis");
const logger = require("../../../shared/logger");
const AppError = require("../../../shared/errors/AppError");
const asyncHandler = require("../../../shared/utils/asyncHandler");
const { sendResponse } = require("../../../shared/utils/response");
const { updateProfileSchema } = require("../validators/profile");

// GET /api/v1/profile
const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const cacheKey = `user:${userId}`;

  let profileData;
  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      profileData = JSON.parse(cached);
      return sendResponse(res, 200, profileData, "Profile fetched successfully");
    }
  } catch (err) {
    logger.error(`Redis read error on profile cache: ${err.message}`);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  profileData = {
    id: user._id,
    phoneNumber: user.phoneNumber,
    phone: user.phoneNumber || "",
    displayName: user.displayName || "",
    avatarUrl: user.avatarUrl || "",
    avatar: user.avatarUrl || "",
    about: user.about || "Available for chat...",
    email: user.email || "",
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  try {
    await redisClient.set(cacheKey, JSON.stringify(profileData), "EX", 300);
  } catch (err) {
    logger.error(`Redis save error on profile cache: ${err.message}`);
  }

  sendResponse(res, 200, profileData, "Profile fetched successfully");
});

// PUT /api/v1/profile
const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const validated = updateProfileSchema.parse(req.body);

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  user.displayName = validated.displayName;
  if (validated.about !== undefined) user.about = validated.about;
  if (validated.email !== undefined) user.email = validated.email;
  user.isProfileSet = true;

  await user.save();

  // Invalidate Redis profile cache
  const cacheKey = `user:${userId}`;
  await redisClient.del(cacheKey);

  const updatedProfile = {
    id: user._id,
    phoneNumber: user.phoneNumber,
    phone: user.phoneNumber || "",
    displayName: user.displayName,
    avatarUrl: user.avatarUrl || "",
    avatar: user.avatarUrl || "",
    about: user.about,
    email: user.email || "",
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  sendResponse(res, 200, updatedProfile, "Profile updated successfully");
});

// POST /api/v1/profile/avatar
const uploadAvatar = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  if (!req.file) {
    throw new AppError("No file uploaded or invalid file format", 400);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const filename = `avatar_${userId}_${Date.now()}.webp`;
  const relativePath = `/uploads/avatars/${filename}`;
  
  // Storing upload files inside src's parent directory backend/user-service/uploads/avatars
  const uploadDir = path.join(__dirname, "../../uploads/avatars");
  const destPath = path.join(uploadDir, filename);

  // Ensure directories exist
  await fs.promises.mkdir(uploadDir, { recursive: true });

  try {
    // Process: Resize to 500x500 COVER, webp format, compress 80-85%
    await sharp(req.file.buffer)
      .resize(500, 500, { fit: "cover" })
      .webp({ quality: 82 })
      .toFile(destPath);
  } catch (err) {
    logger.error(`Sharp image processing failure: ${err.message}`);
    throw new AppError("Failed to process profile image", 500);
  }

  // Delete previous avatar file if exists
  const previousAvatar = user.avatarUrl;
  if (previousAvatar && previousAvatar.startsWith("/uploads/avatars/")) {
    const oldPath = path.join(__dirname, "../..", previousAvatar);
    try {
      if (fs.existsSync(oldPath)) {
        await fs.promises.unlink(oldPath);
        logger.info(`Successfully deleted old avatar file: ${oldPath}`);
      }
    } catch (err) {
      logger.error(`Failed to delete old avatar file on disk: ${err.message}`);
    }
  }

  // Update DB values
  user.avatarUrl = relativePath;
  await user.save();

  // Invalidate Redis profile cache
  const cacheKey = `user:${userId}`;
  await redisClient.del(cacheKey);

  const updatedProfile = {
    id: user._id,
    phoneNumber: user.phoneNumber,
    phone: user.phoneNumber || "",
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
    avatar: user.avatarUrl,
    about: user.about,
    email: user.email || "",
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  sendResponse(res, 200, updatedProfile, "Profile photo uploaded successfully");
});

// DELETE /api/v1/profile/avatar
const deleteAvatar = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Delete avatar file from disk if exists
  const previousAvatar = user.avatarUrl;
  if (previousAvatar && previousAvatar.startsWith("/uploads/avatars/")) {
    const oldPath = path.join(__dirname, "../..", previousAvatar);
    try {
      if (fs.existsSync(oldPath)) {
        await fs.promises.unlink(oldPath);
        logger.info(`Deleted avatar file on disk: ${oldPath}`);
      }
    } catch (err) {
      logger.error(`Failed to delete old avatar file on disk: ${err.message}`);
    }
  }

  // Reset database values
  user.avatarUrl = "";
  await user.save();

  // Invalidate Redis profile cache
  const cacheKey = `user:${userId}`;
  await redisClient.del(cacheKey);

  const updatedProfile = {
    id: user._id,
    phoneNumber: user.phoneNumber,
    phone: user.phoneNumber || "",
    displayName: user.displayName,
    avatarUrl: "",
    avatar: "",
    about: user.about,
    email: user.email || "",
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  sendResponse(res, 200, updatedProfile, "Profile photo removed successfully");
});

// DELETE /api/v1/profile
const deleteAccount = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  // 1. Delete user avatar file from disk if exists
  if (user.avatarUrl && user.avatarUrl.startsWith("/uploads/avatars/")) {
    const oldPath = path.join(__dirname, "../..", user.avatarUrl);
    try {
      if (fs.existsSync(oldPath)) {
        await fs.promises.unlink(oldPath);
        logger.info(`Deleted avatar file on disk due to account deletion: ${oldPath}`);
      }
    } catch (err) {
      logger.error(`Failed to delete old avatar file on disk during account deletion: ${err.message}`);
    }
  }

  // 2. Delete user document from Database
  await User.findByIdAndDelete(userId);

  // 3. Invalidate Redis profile cache
  const cacheKey = `user:${userId}`;
  await redisClient.del(cacheKey);

  sendResponse(res, 200, null, "Account deleted successfully");
});

module.exports = {
  getProfile,
  updateProfile,
  uploadAvatar,
  deleteAvatar,
  deleteAccount,
};
