const { z } = require("zod");

const updateProfileSchema = z.object({
  displayName: z.string({
    required_error: "Display name is required"
  })
    .trim()
    .min(2, "Display name must be at least 2 characters")
    .max(40, "Display name cannot exceed 40 characters")
    .refine((val) => val.length > 0, "Display name cannot be empty"),
  about: z.string()
    .trim()
    .max(140, "Bio cannot exceed 140 characters")
    .optional()
    .or(z.literal("")),
  email: z.string()
    .trim()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
});

module.exports = {
  updateProfileSchema
};
