const prisma = require("../../db/prisma");

const getAttendances = async (req, res) => {
  try {
    // Ambil semua presensi dari database
    const attendances = await prisma.presence.findMany({
      include: {
        user: true,
        Course: true, // Menyertakan data course jika diperlukan
        Progres: true, // Menyertakan data progres jika diperlukan
      },
    });

    // Jika tidak ada presensi
    if (attendances.length === 0) {
      return res.status(404).json({
        message: "No attendances found",
      });
    }

    // Kirimkan response dengan data presensi
    return res.status(200).json({
      message: "Attendances fetched successfully",
      data: attendances,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error fetching attendances",
    });
  }
};

const createAttendance = async (req, res) => {
  try {
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error creating attendance",
      error: error.message,
    });
  }
};

module.exports = { getAttendances };
