const env = require("./env");

module.exports = {
  host: env.redisHost,
  port: env.redisPort,
  password: env.redisPassword,
  keyPrefix: "whatsapp:",
};
