const express = require("express");
const userController = require("../controllers/user");
const authMiddleware = require("../../../shared/middleware/authMiddleware");

const router = express.Router();

// Apply authMiddleware to all user routes
router.use(authMiddleware);

router.get("/me", userController.getMe);
router.put("/me", userController.updateMe);
router.get("/contacts", userController.getContacts);
router.post("/block", userController.blockUser);
router.post("/unblock", userController.unblockUser);
router.get("/privacy", userController.getPrivacy);
router.patch("/privacy", userController.updatePrivacy);
router.get("/:id", userController.getUserById);

module.exports = router;
