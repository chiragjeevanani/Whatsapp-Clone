const chatRepository = require("../repositories/chat");
const AppError = require("../../../shared/errors/AppError");
const logger = require("../../../shared/logger");

class ChatService {
  async getConversations(userId) {
    const conversations = await chatRepository.findConversations(userId);
    return conversations.map((conv) => {
      const convObj = conv.toObject({ flattenMaps: true });
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

    // Identify recipient (only for 1-to-1)
    let recipient = null;
    if (!conversation.isGroup) {
      recipient = conversation.participants.find(p => p._id.toString() !== senderId.toString());
      
      // Check block list
      if (recipient) {
        const BlockedUser = require("../models/blockedUser");
        const blockExists = await BlockedUser.findOne({
          $or: [
            { userId: senderId, blockedUserId: recipient._id },
            { userId: recipient._id, blockedUserId: senderId }
          ]
        });
        if (blockExists) {
          throw new AppError("Message blocked: You have blocked this user or they have blocked you.", 400);
        }
      }

      // Set receiver in messageData
      if (recipient) {
        messageData.receiver = recipient._id;
      }
    } else {
      // Group check if message sending is restricted to admins only
      if (conversation.onlyAdminsCanSend) {
        const isAdmin = conversation.admins.some(admin => admin._id.toString() === senderId.toString());
        if (!isAdmin) {
          throw new AppError("Only admins can send messages in this group", 403);
        }
      }
    }

    // Create message in DB
    let message = await chatRepository.createMessage(conversationId, senderId, messageData);
    const Message = require("../models/message");
    
    const populateOptions = [
      { path: "senderId", select: "displayName phoneNumber avatarUrl" }
    ];
    if (message.replyTo) {
      populateOptions.push({
        path: "replyTo",
        populate: { path: "senderId", select: "displayName phoneNumber" }
      });
    }
    message = await Message.populate(message, populateOptions);

    // Update last message in Conversation
    await chatRepository.updateLastMessage(conversationId, message.text || `Sent ${message.type}`, senderId, message.type, message._id);

    // Increment unread count for recipients
    if (conversation.isGroup) {
      const otherParticipants = conversation.participants.filter(p => p._id.toString() !== senderId.toString());
      for (const p of otherParticipants) {
        await chatRepository.incrementUnreadCount(conversationId, p._id.toString());
      }
    } else if (recipient) {
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

  async favouriteConversation(conversationId, userId, favourite = true) {
    const conversation = await chatRepository.findConversationById(conversationId);
    if (!conversation) {
      throw new AppError("Conversation not found", 404);
    }
    const isParticipant = conversation.participants.some(p => p._id.toString() === userId.toString());
    if (!isParticipant) {
      throw new AppError("Access denied", 403);
    }
    await chatRepository.setFavourite(conversationId, userId, favourite);
    logger.info(`Conversation ${conversationId} favourite state set to ${favourite} for user ${userId}`);
    return { conversationId, favourite };
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

  async clearConversation(conversationId, userId) {
    const conversation = await chatRepository.findConversationById(conversationId);
    if (!conversation) {
      throw new AppError("Conversation not found", 404);
    }
    const isParticipant = conversation.participants.some(p => p._id.toString() === userId.toString());
    if (!isParticipant) {
      throw new AppError("Access denied", 403);
    }
    await chatRepository.clearConversation(conversationId, userId);
    logger.info(`Conversation ${conversationId} cleared messages for user ${userId}`);
    return { conversationId };
  }

  async createGroupConversation(userId, name, participantIds, avatarUrl = "") {
    const uniqueIds = Array.from(new Set([userId.toString(), ...participantIds.map(id => id.toString())]));
    const conversation = await chatRepository.createGroupConversation(uniqueIds, name, userId, avatarUrl);
    
    const User = require("../models/user");
    const creator = await User.findById(userId);
    const creatorName = creator ? creator.displayName || creator.phoneNumber : "Someone";
    
    const systemMsg = await chatRepository.createMessage(conversation._id, userId, {
      text: `${creatorName} created group "${name}"`,
      type: "system"
    });

    await chatRepository.updateLastMessage(conversation._id, systemMsg.text, userId, "system", systemMsg._id);
    return conversation;
  }

  async addGroupMembers(conversationId, adminId, memberIds) {
    const conversation = await chatRepository.findConversationById(conversationId);
    if (!conversation) throw new AppError("Group not found", 404);
    if (!conversation.isGroup) throw new AppError("Conversation is not a group", 400);
    
    const isAdmin = conversation.admins.some(admin => admin._id.toString() === adminId.toString());
    if (!isAdmin) throw new AppError("Only group admins can add members", 403);

    const existingParticipants = conversation.participants.map(p => p._id.toString());
    const newMemberIds = memberIds.filter(id => !existingParticipants.includes(id.toString()));
    
    if (newMemberIds.length === 0) {
      return conversation;
    }

    const updatedGroup = await chatRepository.addParticipants(conversationId, newMemberIds);
    
    const User = require("../models/user");
    const admin = await User.findById(adminId);
    const adminName = admin ? admin.displayName || admin.phoneNumber : "Admin";
    
    const addedUsers = await User.find({ _id: { $in: newMemberIds } });
    const addedNames = addedUsers.map(u => u.displayName || u.phoneNumber).join(", ");
    
    const systemMsg = await chatRepository.createMessage(conversationId, adminId, {
      text: `${adminName} added ${addedNames}`,
      type: "system"
    });

    await chatRepository.updateLastMessage(conversationId, systemMsg.text, adminId, "system", systemMsg._id);
    return updatedGroup;
  }

  async removeGroupMember(conversationId, adminId, targetUserId) {
    const conversation = await chatRepository.findConversationById(conversationId);
    if (!conversation) throw new AppError("Group not found", 404);
    if (!conversation.isGroup) throw new AppError("Conversation is not a group", 400);

    const isAdmin = conversation.admins.some(admin => admin._id.toString() === adminId.toString());
    if (!isAdmin) throw new AppError("Only group admins can remove members", 403);

    const isMember = conversation.participants.some(p => p._id.toString() === targetUserId.toString());
    if (!isMember) throw new AppError("User is not a member of this group", 400);

    const updatedGroup = await chatRepository.removeParticipant(conversationId, targetUserId);

    const User = require("../models/user");
    const admin = await User.findById(adminId);
    const adminName = admin ? admin.displayName || admin.phoneNumber : "Admin";
    
    const targetUser = await User.findById(targetUserId);
    const targetName = targetUser ? targetUser.displayName || targetUser.phoneNumber : "User";

    const systemMsg = await chatRepository.createMessage(conversationId, adminId, {
      text: `${adminName} removed ${targetName}`,
      type: "system"
    });

    await chatRepository.updateLastMessage(conversationId, systemMsg.text, adminId, "system", systemMsg._id);
    return updatedGroup;
  }

  async leaveGroup(conversationId, userId) {
    const conversation = await chatRepository.findConversationById(conversationId);
    if (!conversation) throw new AppError("Group not found", 404);
    if (!conversation.isGroup) throw new AppError("Conversation is not a group", 400);

    const isMember = conversation.participants.some(p => p._id.toString() === userId.toString());
    if (!isMember) throw new AppError("You are not a member of this group", 400);

    const wasAdmin = conversation.admins.some(admin => admin._id.toString() === userId.toString());
    let updatedGroup = await chatRepository.removeParticipant(conversationId, userId);

    if (updatedGroup.participants.length > 0 && wasAdmin) {
      const remainingAdmins = updatedGroup.participants.filter(p => 
        conversation.admins.some(admin => admin._id.toString() === p._id.toString() && admin._id.toString() !== userId.toString())
      );
      
      if (remainingAdmins.length === 0) {
        const nextAdminId = updatedGroup.participants[0]._id;
        updatedGroup = await chatRepository.addAdmin(conversationId, nextAdminId);
      }
    }

    const User = require("../models/user");
    const user = await User.findById(userId);
    const userName = user ? user.displayName || user.phoneNumber : "Someone";

    const systemMsg = await chatRepository.createMessage(conversationId, userId, {
      text: `${userName} left the group`,
      type: "system"
    });

    await chatRepository.updateLastMessage(conversationId, systemMsg.text, userId, "system", systemMsg._id);
    return updatedGroup;
  }

  async updateGroupInfo(conversationId, userId, updates) {
    const conversation = await chatRepository.findConversationById(conversationId);
    if (!conversation) throw new AppError("Group not found", 404);
    if (!conversation.isGroup) throw new AppError("Conversation is not a group", 400);

    const isAdmin = conversation.admins.some(admin => admin._id.toString() === userId.toString());
    if (!isAdmin) throw new AppError("Only admins can update group info", 403);

    const allowedUpdates = {};
    if (updates.name !== undefined) allowedUpdates.name = updates.name;
    if (updates.groupDescription !== undefined) allowedUpdates.groupDescription = updates.groupDescription;
    if (updates.avatarUrl !== undefined) allowedUpdates.avatarUrl = updates.avatarUrl;
    if (updates.onlyAdminsCanSend !== undefined) allowedUpdates.onlyAdminsCanSend = updates.onlyAdminsCanSend;

    const updatedGroup = await chatRepository.updateGroupInfo(conversationId, allowedUpdates);

    const User = require("../models/user");
    const user = await User.findById(userId);
    const userName = user ? user.displayName || user.phoneNumber : "Admin";

    let changeText = "";
    if (updates.name && updates.name !== conversation.name) {
      changeText = `${userName} changed the group name to "${updates.name}"`;
    } else if (updates.groupDescription !== undefined && updates.groupDescription !== conversation.groupDescription) {
      changeText = `${userName} changed the group description`;
    } else if (updates.avatarUrl !== undefined && updates.avatarUrl !== conversation.avatarUrl) {
      changeText = `${userName} updated group icon`;
    } else if (updates.onlyAdminsCanSend !== undefined && updates.onlyAdminsCanSend !== conversation.onlyAdminsCanSend) {
      changeText = `${userName} ${updates.onlyAdminsCanSend ? "restricted messaging to admins only" : "allowed all participants to send messages"}`;
    }

    if (changeText) {
      const systemMsg = await chatRepository.createMessage(conversationId, userId, {
        text: changeText,
        type: "system"
      });
      await chatRepository.updateLastMessage(conversationId, systemMsg.text, userId, "system", systemMsg._id);
    }

    return updatedGroup;
  }

  async makeAdmin(conversationId, adminId, targetUserId) {
    const conversation = await chatRepository.findConversationById(conversationId);
    if (!conversation) throw new AppError("Group not found", 404);
    if (!conversation.isGroup) throw new AppError("Conversation is not a group", 400);

    const isAdmin = conversation.admins.some(admin => admin._id.toString() === adminId.toString());
    if (!isAdmin) throw new AppError("Only admins can promote members", 403);

    const isMember = conversation.participants.some(p => p._id.toString() === targetUserId.toString());
    if (!isMember) throw new AppError("Target user is not a member of this group", 400);

    const updatedGroup = await chatRepository.addAdmin(conversationId, targetUserId);

    const User = require("../models/user");
    const admin = await User.findById(adminId);
    const adminName = admin ? admin.displayName || admin.phoneNumber : "Admin";
    const targetUser = await User.findById(targetUserId);
    const targetName = targetUser ? targetUser.displayName || targetUser.phoneNumber : "User";

    const systemMsg = await chatRepository.createMessage(conversationId, adminId, {
      text: `${adminName} made ${targetName} a group admin`,
      type: "system"
    });
    await chatRepository.updateLastMessage(conversationId, systemMsg.text, adminId, "system", systemMsg._id);

    return updatedGroup;
  }

  async removeAdmin(conversationId, adminId, targetUserId) {
    const conversation = await chatRepository.findConversationById(conversationId);
    if (!conversation) throw new AppError("Group not found", 404);
    if (!conversation.isGroup) throw new AppError("Conversation is not a group", 400);

    const isAdmin = conversation.admins.some(admin => admin._id.toString() === adminId.toString());
    if (!isAdmin) throw new AppError("Only admins can dismiss other admins", 403);

    const updatedGroup = await chatRepository.removeAdmin(conversationId, targetUserId);

    const User = require("../models/user");
    const admin = await User.findById(adminId);
    const adminName = admin ? admin.displayName || admin.phoneNumber : "Admin";
    const targetUser = await User.findById(targetUserId);
    const targetName = targetUser ? targetUser.displayName || targetUser.phoneNumber : "User";

    const systemMsg = await chatRepository.createMessage(conversationId, adminId, {
      text: `${adminName} dismissed ${targetName} as admin`,
      type: "system"
    });
    await chatRepository.updateLastMessage(conversationId, systemMsg.text, adminId, "system", systemMsg._id);

    return updatedGroup;
  }
}

module.exports = new ChatService();
