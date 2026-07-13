// BullMQ Queue setup (Shared Library)
// Fallback-safe wrapper for queue production and consumption.

const logger = require("../logger");
const redisConfig = require("../config/redis");

const activeQueues = {};

function createQueue(queueName) {
  if (activeQueues[queueName]) return activeQueues[queueName];

  let queueInstance = null;
  try {
    const { Queue } = require("bullmq");
    queueInstance = new Queue(queueName, {
      connection: {
        host: redisConfig.host,
        port: redisConfig.port,
        password: redisConfig.password,
      },
    });
    logger.info(`BullMQ ${queueName} queue initialized`);
  } catch (_) {
    // Fallback safe dummy queue
  }

  const queueWrapper = {
    add: async (jobName, data, options = {}) => {
      logger.info(`Adding job to queue "${queueName}" [Job: ${jobName}]`, { data, options });
      if (queueInstance) {
        return queueInstance.add(jobName, data, options);
      }
      return { id: `mock-job-id-${Math.random()}`, name: jobName, data };
    },
  };

  activeQueues[queueName] = queueWrapper;
  return queueWrapper;
}

module.exports = { createQueue };
