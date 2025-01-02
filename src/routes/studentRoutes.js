const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const { login } = require("../controllers/commonController");
const { createAttendance } = require("../controllers/students/attendance");
const {
  markAsDone,
  getMaterials,
} = require("../controllers/students/material");
const { getCourses } = require("../controllers/students/course");

const router = express.Router();

router.post("/login", login);
router.get(
  "/materials",
  authMiddleware,
  roleMiddleware("STUDENT"),
  getMaterials
);

router.post(
  "/material/:materialId",
  authMiddleware,
  roleMiddleware("STUDENT"),
  markAsDone
);

router.get("/courses", authMiddleware, roleMiddleware("STUDENT"), getCourses);

// attendance
router.post(
  "/attendance",
  authMiddleware,
  roleMiddleware("STUDENT"),
  createAttendance
);

module.exports = router;
