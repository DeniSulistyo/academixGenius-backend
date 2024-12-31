const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const {
  createAdmin,
  deleteAdmin,
  getAdmins,
  getAdminById,
  updateAdmin,
} = require("../controllers/superadmins/admin");
const upload = require("../utils/multer");
const { login } = require("../controllers/commonController");

const router = express.Router();

router.get("/admins", authMiddleware, roleMiddleware("SUPER_ADMIN"), getAdmins);

router.post("/login", login);
router.post(
  "/admin",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN"),
  upload.single("image"),
  createAdmin
);

router.get(
  "/admin/:adminId",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN"),
  getAdminById
);

router.put(
  "/admin/:adminId",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN"),
  upload.single("image"),
  updateAdmin
);

router.delete(
  "/admin/:adminId",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN"),
  deleteAdmin
);

module.exports = router;
