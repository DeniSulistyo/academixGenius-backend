const prisma = require("../../db/prisma");
const upload = require("../../utils/multer");
const cloudinary = require("../../utils/cloudinary");
const removeCloudinary = require("../../utils/removeCloudinary");

const createMaterial = async (req, res) => {
  try {
    const { name, description, courseId, date, start_time, end_time } =
      req.body;
    const fileUrl = req.file ? req.file.path : null;

    // Pastikan user sudah terautentikasi
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Validasi input
    if (
      !name ||
      !description ||
      !courseId ||
      !date ||
      !start_time ||
      !end_time
    ) {
      return res.status(400).json({
        message:
          "Name, description, courseId, date, start_time, and end_time are required",
      });
    }

    // Membuat material baru di database
    const material = await prisma.material.create({
      data: {
        name,
        description,
        userId,
        courseId: parseInt(courseId),
        fileUrl,
        date: new Date(date),
        start_time,
        end_time,
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
        fileUrl: material.fileUrl,
        date: material.date,
        start_time: material.start_time,
        end_time: material.end_time,
        assignments: material.assignments,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating material" });
  }
};

const updateMaterial = async (req, res) => {
  try {
    const { materialId } = req.params;
    const { name, description, courseId, date, start_time, end_time } =
      req.body;
    const fileUrl = req.file ? req.file.path : null;

    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (
      !name ||
      !description ||
      !courseId ||
      !date ||
      !start_time ||
      !end_time
    ) {
      return res.status(400).json({
        message:
          "Name, description, courseId, date, start_time, and end_time are required",
      });
    }

    const oldMaterial = await prisma.material.findUnique({
      where: {
        id: parseInt(materialId),
      },
    });

    if (oldMaterial.fileUrl) {
      const isDeleted = await removeCloudinary(oldMaterial.fileUrl);
      if (!isDeleted) {
        return res
          .status(500)
          .json({ message: "Error deleting old image from Cloudinary" });
      }
    }

    const updatedMaterial = await prisma.material.update({
      where: {
        id: parseInt(materialId),
      },
      data: {
        name,
        description,
        userId,
        courseId: parseInt(courseId),
        fileUrl,
        date: new Date(date),
        start_time,
        end_time,
      },
    });

    res.status(200).json({
      message: "Material updated successfully",
      data: {
        id: updatedMaterial.id,
        name: updatedMaterial.name,
        description: updatedMaterial.description,
        userId: updatedMaterial.userId,
        courseId: updatedMaterial.courseId,
        fileUrl: updatedMaterial.fileUrl,
        date: updatedMaterial.date,
        start_time: updatedMaterial.start_time,
        end_time: updatedMaterial.end_time,
        assignments: updatedMaterial.assignments,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating material" });
  }
};

const getMaterialById = async (req, res) => {
  try {
    const { materialId } = req.params;
    const material = await prisma.material.findUnique({
      where: {
        id: parseInt(materialId),
      },
      include: {
        assignments: true,
      },
    });

    return res
      .status(200)
      .json({ message: "Material fetched successfully", data: material });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching material" });
  }
};

const deleteMaterial = async (req, res) => {
  try {
    const { materialId } = req.params;
    const material = await prisma.material.findUnique({
      where: {
        id: parseInt(materialId),
      },
    });

    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    if (material.fileUrl) {
      const isDeleted = await removeCloudinary(material.fileUrl);
      if (!isDeleted) {
        return res
          .status(500)
          .json({ message: "Error deleting file from Cloudinary" });
      }
    }
    await prisma.material.delete({
      where: {
        id: parseInt(materialId),
      },
    });

    return res
      .status(200)
      .json({ message: "Material deleted successfully", data: material });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error deleting material" });
  }
};

module.exports = {
  createMaterial,
  updateMaterial,
  getMaterialById,
  deleteMaterial,
};
