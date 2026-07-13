const userRepository = require("../repositories/user");
const redisClient = require("../../../shared/redis");
const AppError = require("../../../shared/errors/AppError");
const logger = require("../../../shared/logger");

class UserService {
  async getProfile(userId) {
    const cacheKey = `user:${userId}`;

    try {
      // 1. Try reading profile from Redis cache
      const cachedProfile = await redisClient.get(cacheKey);
      if (cachedProfile) {
        logger.info(`Profile cache hit for user: ${userId}`);
        return JSON.parse(cachedProfile);
      }
    } catch (err) {
      logger.error(`Redis read error on profile cache: ${err.message}`);
    }

    // 2. Query MongoDB on cache miss
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const profileData = {
      id: user._id,
      phoneNumber: user.phoneNumber,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      about: user.about,
      isProfileSet: user.isProfileSet,
      lastSeen: user.lastSeen,
    };

    try {
      // 3. Save profile to Redis cache with 5 minute TTL (300 seconds)
      await redisClient.set(cacheKey, JSON.stringify(profileData), "EX", 300);
      logger.info(`Profile cache filled for user: ${userId}`);
    } catch (err) {
      logger.error(`Redis save error on profile cache: ${err.message}`);
    }

    return profileData;
  }

  async updateProfile(userId, profileData) {
    const updatedUser = await userRepository.updateProfile(userId, profileData);
    if (!updatedUser) {
      throw new AppError("Failed to update profile", 500);
    }

    // Invalidate Redis profile cache on update
    const cacheKey = `user:${userId}`;
    await redisClient.del(cacheKey);
    logger.info(`Profile cache invalidated for user: ${userId}`);

    return {
      id: updatedUser._id,
      isProfileSet: updatedUser.isProfileSet,
    };
  }

  async getContacts(userId) {
    const contacts = await userRepository.getContacts(userId);
    return contacts.map((c) => ({
      id: c.contactUserId._id,
      displayName: c.customName || c.contactUserId.displayName || c.contactUserId.phoneNumber,
      phoneNumber: c.contactUserId.phoneNumber,
      avatarUrl: c.contactUserId.avatarUrl,
      about: c.contactUserId.about,
      lastSeen: c.contactUserId.lastSeen,
    }));
  }

  async blockUser(userId, targetUserId) {
    if (userId === targetUserId) {
      throw new AppError("You cannot block yourself", 400);
    }
    const targetUserExists = await userRepository.findById(targetUserId);
    if (!targetUserExists) {
      throw new AppError("Target user not found", 404);
    }

    await userRepository.blockUser(userId, targetUserId);
    logger.info(`User ${userId} blocked target user: ${targetUserId}`);
    return true;
  }

  async unblockUser(userId, targetUserId) {
    await userRepository.unblockUser(userId, targetUserId);
    logger.info(`User ${userId} unblocked target user: ${targetUserId}`);
    return true;
  }

  async getPrivacySettings(userId) {
    const settings = await userRepository.getSettings(userId);
    return {
      lastSeenVisibility: settings.lastSeenVisibility,
      avatarVisibility: settings.avatarVisibility,
    };
  }

  async updatePrivacySettings(userId, settingsData) {
    const updatedSettings = await userRepository.updateSettings(userId, settingsData);
    if (!updatedSettings) {
      throw new AppError("Failed to update privacy settings", 500);
    }
    return {
      lastSeenVisibility: updatedSettings.lastSeenVisibility,
      avatarVisibility: updatedSettings.avatarVisibility,
    };
  }
}

module.exports = new UserService();
