// Reusable HTTP client to allow user-service or chat-service to call auth-service
const axios = require("axios").default;
const logger = require("../logger");

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || "http://localhost:4001";

const authClient = {
  verifyToken: async (token) => {
    try {
      const response = await axios.post(`${AUTH_SERVICE_URL}/api/auth/verify`, { token });
      return response.data.data;
    } catch (error) {
      logger.error(`authClient.verifyToken error: ${error.message}`);
      throw error;
    }
  },
};

module.exports = authClient;
