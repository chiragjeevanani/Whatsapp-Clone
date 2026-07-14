const chatService = require("../services/chat");
const { createConversationSchema, sendMessageSchema } = require("../validators/chat");
const { sendResponse } = require("../../../shared/utils/response");
const asyncHandler = require("../../../shared/utils/asyncHandler");
const logger = require("../../../shared/logger");

const getConversations = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const conversations = await chatService.getConversations(userId);
  sendResponse(res, 200, conversations, "Conversations fetched successfully");
});

const getConversationDetails = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const conversationId = req.params.id;
  const conversation = await chatService.getConversationDetails(conversationId, userId);
  
  const presence = require("../../../shared/redis/presence");
  const conversationObj = conversation.toObject({ flattenMaps: true });
  
  if (conversationObj && conversationObj.participants) {
    conversationObj.participants = await Promise.all(
      conversationObj.participants.map(async (p) => {
        const online = await presence.isOnline(p._id.toString());
        p.status = online ? "online" : "offline";
        p.lastSeen = await presence.getLastSeen(p._id.toString()) || p.lastSeen || "";
        return p;
      })
    );
  }

  sendResponse(res, 200, conversationObj, "Conversation details fetched successfully");
});

const createConversation = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const data = createConversationSchema.parse(req.body);
  const conversation = await chatService.getOrCreate1to1Conversation(userId, data.targetUserId);
  sendResponse(res, 200, conversation, "Conversation established successfully");
});

const getMessages = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const conversationId = req.params.id;
  const before = req.query.before || null;
  const limit = parseInt(req.query.limit || "30", 10);

  const messages = await chatService.getMessages(conversationId, userId, before, limit);

  // Notify other participant that messages have been read
  const io = req.app.get("io");
  if (io) {
    const conversation = await chatService.getConversationDetails(conversationId, userId);
    if (conversation && conversation.participants) {
      conversation.participants.forEach((p) => {
        logger.info(`WebSocket: Emitting messages_read to user:${p._id.toString()} for conversation:${conversationId}`);
        io.to(`user:${p._id.toString()}`).emit("messages_read", {
          conversationId,
          readerId: userId,
        });
      });
    }
  }

  sendResponse(res, 200, messages, "Messages fetched successfully");
});

const sendMessage = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const conversationId = req.params.id;
  const data = sendMessageSchema.parse(req.body);

  const message = await chatService.sendMessage(
    conversationId,
    userId,
    data
  );

  const conversationDetails = await chatService.getConversationDetails(conversationId, userId);

  // Broadcast to WebSockets room in real-time
  const io = req.app.get("io");
  let status = "sent";

  if (io && !conversationDetails.isGroup) {
    const recipient = conversationDetails.participants.find(p => p._id.toString() !== userId.toString());
    if (recipient) {
      const recipientId = recipient._id.toString();
      const clientsInConversation = io.sockets.adapter.rooms.get(`conversation:${conversationId}`);
      
      // If recipient is active in the conversation room, message is immediately "read"
      if (clientsInConversation && clientsInConversation.size >= 2) {
        status = "read";
      } else {
        // If recipient is connected to the WS server (online), message is "delivered"
        const recipientRoom = io.sockets.adapter.rooms.get(`user:${recipientId}`);
        if (recipientRoom && recipientRoom.size > 0) {
          status = "delivered";
        }
      }
    }
  }

  // Update status in database if not default
  if (status !== "sent") {
    message.status = status;
    await message.save();
  }

  // Send push notification
  const { sendPushNotification } = require("../../../shared/utils/firebaseService");
  const sender = conversationDetails.participants.find(p => p._id.toString() === userId.toString()) || {};
  const senderName = sender.displayName || sender.phoneNumber || "New Message";
  
  let notificationTitle = senderName;
  if (conversationDetails.isGroup) {
    notificationTitle = `${senderName} @ ${conversationDetails.name}`;
  }

  let notificationBody = message.text;
  if (message.type === "voice") {
    notificationBody = "🎤 Voice Message";
  } else if (message.type === "image") {
    notificationBody = "📷 Photo";
  } else if (message.type === "audio") {
    notificationBody = "🎵 Audio";
  } else if (message.type === "video") {
    notificationBody = "🎥 Video";
  } else if (message.type === "document") {
    notificationBody = "📄 Document";
  }

  if (conversationDetails.isGroup) {
    const offlineParticipants = conversationDetails.participants.filter(p => p._id.toString() !== userId.toString());
    for (const p of offlineParticipants) {
      if (p.fcmTokens && p.fcmTokens.length > 0) {
        const rawTokens = p.fcmTokens.map(item => item.token).filter(Boolean);
        if (rawTokens.length > 0) {
          sendPushNotification(
            rawTokens,
            notificationTitle,
            notificationBody || "New message received",
            {
              conversationId,
              messageId: message._id.toString(),
              senderId: userId
            }
          ).catch(err => logger.error(`[FCM] Push send error: ${err.message}`));
        }
      }
    }
  } else {
    const recipient = conversationDetails?.participants?.find(p => p._id.toString() !== userId.toString());
    if (status !== "read" && recipient && recipient.fcmTokens && recipient.fcmTokens.length > 0) {
      const rawTokens = recipient.fcmTokens.map(item => item.token).filter(Boolean);
      if (rawTokens.length > 0) {
        sendPushNotification(
          rawTokens,
          notificationTitle,
          notificationBody || "New message received",
          {
            conversationId,
            messageId: message._id.toString(),
            senderId: userId
          }
        ).catch(err => logger.error(`[FCM] Push send error: ${err.message}`));
      }
    }
  }

  if (io) {
    logger.info(`WebSocket: Emitting new_message to conversation:${conversationId} with status:${status}`);
    io.to(`conversation:${conversationId}`).emit("new_message", message);
    
    // Broadcast conversation list updates to participants
    if (conversationDetails && conversationDetails.participants) {
      conversationDetails.participants.forEach((p) => {
        logger.info(`WebSocket: Emitting conversation_update to user:${p._id.toString()}`);
        io.to(`user:${p._id.toString()}`).emit("conversation_update", {
          conversationId,
          lastMessage: message,
        });
      });
    }
  }

  sendResponse(res, 201, message, "Message sent successfully");
});

const editMessage = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const conversationId = req.params.id;
  const messageId = req.params.messageId;
  const { text } = req.body;

  const AppError = require("../../../shared/errors/AppError");
  if (!text || text.trim() === "") {
    throw new AppError("Text content is required to edit message", 400);
  }

  const message = await chatService.editMessage(conversationId, messageId, userId, text);

  // Broadcast update to room
  const io = req.app.get("io");
  if (io) {
    logger.info(`WebSocket: Emitting message_updated and message_edited to conversation:${conversationId}`);
    io.to(`conversation:${conversationId}`).emit("message_updated", message);
    io.to(`conversation:${conversationId}`).emit("message_edited", message);

    // Also broadcast updated conversation list preview
    const conversationDetails = await chatService.getConversationDetails(conversationId, userId);
    if (conversationDetails && conversationDetails.participants) {
      conversationDetails.participants.forEach((p) => {
        io.to(`user:${p._id.toString()}`).emit("conversation_update", {
          conversationId,
          lastMessage: message,
        });
      });
    }
  }

  sendResponse(res, 200, message, "Message edited successfully");
});

const deleteMessage = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const conversationId = req.params.id;
  const messageId = req.params.messageId;
  const deleteType = req.query.type || "me"; // "me" | "everyone"

  const message = await chatService.deleteMessage(conversationId, messageId, userId, deleteType);

  const io = req.app.get("io");
  const chatRepository = require("../repositories/chat");
  if (io) {
    if (deleteType === "everyone") {
      logger.info(`WebSocket: Emitting message_deleted_everyone to conversation:${conversationId} for deletion`);
      io.to(`conversation:${conversationId}`).emit("message_updated", message);
      io.to(`conversation:${conversationId}`).emit("message_deleted_everyone", { conversationId, messageId, message });

      // Rollback or update conversation list preview for everyone
      const conversationDetails = await chatService.getConversationDetails(conversationId, userId);
      if (conversationDetails && conversationDetails.participants) {
        // Find latest active message to preview
        const latestMsg = await chatRepository.findLatestActiveMessage(conversationId);
        const previewMsg = latestMsg || {
          _id: message._id,
          text: "🚫 This message was deleted",
          senderId: message.senderId,
          createdAt: message.createdAt,
          type: "text"
        };
        conversationDetails.participants.forEach((p) => {
          io.to(`user:${p._id.toString()}`).emit("conversation_update", {
            conversationId,
            lastMessage: previewMsg,
          });
        });
      }
    } else {
      // If delete for me, only notify the deleter so they can sync other tabs if they have multiple devices
      io.to(`user:${userId.toString()}`).emit("message_deleted_for_me", { conversationId, messageId });
      io.to(`user:${userId.toString()}`).emit("message_deleted_me", { conversationId, messageId });
    }
  }

  sendResponse(res, 200, message, "Message deleted successfully");
});

const softDeleteConversation = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const conversationId = req.params.id;
  const result = await chatService.softDeleteConversation(conversationId, userId);
  sendResponse(res, 200, result, "Chat deleted successfully");
});

const archiveConversation = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const conversationId = req.params.id;
  const archive = req.body.archive !== false;
  const result = await chatService.archiveConversation(conversationId, userId, archive);
  sendResponse(res, 200, result, archive ? "Chat archived" : "Chat unarchived");
});

const muteConversation = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const conversationId = req.params.id;
  const { enabled, duration } = req.body;
  const result = await chatService.muteConversation(conversationId, userId, enabled, duration || null);
  sendResponse(res, 200, result, enabled ? "Chat muted" : "Chat unmuted");
});

const lockConversation = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const conversationId = req.params.id;
  const locked = req.body.locked !== false;
  const result = await chatService.lockConversation(conversationId, userId, locked);
  sendResponse(res, 200, result, locked ? "Chat locked" : "Chat unlocked");
});

const favouriteConversation = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const conversationId = req.params.id;
  const favourite = req.body.favourite !== false;
  const result = await chatService.favouriteConversation(conversationId, userId, favourite);
  sendResponse(res, 200, result, favourite ? "Chat added to Favourites" : "Chat removed from Favourites");
});

const clearConversation = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const conversationId = req.params.id;
  const result = await chatService.clearConversation(conversationId, userId);
  sendResponse(res, 200, result, "Chat cleared successfully");
});

const createGroupConversation = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { name, participants, avatarUrl } = require("../validators/chat").createGroupSchema.parse(req.body);
  const conversation = await chatService.createGroupConversation(userId, name, participants, avatarUrl);
  
  // Notify participants via WebSocket
  const io = req.app.get("io");
  if (io) {
    conversation.participants.forEach((p) => {
      io.to(`user:${p._id.toString()}`).emit("group_created", conversation);
    });
  }

  sendResponse(res, 201, conversation, "Group conversation created successfully");
});

const addGroupMembers = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const conversationId = req.params.id;
  const { memberIds } = req.body;
  
  const conversation = await chatService.addGroupMembers(conversationId, userId, memberIds);
  
  const io = req.app.get("io");
  if (io) {
    io.to(`conversation:${conversationId}`).emit("group_updated", conversation);
    memberIds.forEach((id) => {
      io.to(`user:${id}`).emit("group_created", conversation);
    });
  }

  sendResponse(res, 200, conversation, "Members added successfully");
});

const removeGroupMember = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const conversationId = req.params.id;
  const targetUserId = req.params.userId;
  
  const conversation = await chatService.removeGroupMember(conversationId, userId, targetUserId);
  
  const io = req.app.get("io");
  if (io) {
    io.to(`conversation:${conversationId}`).emit("group_updated", conversation);
    io.to(`user:${targetUserId}`).emit("removed_from_group", { conversationId });
  }

  sendResponse(res, 200, conversation, "Member removed successfully");
});

const leaveGroup = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const conversationId = req.params.id;
  
  const conversation = await chatService.leaveGroup(conversationId, userId);
  
  const io = req.app.get("io");
  if (io) {
    io.to(`conversation:${conversationId}`).emit("group_updated", conversation);
    io.to(`user:${userId}`).emit("removed_from_group", { conversationId });
  }

  sendResponse(res, 200, conversation, "Left group successfully");
});

const updateGroupInfo = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const conversationId = req.params.id;
  const updates = req.body;
  
  const conversation = await chatService.updateGroupInfo(conversationId, userId, updates);
  
  const io = req.app.get("io");
  if (io) {
    io.to(`conversation:${conversationId}`).emit("group_updated", conversation);
  }

  sendResponse(res, 200, conversation, "Group info updated successfully");
});

const makeAdmin = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const conversationId = req.params.id;
  const targetUserId = req.params.userId;
  
  const conversation = await chatService.makeAdmin(conversationId, userId, targetUserId);
  
  const io = req.app.get("io");
  if (io) {
    io.to(`conversation:${conversationId}`).emit("group_updated", conversation);
  }

  sendResponse(res, 200, conversation, "Promoted member to admin successfully");
});

const removeAdmin = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const conversationId = req.params.id;
  const targetUserId = req.params.userId;
  
  const conversation = await chatService.removeAdmin(conversationId, userId, targetUserId);
  
  const io = req.app.get("io");
  if (io) {
    io.to(`conversation:${conversationId}`).emit("group_updated", conversation);
  }

  sendResponse(res, 200, conversation, "Demoted admin successfully");
});

module.exports = {
  getConversations,
  getConversationDetails,
  createConversation,
  getMessages,
  sendMessage,
  editMessage,
  deleteMessage,
  softDeleteConversation,
  archiveConversation,
  muteConversation,
  lockConversation,
  favouriteConversation,
  clearConversation,
  createGroupConversation,
  addGroupMembers,
  removeGroupMember,
  leaveGroup,
  updateGroupInfo,
  makeAdmin,
  removeAdmin,
};
