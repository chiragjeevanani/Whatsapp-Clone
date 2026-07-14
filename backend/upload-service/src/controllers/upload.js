const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const { uploadsDir } = require("../middleware/multerConfig");

// Ensure thumbnails directory exists
const thumbDir = path.join(uploadsDir, "images/thumbnails");
if (!fs.existsSync(thumbDir)) {
  fs.mkdirSync(thumbDir, { recursive: true });
}

const uploadImageController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image file uploaded" });
    }

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `img-${uniqueSuffix}.webp`;
    const thumbFilename = `thumb-${uniqueSuffix}.webp`;

    const destPath = path.join(uploadsDir, "images", filename);
    const thumbDestPath = path.join(thumbDir, thumbFilename);

    // 1. Process main image with Sharp (convert to WebP, resize, compress)
    await sharp(req.file.buffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(destPath);

    // 2. Process thumbnail with Sharp (convert to WebP, resize smaller, compress more)
    await sharp(req.file.buffer)
      .resize({ width: 150 })
      .webp({ quality: 60 })
      .toFile(thumbDestPath);

    const stats = fs.statSync(destPath);

    return res.status(201).json({
      success: true,
      message: "Image processed and uploaded successfully",
      data: {
        url: `/uploads/images/${filename}`,
        thumbnailUrl: `/uploads/images/thumbnails/${thumbFilename}`,
        fileSize: stats.size,
        mimeType: "image/webp",
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const uploadMediaController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No media file uploaded" });
    }

    // Determine subfolder based on file type
    let subFolder = "documents";
    const mime = req.file.mimetype.toLowerCase();
    if (mime.startsWith("video/")) {
      subFolder = "videos";
    } else if (mime.startsWith("audio/") || req.file.fieldname === "voice" || req.file.fieldname === "audio") {
      subFolder = "voice";
    }

    const url = `/uploads/${subFolder}/${req.file.filename}`;

    return res.status(201).json({
      success: true,
      message: "Media uploaded successfully",
      data: {
        url,
        thumbnailUrl: "", // No thumbnail for docs/audio
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  uploadImageController,
  uploadMediaController
};
