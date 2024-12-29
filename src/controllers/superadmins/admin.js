const prisma = require("../../db/prisma");
const bcrypt = require("bcrypt");

const getAdmins = async (req, res) => {
  try {
    const admins = await prisma.user.findMany({
      where: {
        role: "ADMIN",
      },

      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        bio: true,
      },
    });

    if (admins.length === 0) {
      return res.status(404).json({ message: "Admins not found" });
    }
    res.status(200).json({
      message: "Admins fetched successfully",
      data: admins,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching admins" });
  }
};
const createAdmin = async (req, res) => {
  try {
    const { name, email, password, bio } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    const existingAdmin = await prisma.user.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      return res.status(400).json({
        message: "Admin with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: "ADMIN",
        bio: bio,
      },
    });

    return res.status(201).json({
      message: "Admin created successfully",
      data: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        bio: admin.bio,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error creating admin",
      error: error.message,
    });
  }
};

const getAdminById = async (req, res) => {
  try {
    const { adminId } = req.params;
    const admin = await prisma.user.findUnique({
      where: { id: parseInt(adminId) },
    });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    return res
      .status(200)
      .json({ message: "Admin fetched successfully", data: admin });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching admin" });
  }
};

const updateAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;
    const { name, email, password, bio } = req.body;
    const admin = await prisma.user.findUnique({
      where: { id: parseInt(adminId) },
    });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    await prisma.user.update({
      where: { id: parseInt(adminId) },
      data: {
        name,
        email,
        password,
        bio,
      },
    });
    return res.status(200).json({ message: "Admin updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating admin" });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;
    if (!adminId) {
      return res.status(404).json({ message: "Admin not found" });
    }
    const admin = await prisma.user.findUnique({
      where: { id: parseInt(adminId) },
    });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    await prisma.user.delete({
      where: { id: parseInt(adminId) },
    });
    return res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error deleting admin" });
  }
};

module.exports = {
  createAdmin,
  deleteAdmin,
  getAdmins,
  getAdminById,
  updateAdmin,
};
