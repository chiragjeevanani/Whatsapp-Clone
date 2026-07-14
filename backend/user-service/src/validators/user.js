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

const addContactSchema = z.object({
  phone: z.string().min(8, "Phone number is too short").max(20, "Phone number is too long"),
  customName: z.string().max(50).optional().or(z.literal("")),
});

const syncContactsSchema = z.object({
  phoneNumbers: z.array(z.string().min(8).max(20)),
});

module.exports = {
  updateProfileSchema,
  blockUserSchema,
  privacySettingsSchema,
  addContactSchema,
  syncContactsSchema,
};
