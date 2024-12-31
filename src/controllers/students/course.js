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
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching courses" });
  }
};

module.exports = {
  getCourses,
};
