const cloudinary = require("./cloudinary");
const extractPublicId = (url) => {
  const regex = /\/v(\d+)\/(.*)\./;
  const matches = url.match(regex);
  return matches ? matches[2] : null;
};

// Fungsi untuk menghapus gambar dari Cloudinary
const removeCloudinary = async (fileUrl) => {
  try {
    const filePublicId = extractPublicId(fileUrl);
    if (filePublicId) {
      const result = await cloudinary.uploader.destroy(filePublicId);
      console.log("Cloudinary delete result:", result);
      return result.result === "ok";
    }
    return false;
  } catch (error) {
    console.error("Error removing image from Cloudinary:", error);
    return false;
  }
};

module.exports = removeCloudinary;
