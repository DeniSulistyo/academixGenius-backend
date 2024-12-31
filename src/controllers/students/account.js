const prisma = require("../../db/prisma");
const bcrypt = require("bcrypt");
const { generateToken } = require("../../utils/jwtUtils");

const login = async (req, res) => {
  try {
    console.log("Body di controller:", req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    const token = generateToken({
      id: user.id,
      role: user.role,
    });

    res.status(200).json({
      message: "Login successful",
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        bio: user.bio,
        imageUrl: user.imageUrl,
        token,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error logging in",
      error: error.message,
    });
  }
};

module.exports = { login };
