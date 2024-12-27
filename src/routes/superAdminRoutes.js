const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { login } = require("../controllers/superadmins/account");
const roleMiddleware = require("../middlewares/roleMiddleware");
const { createAdmin } = require("../controllers/superadmins/admin");

const router = express.Router();

router.post("/login", login);
router.post(
  "/create-admin",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN"),
  createAdmin
);

module.exports = router;
