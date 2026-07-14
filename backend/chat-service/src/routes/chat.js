const express = require("express");
const chatController = require("../controllers/chat");
const authMiddleware = require("../../../shared/middleware/authMiddleware");

const router = express.Router();

// Protect all chat routes
router.use(authMiddleware);

router.get("/", chatController.getConversations);
router.post("/", chatController.createConversation);
router.get("/:id", chatController.getConversationDetails);
router.get("/:id/messages", chatController.getMessages);
router.post("/:id/messages", chatController.sendMessage);
router.patch("/:id/messages/:messageId", chatController.editMessage);
router.delete("/:id/messages/:messageId", chatController.deleteMessage);

// Conversation-level actions
router.delete("/:id", chatController.softDeleteConversation);
router.patch("/:id/archive", chatController.archiveConversation);
router.patch("/:id/mute", chatController.muteConversation);
router.patch("/:id/lock", chatController.lockConversation);

module.exports = router;
