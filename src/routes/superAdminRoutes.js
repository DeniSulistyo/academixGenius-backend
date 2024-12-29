const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { login } = require("../controllers/superadmins/account");
const roleMiddleware = require("../middlewares/roleMiddleware");
const {
  createAdmin,
  deleteAdmin,
  getAdmins,
  getAdminById,
  updateAdmin,
} = require("../controllers/superadmins/admin");

const router = express.Router();

router.get("/admins", authMiddleware, roleMiddleware("SUPER_ADMIN"), getAdmins);

router.post("/login", login);
router.post(
  "/admin",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN"),
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
  updateAdmin
);

router.delete(
  "/admin/:adminId",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN"),
  deleteAdmin
);

module.exports = router;
