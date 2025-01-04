const prisma = require("../../db/prisma");
const bcrypt = require("bcrypt");
const { generateToken } = require("../../utils/jwtUtils");

const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const imageUrl = req.file ? req.file.path : null;
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: "ADMIN",
        imageUrl,
      },
    });
    res
      .status(201)
      .json({ message: "Admin created successfully", data: admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating admin" });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await prisma.user.findUnique({
      where: { email },
    });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = generateToken({ id: admin.id, role: admin.role });
    res.status(200).json({
      message: "Admin logged in",
      data: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        token,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in admin" });
  }
};

module.exports = {
  createAdmin,
  adminLogin,
};
