const express = require("express");
const { uploadImage, uploadMedia } = require("../middleware/multerConfig");
const { uploadImageController, uploadMediaController } = require("../controllers/upload");
const authMiddleware = require("../../../shared/middleware/authMiddleware");

const router = express.Router();

// Protect all upload routes
router.use(authMiddleware);

// Define endpoints
router.post("/image", uploadImage.single("image"), uploadImageController);
router.post("/video", uploadMedia.single("video"), uploadMediaController);
router.post("/document", uploadMedia.single("document"), uploadMediaController);
router.post("/audio", uploadMedia.single("audio"), uploadMediaController);

module.exports = router;
