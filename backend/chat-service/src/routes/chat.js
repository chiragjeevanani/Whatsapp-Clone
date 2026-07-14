const express = require("express");
const chatController = require("../controllers/chat");
const authMiddleware = require("../../../shared/middleware/authMiddleware");

const router = express.Router();

// Protect all chat routes
router.use(authMiddleware);

router.get("/", chatController.getConversations);
router.post("/", chatController.createConversation);
router.post("/group", chatController.createGroupConversation);
router.get("/:id", chatController.getConversationDetails);
router.get("/:id/messages", chatController.getMessages);
router.post("/:id/messages", chatController.sendMessage);
router.patch("/:id/messages/:messageId", chatController.editMessage);
router.delete("/:id/messages/:messageId", chatController.deleteMessage);

// Group-specific actions
router.post("/:id/members", chatController.addGroupMembers);
router.delete("/:id/members/:userId", chatController.removeGroupMember);
router.post("/:id/leave", chatController.leaveGroup);
router.patch("/:id/group-info", chatController.updateGroupInfo);
router.patch("/:id/admins/:userId", chatController.makeAdmin);
router.delete("/:id/admins/:userId", chatController.removeAdmin);

// Conversation-level actions
router.delete("/:id", chatController.softDeleteConversation);
router.patch("/:id/archive", chatController.archiveConversation);
router.patch("/:id/mute", chatController.muteConversation);
router.patch("/:id/lock", chatController.lockConversation);
router.patch("/:id/favourite", chatController.favouriteConversation);
router.put("/:id/clear", chatController.clearConversation);

module.exports = router;
