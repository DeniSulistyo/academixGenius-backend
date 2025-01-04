const prisma = require("../../db/prisma");

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

module.exports = {
  getMaterials,
  createMaterial,
};
