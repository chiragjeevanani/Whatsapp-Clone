const authService = require("../services/auth");
const { loginSchema, verifySchema, refreshSchema } = require("../validators/auth");
const { sendResponse } = require("../../../shared/utils/response");
const asyncHandler = require("../../../shared/utils/asyncHandler");

const requestOtp = asyncHandler(async (req, res) => {
  const data = loginSchema.parse(req.body);
  const result = await authService.requestOtp(data.phoneNumber);
  sendResponse(res, 200, result, "OTP sent successfully");
});

const verifyOtp = asyncHandler(async (req, res) => {
  const data = verifySchema.parse(req.body);
  const result = await authService.verifyOtp(data.phoneNumber, data.code);
  sendResponse(res, 200, result, "OTP verified successfully");
});

const refresh = asyncHandler(async (req, res) => {
  const data = refreshSchema.parse(req.body);
  const tokens = await authService.refreshAccessToken(data.refreshToken);
  sendResponse(res, 200, tokens, "Token refreshed successfully");
});

const logout = asyncHandler(async (req, res) => {
  const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;
  const refreshToken = req.body.refreshToken;
  await authService.logout(token, refreshToken);
  res.status(204).end();
});

const verifyTokenInternal = asyncHandler(async (req, res) => {
  // Internal validation service helper
  const token = req.body.token;
  const jwt = require("jsonwebtoken");
  const config = require("../config");
  const decoded = jwt.verify(token, config.jwt.secret);
  sendResponse(res, 200, decoded, "Token verified successfully");
});

module.exports = {
  requestOtp,
  verifyOtp,
  refresh,
  logout,
  verifyTokenInternal,
};
