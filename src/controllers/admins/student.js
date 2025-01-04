const prisma = require("../../db/prisma");
const bcrypt = require("bcrypt");
const cloudinary = require("../../utils/cloudinary");
const removeCloudinary = require("../../utils/removeCloudinary");

const getStudents = async (req, res) => {
  try {
    const adminId = req.user.id;
    const students = await prisma.user.findMany({
      where: {
        role: "STUDENT",
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        imageUrl: true,
        createdBy: true, // Tambahkan field createdBy
        creator: {
          // Relasi creator untuk mendapatkan informasi admin
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    if (students.length === 0) {
      return res.status(404).json({ message: "Students not found" });
    }
    return res.status(200).json({
      message: "Students fetched successfully",
      data: {
        students,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching students" });
  }
};
const createStudent = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const imageUrl = req.file ? req.file.path : null;
    const adminId = req.user.id;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "STUDENT",
        imageUrl: imageUrl,
        createdBy: adminId,
      },
    });

    res.status(201).json({
      message: "Student created successfully",
      data: {
        id: newStudent.id,
        name: newStudent.name,
        email: newStudent.email,
        imageUrl: imageUrl,
        role: newStudent.role,
        createdBy: adminId,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating student" });
  }
};

const getStudentByID = async (req, res) => {
  try {
    const { studentId } = req.params;
    const adminId = req.user.id;
    const student = await prisma.user.findUnique({
      where: { id: parseInt(studentId) },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        imageUrl: true,
        createdBy: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!student || student.role !== "STUDENT") {
      return res.status(404).json({ message: "Student not found" });
    }

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.status(200).json({
      message: "Student found",
      data: {
        student,
        createdByName: student.creator ? student.creator.name : "Unknown",
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const adminId = req.user.id;

    if (!studentId) {
      return res.status(404).json({ message: "Student not found" });
    }

    const student = await prisma.user.findUnique({
      where: { id: parseInt(studentId) },
      select: {
        id: true,
        imageUrl: true,
        name: true,
        email: true,
        role: true,
        imageUrl: true,
        createdBy: true,
      },
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (student.createdBy !== adminId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this student" });
    }

    await prisma.presence.deleteMany({
      where: { userId: student.id },
    });

    if (student.imageUrl) {
      const isDeleted = await removeCloudinary(student.imageUrl);

      if (!isDeleted) {
        return res.status(500).json({ message: "Error deleting image" });
      }
    } else {
      return res.status(404).json({ message: "Image not found" });
    }

    await prisma.user.delete({
      where: { id: parseInt(studentId) },
    });

    return res.status(200).json({
      message: "Student deleted successfully",
      data: student,
      adminId,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error deleting student" });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const adminId = req.user.id;
    const { name, email, password } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    const student = await prisma.user.findUnique({
      where: { id: parseInt(studentId) },
    });

    if (!student || student.role !== "STUDENT") {
      return res.status(404).json({ message: "Student not found" });
    }

    if (student.createdBy !== adminId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this student" });
    }

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (imageUrl && student.imageUrl) {
      const isDeleted = await removeCloudinary(student.imageUrl);
      if (!isDeleted) {
        return res
          .status(500)
          .json({ message: "Error deleting old image from Cloudinary" });
      }
    }

    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : student.password;

    const updatedStudent = await prisma.user.update({
      where: { id: parseInt(studentId) },
      data: {
        name,
        email,
        password: hashedPassword,
        imageUrl: imageUrl,
      },
    });

    res.status(200).json({
      message: "Student updated successfully",
      data: updatedStudent,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updated student" });
  }
};

module.exports = {
  createStudent,
  getStudents,
  getStudentByID,
  deleteStudent,
  updateStudent,
};
