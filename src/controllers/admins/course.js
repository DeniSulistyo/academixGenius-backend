const prisma = require("../../db/prisma");

const getCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        schedules: true,
        user: true,
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
const createCourse = async (req, res) => {
  try {
    const { name, description, start_time, end_time } = req.body;
    const imageUrl = req.file
      ? req.file.path
      : "https://i0.wp.com/game.courses/wp-content/uploads/2020/08/placeholder.png?quality=80&ssl=1";
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!name || !description || !start_time || !end_time) {
      return res.status(400).json({
        message: "Name, description, start_time, and end_time are required",
      });
    }

    const start = new Date(start_time);
    const end = new Date(end_time);
    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const existingCourse = await prisma.course.findFirst({
      where: { name },
    });

    if (existingCourse) {
      return res.status(400).json({
        message: "Course with this name already exists",
      });
    }

    const course = await prisma.course.create({
      data: {
        name,
        description,
        imageUrl,
        userId,
      },
    });

    const schedule = await prisma.schedule.create({
      data: {
        start_time: start,
        end_time: end,
        Course: {
          connect: {
            id: course.id,
          },
        },
      },
    });
    res.status(201).json({
      message: "Course created successfully",
      data: {
        id: course.id,
        name: course.name,
        description: course.description,
        imageUrl: course.imageUrl,
        userId: course.userId,
        schedule: {
          id: schedule.id,
          start_time: schedule.start_time,
          end_time: schedule.end_time,
        },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating course" });
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

const updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { name, description, start_time, end_time } = req.body;
    const userId = req.user.id;

    if (!name || !description || !start_time || !end_time) {
      return res.status(404).json({
        message: "Name, description, start_time, and end_time are required",
      });
    }

    const start = new Date(start_time);
    const end = new Date(end_time);
    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const existingCourse = await prisma.course.findUnique({
      where: {
        id: parseInt(courseId),
      },
    });

    if (!existingCourse) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    if (existingCourse.userId !== userId && req.user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Forbidden: You are not authorized to update this course",
      });
    }

    const updatedCourse = await prisma.course.update({
      where: {
        id: parseInt(courseId),
      },
      data: {
        name,
        description,
        imageUrl: req.file ? req.file.path : existingCourse.imageUrl,
      },
    });

    const schedule = await prisma.schedule.findFirst({
      where: {
        courseId: parseInt(courseId),
      },
    });

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    const updatedSchedule = await prisma.schedule.update({
      where: {
        id: schedule.id,
      },
      data: {
        start_time: start,
        end_time: end,
      },
    });

    return res.status(200).json({
      message: "Course updated successfully",
      data: {
        id: updatedCourse.id,
        name: updatedCourse.name,
        description: updatedCourse.description,
        imageUrl: updatedCourse.imageUrl,
        userId: updatedCourse.userId,
        schedule: {
          id: updatedSchedule.id,
          start_time: updatedSchedule.start_time,
          end_time: updatedSchedule.end_time,
        },
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating course" });
  }
};
const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    if (!courseId) {
      return res.status(404).json({ message: "Course not found" });
    }
    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) },
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await prisma.schedule.deleteMany({
      where: { courseId: parseInt(courseId) },
    });

    await prisma.course.delete({
      where: { id: parseInt(courseId) },
    });

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting course" });
  }
};

module.exports = {
  getCourses,
  createCourse,
  getCourseById,
  deleteCourse,
  updateCourse,
};
