const express = require("express");
const authController = require("../controllers/auth");
const authMiddleware = require("../../../shared/middleware/authMiddleware");

const router = express.Router();

router.post("/login", authController.requestOtp);
router.post("/verify", authController.verifyOtp);
router.post("/refresh", authController.refresh);
router.post("/logout", authMiddleware, authController.logout);
router.post("/verify-token", authController.verifyTokenInternal);

module.exports = router;
