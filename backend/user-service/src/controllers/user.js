const userService = require("../services/user");
const { updateProfileSchema, blockUserSchema, privacySettingsSchema, addContactSchema, syncContactsSchema } = require("../validators/user");
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

const addContact = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const data = addContactSchema.parse(req.body);
  const result = await userService.addContact(userId, data.phone, data.customName);
  sendResponse(res, 200, result, "Contact added successfully");
});

const removeContact = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const contactUserId = req.params.contactUserId;
  await userService.removeContact(userId, contactUserId);
  sendResponse(res, 200, null, "Contact removed successfully");
});

const syncContacts = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const data = syncContactsSchema.parse(req.body);
  const result = await userService.syncContacts(userId, data.phoneNumbers);
  sendResponse(res, 200, result, "Contacts synced successfully");
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

const setupSecretCode = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { code } = req.body;
  const result = await userService.setupSecretCode(userId, code);
  sendResponse(res, 200, result, "Secret Code Created Successfully");
});

const verifySecretCode = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { code } = req.body;
  const result = await userService.verifySecretCode(userId, code);
  sendResponse(res, 200, result, "Secret Code Verified Successfully");
});

const updateFcmToken = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { token, platform } = req.body;
  const result = await userService.updateFcmToken(userId, token, platform || "web");
  sendResponse(res, 200, result, "FCM token registered successfully");
});

module.exports = {
  getMe,
  updateMe,
  getUserById,
  getContacts,
  addContact,
  removeContact,
  syncContacts,
  blockUser,
  unblockUser,
  getPrivacy,
  updatePrivacy,
  setupSecretCode,
  verifySecretCode,
  updateFcmToken,
};
