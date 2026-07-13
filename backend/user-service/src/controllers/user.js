const userService = require("../services/user");
const { updateProfileSchema, blockUserSchema, privacySettingsSchema } = require("../validators/user");
const { sendResponse } = require("../../../shared/utils/response");
const asyncHandler = require("../../../shared/utils/asyncHandler");

const getMe = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const profile = await userService.getProfile(userId);
  sendResponse(res, 200, profile, "Profile fetched successfully");
});

const updateMe = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const data = updateProfileSchema.parse(req.body);
  const result = await userService.updateProfile(userId, data);
  sendResponse(res, 200, result, "Profile updated successfully");
});

const getUserById = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const profile = await userService.getProfile(userId);
  sendResponse(res, 200, profile, "User profile fetched successfully");
});

const getContacts = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const contacts = await userService.getContacts(userId);
  sendResponse(res, 200, { contacts }, "Contacts list fetched successfully");
});

const blockUser = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const data = blockUserSchema.parse(req.body);
  await userService.blockUser(userId, data.targetUserId);
  sendResponse(res, 200, null, "User blocked successfully");
});

const unblockUser = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const data = blockUserSchema.parse(req.body);
  await userService.unblockUser(userId, data.targetUserId);
  sendResponse(res, 200, null, "User unblocked successfully");
});

const getPrivacy = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const settings = await userService.getPrivacySettings(userId);
  sendResponse(res, 200, settings, "Privacy settings fetched successfully");
});

const updatePrivacy = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const data = privacySettingsSchema.parse(req.body);
  const settings = await userService.updatePrivacySettings(userId, data);
  sendResponse(res, 200, settings, "Privacy settings updated successfully");
});

module.exports = {
  getMe,
  updateMe,
  getUserById,
  getContacts,
  blockUser,
  unblockUser,
  getPrivacy,
  updatePrivacy,
};
