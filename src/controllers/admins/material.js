const prisma = require("../../db/prisma");
const removeCloudinary = require("../../utils/removeCloudinary");

const getMaterials = async (req, res) => {
  try {
    const { courseId } = req.params;
    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    const materials = await prisma.material.findMany({
      where: {
        courseId: parseInt(courseId),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            imageUrl: true,
          },
        },
        assignments: true,
        grades: true,
      },
    });

    if (materials.length === 0) {
      return res.status(404).json({ message: "Materials not found" });
    }

    return res
      .status(200)
      .json({ message: "Material fetched successfully", data: materials });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error getting materials" });
  }
};

const createMaterial = async (req, res) => {
  try {
    const { name, description } = req.body;
    const fileUrl = req.file ? req.file.path : null;
    const adminId = req.user.id;
    const { courseId } = req.params;

    if (!name || !description) {
      return res
        .status(400)
        .json({ message: "Name and description are required" });
    }

    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) },
      select: { id: true, name: true, description: true },
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const existingMaterial = await prisma.material.findFirst({
      where: {
        name: name,
        courseId: parseInt(courseId),
      },
    });

    if (existingMaterial) {
      return res.status(400).json({
        message: "Material with the same name already exists in this course",
      });
    }

    const newMaterial = await prisma.material.create({
      data: {
        name,
        description,
        fileUrl,
        courseId: parseInt(courseId),
        userId: adminId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            imageUrl: true,
          },
        },
        assignments: true,
        grades: true,
      },
    });

    return res.status(201).json({
      message: "Material created successfully",
      data: newMaterial,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error creating material",
      error: error.message,
    });
  }
};

const getMaterialById = async (req, res) => {
  try {
    const { materialId } = req.params;
    const { courseId } = req.params;

    if (!materialId || !courseId) {
      return res
        .status(400)
        .json({ message: "Material ID and Course ID are required" });
    }
    const material = await prisma.material.findFirst({
      where: { id: parseInt(materialId), courseId: parseInt(courseId) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            imageUrl: true,
          },
        },
        Course: true,
        assignments: true,
        grades: true,
      },
    });
    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }
    return res
      .status(200)
      .json({ message: "Material fetched successfully", data: material });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error getting material" });
  }
};

const updateMaterial = async (req, res) => {
  try {
    const { materialId } = req.params;
    const { courseId } = req.params;
    const { name, description } = req.body;
    const fileUrl = req.file ? req.file.path : null;

    if (!name || !description) {
      return res
        .status(400)
        .json({ message: "Name and description are required" });
    }

    const material = await prisma.material.findFirst({
      where: { id: parseInt(materialId), courseId: parseInt(courseId) },
    });
    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    if (fileUrl && material.fileUrl) {
      const isDeleted = await removeCloudinary(material.fileUrl);
      if (!isDeleted) {
        return res
          .status(500)
          .json({ message: "Error deleting old image from Cloudinary" });
      }
    }
    const updatedMaterial = await prisma.material.update({
      where: { id: parseInt(materialId) },
      data: {
        name,
        description,
        fileUrl,
      },
    });
    return res.status(200).json({
      message: "Material updated successfully",
      data: updatedMaterial,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating material" });
  }
};

const deleteMaterial = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { materialId } = req.params;

    if (!courseId || !materialId) {
      return res
        .status(400)
        .json({ message: "Material ID and Course ID are required" });
    }
    const material = await prisma.material.findFirst({
      where: { id: parseInt(materialId), courseId: parseInt(courseId) },
    });
    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    if (material.fileUrl) {
      const isDeleted = await removeCloudinary(material.fileUrl);
      if (!isDeleted) {
        return res
          .status(500)
          .json({ message: "Error deleting image from Cloudinary" });
      }
    }
    const deletedMaterial = await prisma.material.delete({
      where: { id: parseInt(materialId) },
    });
    return res.status(200).json({
      message: "Material deleted successfully",
      data: deletedMaterial,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error deleting material", error: error.message });
  }
};

const createAssignment = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    const { courseId, materialId } = req.params;
    const fileUrl = req.file ? req.file.path : null;

    if (!courseId || !materialId) {
      return res
        .status(400)
        .json({ message: "Course ID and Material ID are required" });
    }

    // Membuat assignment dan menghubungkannya dengan materi dan kursus
    const assignment = await prisma.assignment.create({
      data: {
        title: title || "No Title",
        description: description || "No Description",
        dueDate: dueDate || new Date().toISOString(),
        fileUrl,
        material: {
          connect: { id: parseInt(materialId) },
        },
        adminId: req.user.id,
        course: {
          connect: { id: parseInt(courseId) },
        },
        creator: {
          connect: { id: req.user.id },
        },
      },
    });

    // Mengirimkan response dengan data assignment yang baru dibuat
    return res.status(201).json(assignment);
  } catch (error) {
    console.error("Error creating assignment: ", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getMaterials,
  createMaterial,
  getMaterialById,
  updateMaterial,
  deleteMaterial,
  createAssignment,
};
