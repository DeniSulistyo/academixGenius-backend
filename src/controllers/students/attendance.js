const prisma = require("../../db/prisma");

const createAttendance = async (req, res) => {
  try {
    const { courseId, status } = req.body;
    const userId = req.user.id;

    if (!courseId || !status) {
      return res.status(400).json({
        message: "Material ID and status are required",
      });
    }

    const validedStatus = ["PRESENT", "PERMISSION", "LATE", "ABSENT"];

    if (!validedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingAttendance = await prisma.presence.findFirst({
      where: {
        courseId,
        userId,
        date: today,
      },
    });

    if (existingAttendance) {
      return res.status(400).json({
        message:
          "You have already submitted attendance for this material today",
      });
    }

    const newAttendance = await prisma.presence.create({
      data: {
        courseId: parseInt(courseId),
        userId,
        status,
        date: today,
      },
    });

    return res.status(201).json({
      message: "Attendance created successfully",
      data: newAttendance,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error creating attendance",
      error: error.message,
    });
  }
};

module.exports = { createAttendance };
