const prisma = require("../../db/prisma");
const bcrypt = require("bcrypt");
const { generateToken } = require("../../utils/jwtUtils");

const getStudents = async (req, res) => {
  try {
    const students = await prisma.user.findMany({
      where: {
        role: "STUDENT",
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        bio: true,
      },
    });
    if (students.length === 0) {
      return res.status(404).json({ message: "Students not found" });
    }
    return res.status(200).json({
      message: "Students fetched successfully",
      data: students,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching students" });
  }
};
const createStudent = async (req, res) => {
  try {
    const { name, email, password, bio } = req.body;

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
        bio: bio,
      },
    });

    res.status(201).json({
      message: "Student created successfully",
      data: {
        id: newStudent.id,
        name: newStudent.name,
        email: newStudent.email,
        bio: bio,
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
    const student = await prisma.user.findUnique({
      where: { id: parseInt(studentId) },
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.status(200).json({ message: "Student found", data: student });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    if (!studentId) {
      return res.status(404).json({ message: "Student not found" });
    }
    const student = await prisma.user.findUnique({
      where: { id: parseInt(studentId) },
    });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    await prisma.user.delete({
      where: { id: parseInt(studentId) },
    });
    return res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error deleting student" });
  }
};

module.exports = {
  createStudent,
  getStudents,
  getStudentByID,
  deleteStudent,
};
