const jwt = require("jsonwebtoken");
const config = require("../config");
const authRepository = require("../repositories/auth");
const redisClient = require("../../../shared/redis");
const AppError = require("../../../shared/errors/AppError");
const logger = require("../../../shared/logger");

class AuthService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiry,
    });
    const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiry,
    });
    return { accessToken, refreshToken };
  }

  async requestOtp(phoneNumber) {
    // Generate a test OTP code '123456' for ease of testing or random 6 digits
    const otp = "123456"; 
    const redisKey = `otp:${phoneNumber}`;
    
    // Store in Redis with 5 minute expiry (300 seconds)
    await redisClient.set(redisKey, otp, "EX", 300);
    logger.info(`OTP request for phone: ${phoneNumber}. Code generated: ${otp}`);
    return { expiresInSeconds: 300 };
  }

  async verifyOtp(phoneNumber, code) {
    const redisKey = `otp:${phoneNumber}`;
    const storedOtp = await redisClient.get(redisKey);

    if (!storedOtp || storedOtp !== code) {
      throw new AppError("Invalid or expired verification code", 400);
    }

    // Delete OTP once verified
    await redisClient.del(redisKey);

    // Fetch user or create if new signup
    let user = await authRepository.findByPhone(phoneNumber);
    if (!user) {
      user = await authRepository.createUser(phoneNumber);
    }

    // Generate token payloads
    const tokens = this.generateTokens({ userId: user._id });
    return {
      tokens,
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        isProfileSet: user.isProfileSet,
      },
    };
  }

  async refreshAccessToken(refreshToken) {
    try {
      // Check if token is blacklisted
      const isBlacklisted = await redisClient.get(`blacklist:${refreshToken}`);
      if (isBlacklisted) {
        throw new AppError("Invalid session, please log in again", 401);
      }

      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
      const user = await authRepository.findById(decoded.userId);
      if (!user) {
        throw new AppError("User not found", 404);
      }

      // Generate fresh tokens
      return this.generateTokens({ userId: user._id });
    } catch (error) {
      throw new AppError(error.message || "Invalid refresh token", 401);
    }
  }

  async logout(token, refreshToken) {
    // Blacklist access and refresh tokens until their expiry
    if (token) {
      await redisClient.set(`blacklist:${token}`, "true", "EX", 3600); // 1h
    }
    if (refreshToken) {
      await redisClient.set(`blacklist:${refreshToken}`, "true", "EX", 7 * 24 * 3600); // 7d
    }
    return true;
  }
}

module.exports = new AuthService();
