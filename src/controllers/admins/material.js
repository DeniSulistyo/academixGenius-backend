const prisma = require("../../db/prisma");

const getMaterials = async (req, res) => {
  try {
    const materials = await prisma.material.findMany();
    res.status(200).json({
      message: "Materials fetched successfully",
      data: materials,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching materials" });
  }
};

const createMaterial = async (req, res) => {
  try {
    const { name, description } = req.body;

    const userId = req.user.id;
    console.log("User ID:", userId);

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!name || !description) {
      return res
        .status(400)
        .json({ message: "Name and description are required" });
    }

    const existingMaterial = await prisma.material.findFirst({
      where: { name },
    });

    if (existingMaterial) {
      return res.status(400).json({
        message: "Material with this name already exists",
      });
    }

    // Membuat material baru
    const material = await prisma.material.create({
      data: {
        name,
        description,
        userId,
      },
    });

    res.status(201).json({
      message: "Material created successfully",
      data: {
        id: material.id,
        name: material.name,
        description: material.description,
        userId: material.userId,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating material" });
  }
};

module.exports = { createMaterial, getMaterials };
