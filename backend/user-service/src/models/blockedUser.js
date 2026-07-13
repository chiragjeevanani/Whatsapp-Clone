const mongoose = require("mongoose");

const blockedUserSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    blockedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate blocks
blockedUserSchema.index({ userId: 1, blockedUserId: 1 }, { unique: true });

module.exports = mongoose.model("BlockedUser", blockedUserSchema);
