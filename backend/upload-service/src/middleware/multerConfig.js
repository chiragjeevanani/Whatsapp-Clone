const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure physical uploads directory structure exists at the root of the backend folder
const uploadsDir = path.resolve(__dirname, "../../../uploads");
const subDirs = ["images", "videos", "documents", "voice", "profile", "status"];
subDirs.forEach((dir) => {
  const fullPath = path.join(uploadsDir, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Memory storage for images (so Sharp can optimize directly from buffer)
const memoryStorage = multer.memoryStorage();

// Disk storage for other media types (video, audio, docs)
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let subFolder = "documents";
    const mime = file.mimetype.toLowerCase();
    
    if (mime.startsWith("video/")) {
      subFolder = "videos";
    } else if (mime.startsWith("audio/") || file.fieldname === "voice" || file.fieldname === "audio") {
      subFolder = "voice";
    }
    
    cb(null, path.join(uploadsDir, subFolder));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname) || ".bin";
    cb(null, `${file.fieldname || "file"}-${uniqueSuffix}${ext}`);
  }
});

// Multer upload instances
const uploadImage = multer({
  storage: memoryStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  }
});

const uploadMedia = multer({
  storage: diskStorage,
  limits: { fileSize: 100 * 1024 * 1024 } // Up to 100MB
});

module.exports = {
  uploadImage,
  uploadMedia,
  uploadsDir
};
