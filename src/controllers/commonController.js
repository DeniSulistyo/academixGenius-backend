const prisma = require("../db/prisma");
const { generateToken } = require("../utils/jwtUtils");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    const token = generateToken({
      id: user.id,
      role: user.role,
    });

    res.status(200).json({
      message: "Login successful",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        imageUrl: user.imageUrl,
        token: token,
        teach: user.teach,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        schedules: true,
        user: true,
        materials: {
          include: {
            assignments: true,
          },
        },
      },
    });

    if (courses.length === 0) {
      return res.status(404).json({ message: "Courses not found" });
    }

    res.status(200).json({
      message: "Courses fetched successfully",
      data: courses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching courses" });
  }
};

const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await prisma.course.findUnique({
      where: {
        id: parseInt(courseId),
      },
      include: {
        schedules: true,
        user: true,
      },
    });

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    return res.status(200).json({
      message: "Course fetched successfully",
      data: {
        course,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error fetching course by id",
      error: error.mesage,
    });
  }
};

// material

const getMaterials = async (req, res) => {
  try {
    const materials = await prisma.material.findMany();
    return res
      .status(200)
      .json({ message: "Materials fetched successfully", data: materials });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching materials" });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  getMaterials,
  login,
};
