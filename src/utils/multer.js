const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

// Konfigurasi penyimpanan Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    allowed_formats: [
      "jpeg",
      "png",
      "jpg",
      "pdf",
      "doc",
      "docx",
      "odt",
      "ods",
      "xls",
      "xlsx",
    ],
    resource_type: "auto",
  },
});

// Middleware upload
const upload = multer({ storage: storage });

module.exports = upload;
