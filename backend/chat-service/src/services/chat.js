const chatRepository = require("../repositories/chat");
const AppError = require("../../../shared/errors/AppError");
const logger = require("../../../shared/logger");

class ChatService {
  async getConversations(userId) {
    const conversations = await chatRepository.findConversations(userId);
    return conversations.map((conv) => {
      const convObj = conv.toObject();
      // Map stored unread count from schema Map
      convObj.unreadCount = conv.unreadCount && conv.unreadCount.get 
        ? conv.unreadCount.get(userId.toString()) || 0 
        : 0;
      return convObj;
    });
  }

  async getConversationDetails(conversationId, userId) {
    const conversation = await chatRepository.findConversationById(conversationId);
    if (!conversation) {
      throw new AppError("Conversation not found", 404);
    }
    const isParticipant = conversation.participants.some(p => p._id.toString() === userId.toString());
    if (!isParticipant) {
      throw new AppError("Access denied", 403);
    }
    return conversation;
  }

  async getOrCreate1to1Conversation(userId, targetUserId) {
    if (userId.toString() === targetUserId.toString()) {
      throw new AppError("You cannot create a conversation with yourself", 400);
    }

    // Check if 1-to-1 conversation already exists
    let conversation = await chatRepository.find1to1Conversation(userId, targetUserId);
    if (conversation) {
      return conversation;
    }

    // Create new conversation
    conversation = await chatRepository.createConversation([userId, targetUserId], "", false);
    logger.info(`New 1-to-1 conversation created between ${userId} and ${targetUserId}`);
    return conversation;
  }

  async getMessages(conversationId, userId, before = null, limit = 15) {
    const conversation = await chatRepository.findConversationById(conversationId);
    if (!conversation) {
      throw new AppError("Conversation not found", 404);
    }
    const isParticipant = conversation.participants.some(p => p._id.toString() === userId.toString());
    if (!isParticipant) {
      throw new AppError("Access denied", 403);
    }

    // Mark other participant's messages as read
    await chatRepository.markMessagesAsRead(conversationId, userId);

    return chatRepository.findMessages(conversationId, userId, before, limit);
  }

  async sendMessage(conversationId, senderId, messageData) {
    const conversation = await chatRepository.findConversationById(conversationId);
    if (!conversation) {
      throw new AppError("Conversation not found", 404);
    }
    const isParticipant = conversation.participants.some(p => p._id.toString() === senderId.toString());
    if (!isParticipant) {
      throw new AppError("Access denied", 403);
    }

    // Identify recipient
    const recipient = conversation.participants.find(p => p._id.toString() !== senderId.toString());
    
    // Set receiver in messageData
    if (recipient) {
      messageData.receiver = recipient._id;
    }

    // Create message in DB
    let message = await chatRepository.createMessage(conversationId, senderId, messageData);
    if (message.replyTo) {
      const Message = require("../models/message");
      message = await Message.populate(message, {
        path: "replyTo",
        populate: { path: "senderId", select: "displayName phoneNumber" }
      });
    }

    // Update last message in Conversation
    await chatRepository.updateLastMessage(conversationId, message.text || `Sent ${message.type}`, senderId, message.type, message._id);

    // Increment unread count for recipient
    if (recipient) {
      await chatRepository.incrementUnreadCount(conversationId, recipient._id.toString());
    }

    return message;
  }

  async editMessage(conversationId, messageId, senderId, newText) {
    const message = await chatRepository.findMessageById(messageId);
    if (!message) {
      throw new AppError("Message not found", 404);
    }
    if (message.conversationId.toString() !== conversationId.toString()) {
      throw new AppError("Message does not belong to this conversation", 400);
    }
    if (message.senderId.toString() !== senderId.toString()) {
      throw new AppError("Unauthorized to edit this message", 403);
    }
    if (message.deletedForEveryone) {
      throw new AppError("Cannot edit a deleted message", 400);
    }

    // 30 minutes edit limit check
    const timeDiffMs = Date.now() - message.createdAt.getTime();
    const limitMs = 30 * 60 * 1000;
    if (timeDiffMs > limitMs) {
      throw new AppError("Messages can only be edited within 30 minutes of sending", 400);
    }

    message.text = newText;
    message.edited = true;
    message.editedAt = new Date();
    await message.save();

    // Check if it is the last message in conversation, if so, update lastMessage preview
    const conversation = await chatRepository.findConversationById(conversationId);
    if (conversation && conversation.lastMessageId && conversation.lastMessageId.toString() === messageId.toString()) {
      await chatRepository.updateLastMessage(conversationId, newText, senderId, message.type, message._id);
    }

    return message;
  }

  async deleteMessage(conversationId, messageId, userId, deleteType) {
    const message = await chatRepository.findMessageById(messageId);
    if (!message) {
      throw new AppError("Message not found", 404);
    }
    if (message.conversationId.toString() !== conversationId.toString()) {
      throw new AppError("Message does not belong to this conversation", 400);
    }

    if (deleteType === "me") {
      // Delete for Me
      if (message.deletedForMe.includes(userId)) {
        return message; // Already deleted for this user
      }
      message.deletedForMe.push(userId);
      await message.save();
      return message;
    } else if (deleteType === "everyone") {
      // Delete for Everyone (only sender can do this)
      if (message.senderId.toString() !== userId.toString()) {
        throw new AppError("Unauthorized to delete this message for everyone", 403);
      }
      if (message.deletedForEveryone) {
        return message; // Already deleted
      }

      message.deletedForEveryone = true;
      // Scrub content
      message.text = "";
      message.media = "";
      message.thumbnail = "";
      message.fileSize = 0;
      message.mimeType = "";
      // Save it
      await message.save();

      // Check if it was the last message, update last message in conversation
      const conversation = await chatRepository.findConversationById(conversationId);
      if (conversation && conversation.lastMessageId && conversation.lastMessageId.toString() === messageId.toString()) {
        // Rollback to the previous active message
        const prevActiveMsg = await chatRepository.findLatestActiveMessage(conversationId);
        if (prevActiveMsg) {
          await chatRepository.updateLastMessage(
            conversationId,
            prevActiveMsg.text || `Sent ${prevActiveMsg.type}`,
            prevActiveMsg.senderId,
            prevActiveMsg.type,
            prevActiveMsg._id
          );
        } else {
          // No active messages left, reset lastMessage properties
          await chatRepository.updateLastMessage(
            conversationId,
            "This message was deleted",
            message.senderId,
            message.type,
            message._id
          );
        }
      }

      return message;
    } else {
      throw new AppError("Invalid delete type", 400);
    }
  }

  async softDeleteConversation(conversationId, userId) {
    const conversation = await chatRepository.findConversationById(conversationId);
    if (!conversation) {
      throw new AppError("Conversation not found", 404);
    }
    const isParticipant = conversation.participants.some(p => p._id.toString() === userId.toString());
    if (!isParticipant) {
      throw new AppError("Access denied", 403);
    }
    await chatRepository.softDeleteConversation(conversationId, userId);
    logger.info(`Conversation ${conversationId} soft-deleted for user ${userId}`);
    return { conversationId };
  }

  async archiveConversation(conversationId, userId, archive = true) {
    const conversation = await chatRepository.findConversationById(conversationId);
    if (!conversation) {
      throw new AppError("Conversation not found", 404);
    }
    const isParticipant = conversation.participants.some(p => p._id.toString() === userId.toString());
    if (!isParticipant) {
      throw new AppError("Access denied", 403);
    }
    await chatRepository.setArchived(conversationId, userId, archive);
    logger.info(`Conversation ${conversationId} ${archive ? "archived" : "unarchived"} for user ${userId}`);
    return { conversationId, archived: archive };
  }

  async muteConversation(conversationId, userId, enabled, duration = null) {
    const conversation = await chatRepository.findConversationById(conversationId);
    if (!conversation) {
      throw new AppError("Conversation not found", 404);
    }
    const isParticipant = conversation.participants.some(p => p._id.toString() === userId.toString());
    if (!isParticipant) {
      throw new AppError("Access denied", 403);
    }

    let until = null;
    if (enabled && duration) {
      const now = new Date();
      if (duration === "8h") until = new Date(now.getTime() + 8 * 60 * 60 * 1000);
      else if (duration === "1w") until = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      // "always" => until stays null (muted forever)
    }

    await chatRepository.setMuted(conversationId, userId, enabled, until);
    logger.info(`Conversation ${conversationId} ${enabled ? "muted" : "unmuted"} for user ${userId}`);
    return { conversationId, muted: enabled, until };
  }

  async lockConversation(conversationId, userId, locked = true) {
    const conversation = await chatRepository.findConversationById(conversationId);
    if (!conversation) {
      throw new AppError("Conversation not found", 404);
    }
    const isParticipant = conversation.participants.some(p => p._id.toString() === userId.toString());
    if (!isParticipant) {
      throw new AppError("Access denied", 403);
    }
    await chatRepository.setLocked(conversationId, userId, locked);
    logger.info(`Conversation ${conversationId} ${locked ? "locked" : "unlocked"} for user ${userId}`);
    return { conversationId, locked };
  }
}

module.exports = new ChatService();
