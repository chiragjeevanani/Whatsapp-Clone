// Reusable HTTP client to allow notification-service to call chat-service
const axios = require("axios").default;
const logger = require("../logger");

const CHAT_SERVICE_URL = process.env.CHAT_SERVICE_URL || "http://localhost:4003";

const chatClient = {
  getConversationDetails: async (conversationId) => {
    try {
      const response = await axios.get(`${CHAT_SERVICE_URL}/api/conversations/${conversationId}`);
      return response.data.data;
    } catch (error) {
      logger.error(`chatClient.getConversationDetails error: ${error.message}`);
      throw error;
    }
  },
};

module.exports = chatClient;
