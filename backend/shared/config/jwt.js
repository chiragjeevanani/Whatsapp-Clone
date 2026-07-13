const env = require("./env");

module.exports = {
  secret: env.jwtSecret,
  expiry: env.jwtExpiry,
  refreshSecret: env.jwtRefreshSecret,
  refreshExpiry: env.jwtRefreshExpiry,
};
