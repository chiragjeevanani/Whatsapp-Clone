const mongoose = require("mongoose");
const logger = require("../logger");
const mongoConfig = require("../config/mongo");

async function connectDatabase() {
  try {
    // If already connected, do nothing
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    mongoose.connection.on("connected", () => {
      logger.info("MongoDB database connected successfully");
    });

    mongoose.connection.on("error", (err) => {
      logger.error(`MongoDB database connection error: ${err.message}`);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB database connection disconnected");
    });

    await mongoose.connect(mongoConfig.uri, mongoConfig.options);
    return mongoose.connection;
  } catch (error) {
    logger.error(`Database connection failed: ${error.message}`);
    throw error;
  }
}

module.exports = { connectDatabase };
