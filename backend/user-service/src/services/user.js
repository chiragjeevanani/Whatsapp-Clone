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
      hasSecretCode: user.hasSecretCode || false,
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
    const allUsers = await userRepository.getAllUsersExcept(userId);
    const savedContacts = await userRepository.getContacts(userId);
    
    const customNamesMap = new Map();
    savedContacts.forEach((c) => {
      if (c.contactUserId && c.contactUserId._id && c.customName) {
        customNamesMap.set(c.contactUserId._id.toString(), c.customName);
      }
    });

    return allUsers.map((u) => {
      const customName = customNamesMap.get(u._id.toString());
      return {
        id: u._id,
        displayName: customName || u.displayName || u.phoneNumber,
        phoneNumber: u.phoneNumber,
        avatarUrl: u.avatarUrl,
        about: u.about,
        lastSeen: u.lastSeen,
      };
    });
  }

  async addContact(userId, contactPhone, customName = "") {
    const targetUser = await userRepository.findByPhone(contactPhone);
    if (!targetUser) {
      throw new AppError("Target user is not registered on AppMetaChat", 404);
    }
    if (userId.toString() === targetUser._id.toString()) {
      throw new AppError("You cannot add yourself as a contact", 400);
    }
    const contact = await userRepository.addContact(userId, targetUser._id, customName);
    return {
      id: targetUser._id,
      displayName: customName || targetUser.displayName || targetUser.phoneNumber,
      phoneNumber: targetUser.phoneNumber,
      avatarUrl: targetUser.avatarUrl,
      about: targetUser.about,
      lastSeen: targetUser.lastSeen,
    };
  }

  async removeContact(userId, contactUserId) {
    await userRepository.removeContact(userId, contactUserId);
    return true;
  }

  async syncContacts(userId, phoneNumbers) {
    if (!Array.isArray(phoneNumbers)) {
      throw new AppError("Phone numbers must be an array", 400);
    }
    const registeredUsers = await userRepository.findRegisteredUsersByPhones(phoneNumbers);
    
    return registeredUsers
      .filter((u) => u._id.toString() !== userId.toString())
      .map((u) => ({
        id: u._id,
        displayName: u.displayName || u.phoneNumber,
        phoneNumber: u.phoneNumber,
        avatarUrl: u.avatarUrl,
        about: u.about,
        lastSeen: u.lastSeen,
        isProfileSet: u.isProfileSet,
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

    // Create system message in conversation
    try {
      const mongoose = require("mongoose");
      try {
        mongoose.model("Conversation");
      } catch (_) {
        require("../../../chat-service/src/models/conversation");
      }
      try {
        mongoose.model("Message");
      } catch (_) {
        require("../../../chat-service/src/models/message");
      }

      const Conversation = mongoose.model("Conversation");
      const Message = mongoose.model("Message");

      const conversation = await Conversation.findOne({
        isGroup: false,
        participants: { $all: [userId, targetUserId] }
      });

      if (conversation) {
        const systemMessage = await Message.create({
          conversationId: conversation._id,
          senderId: userId,
          receiver: targetUserId,
          type: "system",
          text: "You blocked this contact.",
          status: "read"
        });

        conversation.lastMessage = {
          text: "You blocked this contact.",
          senderId: userId,
          timestamp: new Date(),
          type: "system"
        };
        conversation.lastMessageId = systemMessage._id;
        conversation.lastMessageAt = new Date();
        await conversation.save();
      }
    } catch (err) {
      logger.error("Failed to write block system message:", err);
    }

    return true;
  }

  async unblockUser(userId, targetUserId) {
    await userRepository.unblockUser(userId, targetUserId);
    logger.info(`User ${userId} unblocked target user: ${targetUserId}`);

    // Create system message in conversation
    try {
      const mongoose = require("mongoose");
      try {
        mongoose.model("Conversation");
      } catch (_) {
        require("../../../chat-service/src/models/conversation");
      }
      try {
        mongoose.model("Message");
      } catch (_) {
        require("../../../chat-service/src/models/message");
      }

      const Conversation = mongoose.model("Conversation");
      const Message = mongoose.model("Message");

      const conversation = await Conversation.findOne({
        isGroup: false,
        participants: { $all: [userId, targetUserId] }
      });

      if (conversation) {
        const systemMessage = await Message.create({
          conversationId: conversation._id,
          senderId: userId,
          receiver: targetUserId,
          type: "system",
          text: "You unblocked this contact.",
          status: "read"
        });

        conversation.lastMessage = {
          text: "You unblocked this contact.",
          senderId: userId,
          timestamp: new Date(),
          type: "system"
        };
        conversation.lastMessageId = systemMessage._id;
        conversation.lastMessageAt = new Date();
        await conversation.save();
      }
    } catch (err) {
      logger.error("Failed to write unblock system message:", err);
    }

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

  async setupSecretCode(userId, code) {
    if (!/^\d{6}$/.test(code)) {
      throw new AppError("Secret code must be exactly 6 numeric digits", 400);
    }
    const { hashPassword } = require("../../../shared/utils/hashUtils");
    const secretCodeHash = await hashPassword(code);
    
    const user = await userRepository.updateSecretCode(userId, secretCodeHash, true);
    if (!user) {
      throw new AppError("Failed to update secret code", 500);
    }
    
    // Invalidate Redis profile cache
    const cacheKey = `user:${userId}`;
    await redisClient.del(cacheKey);
    
    return { success: true };
  }

  async verifySecretCode(userId, code) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    if (!user.hasSecretCode || !user.secretCodeHash) {
      throw new AppError("No secret code setup yet", 400);
    }
    const { verifyPassword } = require("../../../shared/utils/hashUtils");
    const isCorrect = await verifyPassword(code, user.secretCodeHash);
    if (!isCorrect) {
      throw new AppError("Incorrect Secret Code", 401);
    }
    return { success: true };
  }

  async isBlocked(userId, targetUserId) {
    return userRepository.isBlocked(userId, targetUserId);
  }

  async updateFcmToken(userId, token, platform = "web") {
    if (!token || typeof token !== "string" || token.trim() === "") {
      throw new AppError("Invalid FCM token", 400);
    }
    const normalizedPlatform = (platform === "app" || platform === "web") ? platform : "web";
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    if (!user.fcmTokens) {
      user.fcmTokens = [];
    }
    const tokenExists = user.fcmTokens.some(item => item && item.token === token);
    if (!tokenExists) {
      user.fcmTokens.push({ token, platform: normalizedPlatform });
      await user.save();
    } else {
      let changed = false;
      user.fcmTokens = user.fcmTokens.map(item => {
        if (item && item.token === token && item.platform !== normalizedPlatform) {
          changed = true;
          return { token, platform: normalizedPlatform, createdAt: new Date() };
        }
        return item;
      });
      if (changed) {
        await user.save();
      }
    }
    const cacheKey = `user:${userId}`;
    await redisClient.del(cacheKey);
    return { success: true };
  }
}

module.exports = new UserService();
