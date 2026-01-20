const multer = require('multer');
const path = require('path');

// Allowed image MIME types
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

// Multer storage (in memory — we don't save locally)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(
      new Error('Only image files (JPEG, PNG, JPG, WebP) are allowed'),
      false
    );
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB max
  },
  fileFilter: fileFilter
});

// Custom middleware to handle file presence
const requireProfileImage = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      error: 'Profile image is required'
    });
  }
  next();
};

module.exports = { upload, requireProfileImage };