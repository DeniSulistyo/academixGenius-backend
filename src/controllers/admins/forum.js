const prisma = require("../../db/prisma");

const createForum = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    const newForum = await prisma.forum.create({
      data: {
        title,
        description,
        userId: userId,
        members: {
          connect: { id: userId },
        },
      },
    });

    return res
      .status(201)
      .json({ message: "Forum created successfully", data: newForum });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error creating forum" });
  }
};


module.exports = {
  createForum,
};
