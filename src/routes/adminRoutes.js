const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const upload = require("../utils/multer");
const { createAdmin, adminLogin } = require("../controllers/admins/account");
const {
  createStudent,
  getStudents,
  deleteStudent,
  getStudentByID,
  updateStudent,
} = require("../controllers/admins/student");
const {
  createCourse,
  getCourses,
  deleteCourse,
  getCourseByID,
  getCourseByAdminId,
  updateCourse,
  addStudentToCourse,
  removeStudentFromCourse,
} = require("../controllers/admins/course");
const {
  createMaterial,
  getMaterials,
  getMaterialById,
  updateMaterial,
  deleteMaterial,
  createAssigment,
  createAssignment,
} = require("../controllers/admins/material");

const router = express.Router();

router.post("/register", upload.single("imageUrl"), createAdmin);
router.post("/login", adminLogin);

// student

router.get("/students", authMiddleware, roleMiddleware("ADMIN"), getStudents);
router.post(
  "/student",
  upload.single("imageUrl"),
  authMiddleware,
  roleMiddleware("ADMIN"),
  createStudent
);
router.get(
  "/student/:studentId",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getStudentByID
);
router.put(
  "/student/:studentId",
  authMiddleware,
  roleMiddleware("ADMIN"),
  upload.single("imageUrl"),
  updateStudent
);
router.delete(
  "/student/:studentId",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteStudent
);

// course
router.get("/courses", authMiddleware, roleMiddleware("ADMIN"), getCourses);
router.post(
  "/course",
  authMiddleware,
  roleMiddleware("ADMIN"),
  upload.single("imageUrl"),
  createCourse
);
router.get(
  "/course/:courseId",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getCourseByID
);
router.delete(
  "/course/:courseId",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteCourse
);

router.get(
  "/courses/:userId",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getCourseByAdminId
);

router.put(
  "/course/:courseId",
  authMiddleware,
  roleMiddleware("ADMIN"),
  upload.single("imageUrl"),
  updateCourse
);

router.post(
  "/course/:courseId/student/:studentId",
  authMiddleware,
  roleMiddleware("ADMIN"),
  addStudentToCourse
);

router.delete(
  "/course/:courseId/student/:studentId",
  authMiddleware,
  roleMiddleware("ADMIN"),
  removeStudentFromCourse
);

// material
router.post(
  "/course/:courseId/material",
  authMiddleware,
  roleMiddleware("ADMIN"),
  upload.single("fileUrl"),
  createMaterial
);

router.get(
  "/course/:courseId/materials",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getMaterials
);

router.get(
  "/course/:courseId/material/:materialId",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getMaterialById
);

router.put(
  "/course/:courseId/material/:materialId",
  authMiddleware,
  roleMiddleware("ADMIN"),
  upload.single("fileUrl"),
  updateMaterial
);

router.delete(
  "/course/:courseId/material/:materialId",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteMaterial
);

// assigment
router.post(
  "/course/:courseId/material/:materialId/assignment",
  authMiddleware,
  roleMiddleware("ADMIN"),
  upload.single("fileUrl"),

  createAssignment
);

module.exports = router;
