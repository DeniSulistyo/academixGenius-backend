const prisma = require("../../db/prisma");
const removeCloudinary = require("../../utils/removeCloudinary");

const getCourses = async (req, res) => {
  try {
    const adminId = req.user.id;
    const courses = await prisma.course.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            imageUrl: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                imageUrl: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (courses.length === 0) {
      return res.status(404).json({ message: "Courses not found" });
    }
    return res
      .status(200)
      .json({ message: "Courses fetched successfully", data: courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching courses" });
  }
};

const createCourse = async (req, res) => {
  try {
    const { name, description, start_time, end_time } = req.body;
    const imageUrl = req.file ? req.file.path : null;
    const adminId = req.user.id;

    if (!name || !description) {
      return res
        .status(400)
        .json({ message: "Name and description are required" });
    }

    const newCourse = await prisma.course.create({
      data: {
        name,
        description,
        imageUrl,
        start_time,
        end_time,
        userId: adminId,
      },
      include: {
        user: true,
      },
    });
    return res
      .status(201)
      .json({ message: "Course created successfully", data: newCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating course" });
  }
};

const getCourseByID = async (req, res) => {
  try {
    const { courseId } = req.params;
    const adminId = req.user.id;
    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            imageUrl: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                imageUrl: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    return res.status(200).json({
      message: "Course fetched successfully",
      data: {
        course,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching course" });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { name, description, start_time, end_time } = req.body;
    const imageUrl = req.file ? req.file.path : null;
    const adminId = req.user.id;

    if (!name || !description) {
      return res
        .status(400)
        .json({ message: "Name and description are required" });
    }

    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) },
      include: {
        user: true,
      },
    });

    if (imageUrl && course.imageUrl) {
      const isDeleted = await removeCloudinary(course.imageUrl);
      if (!isDeleted) {
        return res
          .status(500)
          .json({ message: "Error deleting old image from Cloudinary" });
      }
    }

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.user.id !== adminId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this course" });
    }

    const updatedCourse = await prisma.course.update({
      where: { id: parseInt(courseId) },
      data: {
        name: name || course.name,
        description: description || course.description,
        start_time: start_time || course.start_time,
        end_time: end_time || course.end_time,
        imageUrl: imageUrl || course.imageUrl,
      },
      include: {
        user: true,
      },
    });

    return res.status(200).json({
      message: "Course updated successfully",
      data: {
        course: updatedCourse,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating course" });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const adminId = req.user.id;

    if (!courseId) {
      return res.status(404).json({ message: "Course not found" });
    }

    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) },
      include: {
        user: true,
      },
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.user.id !== adminId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this course" });
    }

    // Hapus relasi presences, materials, schedules, dan members sebelum menghapus course
    await prisma.presence.deleteMany({
      where: { courseId: course.id },
    });

    await prisma.schedule.deleteMany({
      where: { courseId: course.id },
    });

    await prisma.material.deleteMany({
      where: { courseId: course.id },
    });

    await prisma.member.deleteMany({
      where: { courseId: course.id },
    });

    await prisma.course.delete({
      where: { id: parseInt(courseId) },
    });

    return res.status(200).json({
      message: "Course deleted successfully",
      data: course,
      adminId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting course" });
  }
};

// additional functions
const getCourseByAdminId = async (req, res) => {
  try {
    const { userId } = req.params;
    const adminId = req.user.id;

    const courses = await prisma.course.findMany({
      where: { userId: parseInt(userId) },
      include: {
        user: true,
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                imageUrl: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (courses.length === 0) {
      return res
        .status(404)
        .json({ message: "No courses found for this user" });
    }

    return res.status(200).json({
      message: "Courses fetched successfully",
      data: courses.map((course) => ({
        ...course,
        createdBy: course.user.name,
      })),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching course" });
  }
};

const addStudentToCourse = async (req, res) => {
  try {
    const { courseId, studentId } = req.params;
    const adminId = req.user.id;

    // Validate admin
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
    });

    if (!admin || admin.role !== "ADMIN") {
      return res.status(403).json({
        message: "You are not authorized to add a student to a course",
      });
    }

    // Validate course
    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) },
      include: { user: true },
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.user.id !== adminId) {
      return res.status(403).json({
        message: "You are not authorized to add a student to this course",
      });
    }

    // Validate student
    const student = await prisma.user.findUnique({
      where: { id: parseInt(studentId) },
    });

    if (!student || student.role !== "STUDENT") {
      return res.status(404).json({
        message: "Student not found or not a valid student",
      });
    }

    // Check for existing membership
    const existingMember = await prisma.member.findFirst({
      where: {
        userId: parseInt(studentId),
        courseId: parseInt(courseId),
      },
    });

    if (existingMember) {
      return res.status(400).json({
        message: "Student is already enrolled in this course",
      });
    }

    // Create new member
    const newMember = await prisma.member.create({
      data: {
        name: student.name,
        userId: parseInt(studentId),
        courseId: parseInt(courseId),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        Course: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return res.status(201).json({
      message: "Student added to course successfully",
      data: newMember,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error adding student to course",
      error: error.message,
    });
  }
};

const removeStudentFromCourse = async (req, res) => {
  try {
    const { courseId, studentId } = req.params;
    const adminId = req.user.id;

    const admin = await prisma.user.findUnique({
      where: { id: adminId },
    });

    if (!admin || admin.role !== "ADMIN") {
      return res.status(403).json({
        message: "You are not authorized to remove a student from a course",
      });
    }

    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) },
      include: { user: true },
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.user.id !== adminId) {
      return res.status(403).json({
        message: "You are not authorized to remove a student from this course",
      });
    }

    const member = await prisma.member.findFirst({
      where: {
        userId: parseInt(studentId),
        courseId: parseInt(courseId),
      },
    });

    if (!member) {
      return res.status(404).json({
        message: "Student not found in this course",
      });
    }

    await prisma.member.delete({
      where: {
        userId_courseId: {
          userId: parseInt(studentId),
          courseId: parseInt(courseId),
        },
      },
    });

    return res.status(200).json({
      message: "Student removed from course successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error removing student from course",
      error: error.message,
    });
  }
};

module.exports = {
  getCourses,
  getCourseByID,
  createCourse,
  deleteCourse,
  updateCourse,

  getCourseByAdminId,
  addStudentToCourse,
  removeStudentFromCourse,
};
