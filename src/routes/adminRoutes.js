const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const {
  createStudent,
  getStudents,
  getStudentByID,
  deleteStudent,
} = require("../controllers/admins/student");
const { createMaterial } = require("../controllers/admins/material");
const upload = require("../utils/multer");
const {
  createCourse,
  deleteCourse,
  updateCourse,
} = require("../controllers/admins/course");
const {
  getCourses,
  getCourseById,
  getMaterials,
  login,
} = require("../controllers/commonController");
const {
  getAttendances,
  markAttendance,
} = require("../controllers/admins/attendance");

const router = express.Router();

router.post("/login", login);
router.get("/students", authMiddleware, roleMiddleware("ADMIN"), getStudents);
router.get(
  "/student/:studentId",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getStudentByID
);

router.post(
  "/create-student",
  authMiddleware,
  roleMiddleware("ADMIN"),
  upload.single("image"),
  createStudent
);

router.delete(
  "/student/:studentId",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteStudent
);

router.get("/courses", authMiddleware, roleMiddleware("ADMIN"), getCourses);
router.post(
  "/course",
  authMiddleware,
  roleMiddleware("ADMIN"),
  upload.single("file"),
  createCourse
);
router.post(
  "/create-material",
  authMiddleware,
  roleMiddleware("ADMIN"),
  upload.fields([
    { name: "materialFile", maxCount: 1 },
    { name: "assignmentFile", maxCount: 1 },
  ]),
  createMaterial
);

router.get(
  "/course/:courseId",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getCourseById
);

router.put(
  "/course/:courseId",
  authMiddleware,
  roleMiddleware("ADMIN"),
  upload.single("image"),
  updateCourse
);

router.delete(
  "/course/:courseId",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteCourse
);

router.get("/materials", authMiddleware, roleMiddleware("ADMIN"), getMaterials);

// attendance
router.get(
  "/attendances",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getAttendances
);

router.post("/attendance", authMiddleware, roleMiddleware("ADMIN"));

module.exports = router;
