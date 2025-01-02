const prisma = require("../../db/prisma");
const bcrypt = require("bcrypt");
const { generateToken } = require("../../utils/jwtUtils");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check if the user has the role 'STUDENT'
    if (user.role !== "STUDENT") {
      return res.status(403).json({
        message: "Only students can log in",
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
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        imageUrl: user.imageUrl,
        token: token,
        teach: user.teach,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = { login };
