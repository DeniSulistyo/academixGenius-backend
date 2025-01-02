const prisma = require("../../db/prisma");

const getMaterials = async (req, res) => {
  try {
    const userId = req.user.id; // Mendapatkan ID user yang terautentikasi
    console.log("User ID:", userId); // Debugging untuk melihat apakah ID user benar

    // Ambil materi yang status done-nya true dan terkait dengan userId
    const materials = await prisma.material.findMany({
      where: {
        done: true, // Hanya ambil materi yang sudah selesai
        userId: userId, // Pastikan hanya materi milik user ini
      },
    });

    // Debugging untuk melihat apa yang ditemukan
    console.log("Materials found:", materials);

    return res.status(200).json({
      message: "Materials fetched successfully",
      data: materials,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching materials" });
  }
};

const markAsDone = async (req, res) => {
  try {
    const { materialId } = req.params;
    const userId = req.user.id;
    const material = await prisma.material.findUnique({
      where: {
        id: parseInt(materialId),
      },
    });

    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    const updatedMaterial = await prisma.material.update({
      where: {
        id: parseInt(materialId),
      },
      data: {
        done: true,
      },
    });

    return res.status(200).json({
      message: "Material marked as done successfully",
      data: updatedMaterial,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error marking material as done" });
  }
};

module.exports = {
  getMaterials,
  markAsDone,
};
