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
    const userId = req.user.id; // Pastikan Anda memiliki `userId` dari token atau session

    const courses = await prisma.course.findMany({
      include: {
        schedules: true,
        user: true,
        materials: {
          include: {
            assignments: true,
          },
        },
        _count: {
          select: { materials: true },
        },
        progreses: {
          where: {
            done: true,
            userId: userId,
          },
        },
      },
    });

    if (courses.length === 0) {
      return res.status(404).json({ message: "Courses not found" });
    }

    // Hitung progres untuk setiap course
    const coursesWithProgress = courses.map((course) => {
      const totalMaterials = course._count.materials || 0;
      const doneMaterials = course.progreses.length || 0;
      const progress =
        totalMaterials > 0 ? (doneMaterials / totalMaterials) * 100 : 0;

      return {
        ...course,
        progress: Math.round(progress), // Persentase progress dibulatkan ke angka bulat
      };
    });

    // Respon sukses dengan data course dan progres
    res.status(200).json({
      message: "Courses fetched successfully",
      data: coursesWithProgress,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);

    // Respon error jika ada masalah
    res.status(500).json({
      message: "Error fetching courses",
      error: error.message,
    });
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

const getForums = async (req, res) => {
  try {
    const forums = await prisma.forum.findMany({
      include: {
        user: true,
        members: true,
        messages: {
          include: {
            user: true,
          },
        },
      },
    });

    if (forums.length === 0) {
      return res.status(404).json({ message: "Forums not found" });
    }

    return res.status(200).json({
      message: "Forums fetched successfully",
      data: forums,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching forum" });
  }
};

const getMessage = async (req, res) => {
  try {
    const { forumId } = req.params;
    const messages = await prisma.message.findMany({
      where: {
        forumId: parseInt(forumId),
      },
      include: {
        user: true,
        parent: true,
      },
    });
    return res
      .status(200)
      .json({ message: "Messages fetched successfully", data: messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching messages" });
  }
};

const createMessage = async (req, res) => {
  try {
    const { forumId, content, parentId } = req.body;
    const fileUrl = req.file ? req.file.path : null;
    const userId = req.user.id;

    if (!forumId || !content) {
      return res
        .status(400)
        .json({ message: "forumId and content are required" });
    }

    const newMessage = await prisma.message.create({
      data: {
        userId,
        forumId: parseInt(forumId),
        content,
        fileUrl,
        parentId: parentId ? parseInt(parentId) : null,
      },
    });

    return res
      .status(201)
      .json({ message: "Message created successfully", data: newMessage });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error creating message" });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    if (!messageId) {
      return res.status(404).json({ message: "Message not found" });
    }

    const message = await prisma.message.findUnique({
      where: {
        id: parseInt(messageId),
      },
    });

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.userId !== userId) {
      return res
        .status(401)
        .json({ message: "You can only delete your own messages" });
    }

    const deletedMessage = await prisma.message.delete({
      where: {
        id: parseInt(messageId),
      },
    });

    return res
      .status(200)
      .json({ message: "Message deleted successfully", data: deletedMessage });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error deleting message" });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  getMaterials,
  login,
  getForums,
  createMessage,
  getMessage,
  deleteMessage,
};
