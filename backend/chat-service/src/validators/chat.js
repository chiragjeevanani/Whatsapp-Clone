const { z } = require("zod");

const createConversationSchema = z.object({
  targetUserId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID format"),
});

const sendMessageSchema = z.object({
  text: z.string().optional().default(""),
  type: z.enum(["text", "image", "video", "audio", "voice", "document", "sticker", "gif", "location", "contact"]).optional().default("text"),
  media: z.string().optional().default(""),
  thumbnail: z.string().optional().default(""),
  fileSize: z.number().optional().default(0),
  mimeType: z.string().optional().default(""),
  replyTo: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid message ID format").optional().nullable().default(null),
  forwarded: z.boolean().optional().default(false),
});

module.exports = {
  createConversationSchema,
  sendMessageSchema,
};
