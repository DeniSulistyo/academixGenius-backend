const prisma = require("../../db/prisma");
const bcrypt = require("bcrypt");

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
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
        token: token,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
