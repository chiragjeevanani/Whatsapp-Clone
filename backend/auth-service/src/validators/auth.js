const { z } = require("zod");

const loginSchema = z.object({
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number cannot exceed 15 digits"),
});

const verifySchema = z.object({
  phoneNumber: z.string().min(10).max(15),
  code: z.string().length(6, "OTP code must be exactly 6 characters"),
});

const refreshSchema = z.object({
  refreshToken: z.string({ required_error: "Refresh token is required" }),
});

module.exports = {
  loginSchema,
  verifySchema,
  refreshSchema,
};
