const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    displayName: {
      type: String,
      trim: true,
      default: "",
    },
    avatarUrl: {
      type: String,
      default: "",
    },
    about: {
      type: String,
      default: "Available for chat...",
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    secretCodeHash: {
      type: String,
      default: "",
    },
    hasSecretCode: {
      type: Boolean,
      default: false,
    },
    fcmTokens: [
      {
        token: { type: String, required: true },
        platform: { type: String, default: "web" },
        createdAt: { type: Date, default: Date.now }
      }
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
