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

  async getAllUsersExcept(userId) {
    return User.find({ _id: { $ne: userId } }, "displayName phoneNumber avatarUrl about lastSeen isProfileSet");
  }

  async findByPhone(phoneNumber) {
    return User.findOne({ phoneNumber });
  }

  async addContact(userId, contactUserId, customName = "") {
    return Contact.findOneAndUpdate(
      { userId, contactUserId },
      { userId, contactUserId, customName },
      { upsert: true, new: true }
    );
  }

  async removeContact(userId, contactUserId) {
    return Contact.findOneAndDelete({ userId, contactUserId });
  }

  async findRegisteredUsersByPhones(phoneNumbers) {
    return User.find({ phoneNumber: { $in: phoneNumbers } }, "displayName phoneNumber avatarUrl about lastSeen isProfileSet");
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

  async updateSecretCode(id, secretCodeHash, hasSecretCode) {
    return User.findByIdAndUpdate(
      id,
      { secretCodeHash, hasSecretCode },
      { new: true }
    );
  }
}

module.exports = new UserRepository();
