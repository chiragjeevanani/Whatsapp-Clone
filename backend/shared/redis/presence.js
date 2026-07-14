// Redis/Memory Presence helper for WhatsApp Clone
const redisClient = require("./index");
const logger = require("../logger");

const presence = {
  // Key generators
  getOnlineKey: (userId) => `user:online:${userId}`,
  getSocketKey: (socketId) => `socket:${socketId}`,
  getLastSeenKey: (userId) => `user:lastseen:${userId}`,
  getTypingKey: (conversationId, userId) => `typing:${conversationId}:${userId}`,

  // Set user online
  setOnline: async (userId, socketId) => {
    try {
      // Store online status with 5 minutes (300 seconds) expiry
      // We will rely on heartbeat or manual disconnect to clear
      await redisClient.set(presence.getOnlineKey(userId), socketId, "EX", 300);
      await redisClient.set(presence.getSocketKey(socketId), userId, "EX", 300);
      logger.info(`Presence: User ${userId} is online (Socket: ${socketId})`);
    } catch (err) {
      logger.error(`Presence setOnline error: ${err.message}`);
    }
  },

  // Set user offline
  setOffline: async (userId, socketId) => {
    try {
      await redisClient.del(presence.getOnlineKey(userId));
      if (socketId) {
        await redisClient.del(presence.getSocketKey(socketId));
      }
      
      const lastSeenTime = new Date().toISOString();
      await redisClient.set(presence.getLastSeenKey(userId), lastSeenTime);
      logger.info(`Presence: User ${userId} went offline (Last seen: ${lastSeenTime})`);
    } catch (err) {
      logger.error(`Presence setOffline error: ${err.message}`);
    }
  },

  // Check if a user is online
  isOnline: async (userId) => {
    try {
      const socketId = await redisClient.get(presence.getOnlineKey(userId));
      return !!socketId;
    } catch (err) {
      logger.error(`Presence isOnline error: ${err.message}`);
      return false;
    }
  },

  // Get user's socket ID
  getSocketId: async (userId) => {
    try {
      return await redisClient.get(presence.getOnlineKey(userId));
    } catch (err) {
      logger.error(`Presence getSocketId error: ${err.message}`);
      return null;
    }
  },

  // Get last seen timestamp
  getLastSeen: async (userId) => {
    try {
      return await redisClient.get(presence.getLastSeenKey(userId));
    } catch (err) {
      logger.error(`Presence getLastSeen error: ${err.message}`);
      return null;
    }
  },

  // Set typing status
  setTyping: async (conversationId, userId) => {
    try {
      // Expiry of 5 seconds so it auto-stops if client crashes
      await redisClient.set(presence.getTypingKey(conversationId, userId), "1", "EX", 5);
    } catch (err) {
      logger.error(`Presence setTyping error: ${err.message}`);
    }
  },

  // Clear typing status
  clearTyping: async (conversationId, userId) => {
    try {
      await redisClient.del(presence.getTypingKey(conversationId, userId));
    } catch (err) {
      logger.error(`Presence clearTyping error: ${err.message}`);
    }
  },

  // Check if user is typing in a conversation
  isTyping: async (conversationId, userId) => {
    try {
      const status = await redisClient.get(presence.getTypingKey(conversationId, userId));
      return !!status;
    } catch (err) {
      logger.error(`Presence isTyping error: ${err.message}`);
      return false;
    }
  },
};

module.exports = presence;
