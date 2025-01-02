const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const {
  createStudent,
  getStudents,
  getStudentByID,
  deleteStudent,
  updateStudent,
} = require("../controllers/admins/student");
const {
  createMaterial,
  updateMaterial,
  getMaterialById,
  deleteMaterial,
} = require("../controllers/admins/material");
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
  getForums,
  createMessage,
  getMessage,
  deleteMessage,
} = require("../controllers/commonController");
const { getAttendances } = require("../controllers/admins/attendance");
const { createForum } = require("../controllers/admins/forum");
const { createAssignment } = require("../controllers/admins/assignment");

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
  "/student",
  authMiddleware,
  roleMiddleware("ADMIN"),
  upload.single("image"),
  createStudent
);

router.put(
  "/student/:studentId",
  authMiddleware,
  roleMiddleware("ADMIN"),
  upload.single("image"),
  updateStudent
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
  "/material",
  authMiddleware,
  roleMiddleware("ADMIN"),
  upload.single("file"),
  createMaterial
);

router.get("/materials", authMiddleware, roleMiddleware("ADMIN"), getMaterials);

router.get(
  "/material/:materialId",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getMaterialById
);

router.put(
  "/material/:materialId",
  authMiddleware,
  roleMiddleware("ADMIN"),
  upload.single("file"),
  updateMaterial
);

router.delete(
  "/material/:materialId",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteMaterial
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

// assigments
router.post(
  "/assignment",
  authMiddleware,
  roleMiddleware("ADMIN"),
  upload.single("file"),
  createAssignment
);

// attendance
router.get(
  "/attendances",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getAttendances
);

// forums
router.get("/forums", authMiddleware, roleMiddleware("ADMIN"), getForums);

router.post("/forum", authMiddleware, roleMiddleware("ADMIN"), createForum);

router.post(
  "/message",
  authMiddleware,
  roleMiddleware("ADMIN"),
  upload.single("file"),
  createMessage
);

router.get(
  "/message/:forumId",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getMessage
);

router.delete(
  "/message/:messageId",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteMessage
);

module.exports = router;
