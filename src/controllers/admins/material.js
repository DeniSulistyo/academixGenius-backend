const prisma = require("../../db/prisma");
const upload = require("../../utils/multer");

const createMaterial = async (req, res) => {
  try {
    const { name, description, courseId, start_date, end_date } = req.body;

    // Pastikan user sudah terautentikasi
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Validasi input
    if (!name || !description || !courseId) {
      return res.status(400).json({
        message: "Name, description, and courseId are required",
      });
    }

    // Variabel untuk URL file
    let fileUrl = null;
    let assignmentFileUrl = null;
    const assignments = [];

    // Memastikan file materi ada (misalnya file PDF materi)
    if (req.files && req.files.materialFile) {
      fileUrl = req.files.materialFile[0].path; // URL file materi
    }

    // Jika ada file untuk assignment
    if (req.files && req.files.assignmentFile) {
      assignmentFileUrl = req.files.assignmentFile[0].path; // URL file assignment

      if (!start_date || !end_date) {
        return res.status(400).json({
          message:
            "Start date and end date are required when uploading an assignment",
        });
      }

      // Tambahkan tugas ke array assignments
      assignments.push({
        name: "Assignment for " + name,
        fileUrl: assignmentFileUrl,
        start_date: new Date(start_date), // Pastikan start_date dalam format Date
        end_date: new Date(end_date), // Pastikan end_date dalam format Date
      });
    }

    // Membuat material baru di database
    const material = await prisma.material.create({
      data: {
        name,
        description,
        userId,
        courseId: parseInt(courseId),
        fileUrl, // Menyimpan file materi
        assignments:
          assignments.length > 0 ? { create: assignments } : undefined, // Hanya buat assignment jika ada
      },
      include: {
        assignments: true, // Sertakan assignments dalam respons
      },
    });

    res.status(201).json({
      message: "Material created successfully",
      data: {
        id: material.id,
        name: material.name,
        description: material.description,
        userId: material.userId,
        courseId: material.courseId,
        fileUrl: material.fileUrl, // Sertakan fileUrl dalam response
        assignments: material.assignments, // Sertakan assignments dalam response
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating material" });
  }
};

module.exports = { createMaterial };
