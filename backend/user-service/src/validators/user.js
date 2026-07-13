const { z } = require("zod");

const updateProfileSchema = z.object({
  displayName: z.string().min(1, "Display name cannot be empty").max(50).optional(),
  avatarUrl: z.string().url("Invalid avatar URL format").optional().or(z.literal("")),
  about: z.string().max(139, "About status cannot exceed 139 characters").optional(),
});

const blockUserSchema = z.object({
  targetUserId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID format"),
});

const privacySettingsSchema = z.object({
  lastSeenVisibility: z.enum(["everyone", "contacts", "nobody"]).optional(),
  avatarVisibility: z.enum(["everyone", "contacts", "nobody"]).optional(),
});

module.exports = {
  updateProfileSchema,
  blockUserSchema,
  privacySettingsSchema,
};
