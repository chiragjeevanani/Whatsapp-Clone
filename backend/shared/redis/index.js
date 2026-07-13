// Enterprise Redis Client (Shared Library)
// Fallback-safe wrapper for Redis connection to allow running services without local Redis instance.

const logger = require("../logger");
const redisConfig = require("../config/redis");

let redisInstance = null;
try {
  const Redis = require("ioredis");
  redisInstance = new Redis({
    host: redisConfig.host,
    port: redisConfig.port,
    password: redisConfig.password,
    keyPrefix: redisConfig.keyPrefix,
    lazyConnect: true,
  });

  redisInstance.on("connect", () => {
    logger.info("Redis server connected successfully");
  });

  redisInstance.on("error", (err) => {
    logger.error(`Redis server connection error: ${err.message}`);
  });
} catch (_) {
  // Safe console/in-memory fallback
}

// Simple in-memory fallback for local development without Redis
const memoryStore = new Map();

const redisClient = {
  get: async (key) => {
    if (memoryStore.has(key)) {
      return memoryStore.get(key);
    }
    if (redisInstance && redisInstance.status === "ready") {
      return redisInstance.get(key);
    }
    return null;
  },
  set: async (key, value, expiryMode, expiryTime) => {
    if (redisInstance && redisInstance.status === "ready") {
      if (expiryMode === "EX" && expiryTime) {
        return redisInstance.set(key, value, "EX", expiryTime);
      }
      return redisInstance.set(key, value);
    }
    memoryStore.set(key, value);
    if (expiryMode === "EX" && expiryTime) {
      setTimeout(() => memoryStore.delete(key), expiryTime * 1000);
    }
    return "OK";
  },
  del: async (key) => {
    const deletedFromMemory = memoryStore.delete(key);
    if (redisInstance && redisInstance.status === "ready") {
      const deletedFromRedis = await redisInstance.del(key);
      return (deletedFromMemory || deletedFromRedis) ? 1 : 0;
    }
    return deletedFromMemory ? 1 : 0;
  },
  connect: async () => {
    if (redisInstance) {
      try {
        await redisInstance.connect();
      } catch (err) {
        logger.error(`Redis lazy connection failed: ${err.message}`);
      }
    }
  },
};

module.exports = redisClient;
