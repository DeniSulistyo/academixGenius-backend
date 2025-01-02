const prisma = require("../../db/prisma");

const getCourses = async (req, res) => {
  try {
    const userId = req.user.id; // Pastikan Anda mendapatkan `userId` dari token atau session

    // Ambil semua kursus beserta materi dan progres untuk user tertentu
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

    // Hitung progres untuk setiap kursus
    const coursesWithProgress = courses.map((course) => {
      const totalMaterials = course._count.materials || 0; // Total materi dalam kursus
      const doneMaterials = course.progreses.length || 0; // Jumlah materi yang telah selesai oleh student

      // Debugging logs untuk memeriksa data
      console.log(
        `Course: ${course.name}, Total materials: ${totalMaterials}, Done materials: ${doneMaterials}`
      );

      const progress =
        totalMaterials > 0 ? (doneMaterials / totalMaterials) * 100 : 0;

      return {
        ...course,
        progress: Math.round(progress), // Persentase progres dibulatkan
      };
    });

    // Respon sukses dengan data kursus dan progres
    res.status(200).json({
      message: "Courses fetched successfully",
      data: coursesWithProgress,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({
      message: "Error fetching courses",
      error: error.message,
    });
  }
};

module.exports = {
  getCourses,
};
