const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const {
  getMaterials,
  login,
  getCourses,
} = require("../controllers/commonController");

const router = express.Router();

router.post("/login", login);
router.get(
  "/materials",
  authMiddleware,
  roleMiddleware("STUDENT"),
  getMaterials
);

router.get("/courses", authMiddleware, roleMiddleware("STUDENT"), getCourses);

module.exports = router;
