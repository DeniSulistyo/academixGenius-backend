const express = require("express");
const { login } = require("../controllers/superadmins/account");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const {
  createStudent,
  getStudents,
  getStudentByID,
  deleteStudent,
} = require("../controllers/admins/student");
const {
  createMaterial,
  getMaterials,
} = require("../controllers/admins/material");
const upload = require("../utils/multer");
const {
  createCourse,
  deleteCourse,
  getCourses,
  getCourseById,
  updateCourse,
} = require("../controllers/admins/course");

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
module.exports = router;
