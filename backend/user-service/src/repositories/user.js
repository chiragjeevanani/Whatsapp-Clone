const User = require("../models/user");
const Contact = require("../models/contact");
const BlockedUser = require("../models/blockedUser");
const UserSettings = require("../models/userSettings");
const Device = require("../models/device");

class UserRepository {
  async findById(id) {
    return User.findById(id);
  }

  async updateProfile(id, profileData) {
    return User.findByIdAndUpdate(
      id,
      { ...profileData, isProfileSet: true },
      { new: true, runValidators: true }
    );
  }

  async getContacts(userId) {
    return Contact.find({ userId }).populate("contactUserId", "displayName phoneNumber avatarUrl about lastSeen");
  }

  async blockUser(userId, blockedUserId) {
    return BlockedUser.findOneAndUpdate(
      { userId, blockedUserId },
      { userId, blockedUserId },
      { upsert: true, new: true }
    );
  }

  async unblockUser(userId, blockedUserId) {
    return BlockedUser.findOneAndDelete({ userId, blockedUserId });
  }

  async isBlocked(userId, targetUserId) {
    const block = await BlockedUser.findOne({ userId, blockedUserId: targetUserId });
    return !!block;
  }

  async getSettings(userId) {
    return UserSettings.findOneAndUpdate(
      { userId },
      { userId },
      { upsert: true, new: true }
    );
  }

  async updateSettings(userId, settingsData) {
    return UserSettings.findOneAndUpdate(
      { userId },
      { ...settingsData },
      { new: true, runValidators: true }
    );
  }

  async updateDeviceActive(userId, deviceId, deviceDetails = {}) {
    return Device.findOneAndUpdate(
      { userId, deviceId },
      { ...deviceDetails, lastActiveAt: new Date() },
      { upsert: true, new: true }
    );
  }
}

module.exports = new UserRepository();
