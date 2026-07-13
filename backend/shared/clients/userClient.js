// Reusable HTTP client to allow chat-service to call user-service
const axios = require("axios").default;
const logger = require("../logger");

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://localhost:4002";

const userClient = {
  getUserProfile: async (userId) => {
    try {
      const response = await axios.get(`${USER_SERVICE_URL}/api/users/${userId}`);
      return response.data.data;
    } catch (error) {
      logger.error(`userClient.getUserProfile error: ${error.message}`);
      throw error;
    }
  },
};

module.exports = userClient;
