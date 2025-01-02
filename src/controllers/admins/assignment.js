const prisma = require("../../db/prisma");

const createAssignment = async (req, res) => {
  try {
    const { materialId, title, description, start_date, end_date } = req.body;
    const fileUrl = req.file ? req.file.path : null;

    // Validasi input
    if (!materialId || !title || !description || !start_date || !end_date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Variabel untuk URL file assignment

    // Menambahkan assignment ke material
    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        fileUrl,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        materialId: parseInt(materialId),
      },
    });

    res.status(201).json({
      message: "Assignment added successfully",
      data: assignment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { createAssignment };
