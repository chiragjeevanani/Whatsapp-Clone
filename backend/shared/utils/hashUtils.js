// Utility for password and key hashing using bcrypt, with fallback support for mock dev environment.

async function hashPassword(password) {
  try {
    const bcrypt = require("bcrypt");
    return await bcrypt.hash(password, 10);
  } catch (_) {
    // Plain text prefix fallback for dev environment without native packages
    return `mock-hash-${password}`;
  }
}

async function verifyPassword(password, hashedPassword) {
  try {
    const bcrypt = require("bcrypt");
    return await bcrypt.compare(password, hashedPassword);
  } catch (_) {
    return hashedPassword === `mock-hash-${password}` || password === hashedPassword;
  }
}

module.exports = { hashPassword, verifyPassword };
