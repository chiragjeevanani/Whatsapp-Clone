const Conversation = require("../models/conversation");
const Message = require("../models/message");

class ChatRepository {
  async findConversations(userId) {
    return Conversation.find({ 
      participants: userId,
      $or: [
        { isGroup: true },
        { "lastMessage.text": { $ne: "Conversation started" } }
      ],
      deletedFor: { $ne: userId }
    })
      .populate("participants", "displayName phoneNumber avatarUrl about lastSeen")
      .populate("lastMessage.senderId", "displayName phoneNumber")
      .sort({ updatedAt: -1 });
  }

  async findConversationById(conversationId) {
    return Conversation.findById(conversationId)
      .populate("participants", "displayName phoneNumber avatarUrl about lastSeen")
      .populate("admins", "displayName phoneNumber avatarUrl about lastSeen")
      .populate("createdBy", "displayName phoneNumber");
  }

  async find1to1Conversation(user1Id, user2Id) {
    return Conversation.findOne({
      isGroup: false,
      participants: { $all: [user1Id, user2Id], $size: 2 },
    }).populate("participants", "displayName phoneNumber avatarUrl about lastSeen");
  }

  async createConversation(participantIds, name = "", isGroup = false) {
    const conversation = new Conversation({
      participants: participantIds,
      name,
      isGroup,
      lastMessage: {
        text: "Conversation started",
        timestamp: new Date(),
      },
    });
    const saved = await conversation.save();
    return saved.populate("participants", "displayName phoneNumber avatarUrl about lastSeen");
  }

  async createGroupConversation(participantIds, name, createdBy, avatarUrl = "") {
    const conversation = new Conversation({
      participants: participantIds,
      name,
      isGroup: true,
      avatarUrl,
      createdBy,
      admins: [createdBy],
      lastMessage: {
        text: "Group created",
        timestamp: new Date(),
        type: "system",
      },
    });
    const saved = await conversation.save();
    return saved.populate("participants", "displayName phoneNumber avatarUrl about lastSeen");
  }

  async addParticipants(conversationId, userIds) {
    return Conversation.findByIdAndUpdate(
      conversationId,
      { $addToSet: { participants: { $each: userIds } } },
      { new: true }
    ).populate("participants", "displayName phoneNumber avatarUrl about lastSeen");
  }

  async removeParticipant(conversationId, userId) {
    return Conversation.findByIdAndUpdate(
      conversationId,
      { 
        $pull: { 
          participants: userId,
          admins: userId 
        } 
      },
      { new: true }
    ).populate("participants", "displayName phoneNumber avatarUrl about lastSeen");
  }

  async updateGroupInfo(conversationId, updates) {
    return Conversation.findByIdAndUpdate(
      conversationId,
      { $set: updates },
      { new: true }
    ).populate("participants", "displayName phoneNumber avatarUrl about lastSeen");
  }

  async addAdmin(conversationId, userId) {
    return Conversation.findByIdAndUpdate(
      conversationId,
      { $addToSet: { admins: userId } },
      { new: true }
    ).populate("participants", "displayName phoneNumber avatarUrl about lastSeen");
  }

  async removeAdmin(conversationId, userId) {
    return Conversation.findByIdAndUpdate(
      conversationId,
      { $pull: { admins: userId } },
      { new: true }
    ).populate("participants", "displayName phoneNumber avatarUrl about lastSeen");
  }

  async updateLastMessage(conversationId, text, senderId, type = "text", messageId = null) {
    return Conversation.findByIdAndUpdate(
      conversationId,
      {
        lastMessage: {
          text,
          senderId,
          timestamp: new Date(),
          type,
        },
        lastMessageId: messageId,
        lastMessageAt: new Date(),
      },
      { new: true }
    );
  }

  async findMessages(conversationId, userId, before = null, limit = 15) {
    const query = { 
      conversationId,
      deletedForMe: { $ne: userId }
    };
    if (before) {
      query._id = { $lt: before };
    }
    const messages = await Message.find(query)
      .populate("senderId", "displayName phoneNumber avatarUrl")
      .populate({
        path: "replyTo",
        populate: { path: "senderId", select: "displayName phoneNumber" }
      })
      .sort({ createdAt: -1 })
      .limit(limit);
    return messages.reverse();
  }

  async findMessageById(messageId) {
    return Message.findById(messageId);
  }

  async findLatestActiveMessage(conversationId) {
    return Message.findOne({
      conversationId,
      deletedForEveryone: false
    }).sort({ createdAt: -1 });
  }

  async createMessage(conversationId, senderId, messageData) {
    const message = new Message({
      conversationId,
      senderId,
      ...messageData,
    });
    return message.save();
  }

  async markMessagesAsRead(conversationId, readerId) {
    // Mark all messages in conversation not sent by readerId as read in DB
    await Message.updateMany(
      { conversationId, senderId: { $ne: readerId }, status: { $ne: "read" } },
      { $set: { status: "read" }, $addToSet: { readBy: readerId } }
    );
    // Reset unread count for this user
    return this.resetUnreadCount(conversationId, readerId);
  }

  async countUnreadMessages(conversationId, userId) {
    return Message.countDocuments({
      conversationId,
      senderId: { $ne: userId },
      status: { $ne: "read" }
    });
  }

  async markMessageDelivered(messageId, userId) {
    return Message.findByIdAndUpdate(
      messageId,
      { 
        status: "delivered",
        $addToSet: { deliveredTo: userId }
      },
      { new: true }
    );
  }

  async markMessageRead(messageId, userId) {
    return Message.findByIdAndUpdate(
      messageId,
      { 
        status: "read",
        $addToSet: { readBy: userId }
      },
      { new: true }
    );
  }

  async incrementUnreadCount(conversationId, userId) {
    const update = {};
    update[`unreadCount.${userId}`] = 1;
    return Conversation.findByIdAndUpdate(
      conversationId,
      { $inc: update },
      { new: true }
    );
  }

  async resetUnreadCount(conversationId, userId) {
    const update = {};
    update[`unreadCount.${userId}`] = 0;
    return Conversation.findByIdAndUpdate(
      conversationId,
      { $set: update },
      { new: true }
    );
  }

  async softDeleteConversation(conversationId, userId) {
    return Conversation.findByIdAndUpdate(
      conversationId,
      { $addToSet: { deletedFor: userId } },
      { new: true }
    );
  }

  async setArchived(conversationId, userId, archived) {
    const update = {};
    update[`archived.${userId}`] = archived;
    return Conversation.findByIdAndUpdate(
      conversationId,
      { $set: update },
      { new: true }
    );
  }

  async setMuted(conversationId, userId, enabled, until = null) {
    const update = {};
    update[`muted.${userId}`] = { enabled, until };
    return Conversation.findByIdAndUpdate(
      conversationId,
      { $set: update },
      { new: true }
    );
  }

  async setLocked(conversationId, userId, locked) {
    const update = {};
    update[`locked.${userId}`] = locked;
    return Conversation.findByIdAndUpdate(
      conversationId,
      { $set: update },
      { new: true }
    );
  }

  async setFavourite(conversationId, userId, favourite) {
    const update = {};
    update[`favourites.${userId}`] = favourite;
    return Conversation.findByIdAndUpdate(
      conversationId,
      { $set: update },
      { new: true }
    );
  }

  async clearConversation(conversationId, userId) {
    const Message = require("../models/message");
    return Message.updateMany(
      { conversationId },
      { $addToSet: { deletedForMe: userId } }
    );
  }
}

module.exports = new ChatRepository();
