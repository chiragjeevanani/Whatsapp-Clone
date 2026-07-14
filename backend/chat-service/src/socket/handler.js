const jwt = require("jsonwebtoken");
const config = require("../config");
const chatService = require("../services/chat");
const logger = require("../../../shared/logger");
const presence = require("../../../shared/redis/presence");

function authenticateSocket(socket, next) {
  try {
    const token = socket.handshake.auth.token || socket.handshake.query.token;
    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    socket.user = decoded;
    next();
  } catch (error) {
    logger.error(`Socket authentication failed: ${error.message}`);
    next(new Error("Authentication error: Invalid token"));
  }
}

function handleSocketConnection(io) {
  io.use(authenticateSocket);

  io.on("connection", async (socket) => {
    const userId = socket.user.userId;
    logger.info(`User connected to WebSocket: ${userId} (Socket ID: ${socket.id})`);

    // Set online in Redis
    await presence.setOnline(userId, socket.id);

    // Join user-specific room for direct broadcasts
    socket.join(`user:${userId}`);

    // Broadcast online status to conversation peers
    try {
      const conversations = await chatService.getConversations(userId);
      conversations.forEach((conv) => {
        conv.participants.forEach((p) => {
          const peerId = p._id.toString();
          if (peerId !== userId) {
            io.to(`user:${peerId}`).emit("online", { userId, status: "online" });
          }
        });
      });
    } catch (err) {
      logger.error(`Failed to broadcast online presence: ${err.message}`);
    }

    socket.on("join_conversation", (conversationId) => {
      socket.join(`conversation:${conversationId}`);
      logger.info(`Socket ${socket.id} (User: ${userId}) joined conversation: ${conversationId}`);
    });

    socket.on("leave_conversation", (conversationId) => {
      socket.leave(`conversation:${conversationId}`);
      logger.info(`Socket ${socket.id} (User: ${userId}) left conversation: ${conversationId}`);
    });

    // Handle typing events
    socket.on("typing", async ({ conversationId }) => {
      logger.info(`WebSocket: Received typing event from user:${userId} for conversation:${conversationId}`);
      await presence.setTyping(conversationId, userId);
      socket.to(`conversation:${conversationId}`).emit("typing", { conversationId, userId });
    });

    socket.on("stop_typing", async ({ conversationId }) => {
      logger.info(`WebSocket: Received stop_typing event from user:${userId} for conversation:${conversationId}`);
      await presence.clearTyping(conversationId, userId);
      socket.to(`conversation:${conversationId}`).emit("stop_typing", { conversationId, userId });
    });

    // Typing fallback for backward compatibility
    socket.on("typing_status", async ({ conversationId, isTyping }) => {
      if (isTyping) {
        await presence.setTyping(conversationId, userId);
        socket.to(`conversation:${conversationId}`).emit("typing", { conversationId, userId });
      } else {
        await presence.clearTyping(conversationId, userId);
        socket.to(`conversation:${conversationId}`).emit("stop_typing", { conversationId, userId });
      }
    });

    // Handle edit and delete message events
    socket.on("edit_message", async ({ conversationId, messageId, text }) => {
      try {
        logger.info(`WebSocket: Received edit_message event from user:${userId} for message:${messageId}`);
        const message = await chatService.editMessage(conversationId, messageId, userId, text);
        io.to(`conversation:${conversationId}`).emit("message_edited", message);

        // Also broadcast updated conversation list preview to participants
        const conversationDetails = await chatService.getConversationDetails(conversationId, userId);
        if (conversationDetails && conversationDetails.participants) {
          conversationDetails.participants.forEach((p) => {
            io.to(`user:${p._id.toString()}`).emit("conversation_update", {
              conversationId,
              lastMessage: message,
            });
          });
        }
      } catch (err) {
        logger.error(`Error in edit_message socket event: ${err.message}`);
      }
    });

    socket.on("delete_for_everyone", async ({ conversationId, messageId }) => {
      try {
        logger.info(`WebSocket: Received delete_for_everyone event from user:${userId} for message:${messageId}`);
        const message = await chatService.deleteMessage(conversationId, messageId, userId, "everyone");
        
        // Emit message_deleted_everyone to the room
        io.to(`conversation:${conversationId}`).emit("message_deleted_everyone", { conversationId, messageId, message });

        // Update conversation list preview for everyone
        const conversationDetails = await chatService.getConversationDetails(conversationId, userId);
        if (conversationDetails && conversationDetails.participants) {
          const chatRepository = require("../repositories/chat");
          const latestMsg = await chatRepository.findLatestActiveMessage(conversationId);
          const previewMsg = latestMsg || {
            _id: message._id,
            text: "This message was deleted.",
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
      } catch (err) {
        logger.error(`Error in delete_for_everyone socket event: ${err.message}`);
      }
    });

    socket.on("delete_for_me", async ({ conversationId, messageId }) => {
      try {
        logger.info(`WebSocket: Received delete_for_me event from user:${userId} for message:${messageId}`);
        await chatService.deleteMessage(conversationId, messageId, userId, "me");
        
        // Confirm privately to the user who deleted the message
        socket.emit("message_deleted_me", { conversationId, messageId });
      } catch (err) {
        logger.error(`Error in delete_for_me socket event: ${err.message}`);
      }
    });

    // Handle read/delivered receipt updates
    socket.on("message_read", async ({ conversationId, messageId }) => {
      try {
        await chatService.markMessageRead(messageId, userId);
        io.to(`conversation:${conversationId}`).emit("message_status", {
          messageId,
          status: "read",
          conversationId,
        });
      } catch (err) {
        logger.error(`Socket message_read error: ${err.message}`);
      }
    });

    socket.on("message_delivered", async ({ conversationId, messageId }) => {
      try {
        await chatService.markMessageDelivered(messageId, userId);
        io.to(`conversation:${conversationId}`).emit("message_status", {
          messageId,
          status: "delivered",
          conversationId,
        });
      } catch (err) {
        logger.error(`Socket message_delivered error: ${err.message}`);
      }
    });

    socket.on("send_message", async ({ conversationId, text, type = "text", fileUrl = "" }) => {
      try {
        const message = await chatService.sendMessage(conversationId, userId, text, type, fileUrl);
        const conversation = await chatService.getConversationDetails(conversationId, userId);

        io.to(`conversation:${conversationId}`).emit("new_message", message);

        conversation.participants.forEach((p) => {
          io.to(`user:${p._id.toString()}`).emit("conversation_update", {
            conversationId,
            lastMessage: message,
          });
        });
      } catch (err) {
        logger.error(`Socket send_message error: ${err.message}`);
        socket.emit("error", { message: err.message });
      }
    });

    socket.on("disconnect", async () => {
      logger.info(`User disconnected from WebSocket: ${userId} (Socket ID: ${socket.id})`);
      
      // Set offline in Redis and get lastSeen timestamp
      await presence.setOffline(userId, socket.id);
      const lastSeen = await presence.getLastSeen(userId) || new Date().toISOString();

      // Broadcast offline status to conversation peers
      try {
        const conversations = await chatService.getConversations(userId);
        conversations.forEach((conv) => {
          conv.participants.forEach((p) => {
            const peerId = p._id.toString();
            if (peerId !== userId) {
              io.to(`user:${peerId}`).emit("offline", { userId, lastSeen });
            }
          });
        });
      } catch (err) {
        logger.error(`Failed to broadcast offline presence: ${err.message}`);
      }
    });
  });
}

module.exports = { handleSocketConnection };
