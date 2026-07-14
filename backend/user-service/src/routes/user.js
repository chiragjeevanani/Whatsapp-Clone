const express = require("express");
const userController = require("../controllers/user");
const authMiddleware = require("../../../shared/middleware/authMiddleware");

const router = express.Router();

// Apply authMiddleware to all user routes
router.use(authMiddleware);

router.get("/me", userController.getMe);
router.put("/me", userController.updateMe);
router.get("/contacts", userController.getContacts);
router.post("/contacts", userController.addContact);
router.delete("/contacts/:contactUserId", userController.removeContact);
router.post("/contacts/sync", userController.syncContacts);
router.post("/block", userController.blockUser);
router.post("/unblock", userController.unblockUser);
router.get("/privacy", userController.getPrivacy);
router.patch("/privacy", userController.updatePrivacy);
router.get("/:id", userController.getUserById);

// Secret Code Lock routes
router.post("/secret-code/setup", userController.setupSecretCode);
router.post("/secret-code/verify", userController.verifySecretCode);

// FCM push notifications token registration
router.post("/fcm-token", userController.updateFcmToken);

module.exports = router;
