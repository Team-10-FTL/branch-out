const prisma = require("../models/prismaClient");

exports.getAllUsers = async (req, res) => {
  try {
    // This endpoint is already protected by the middleware
    // so we know the user is an admin
    const users = await prisma.User.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        provider: true,
        createdAt: true,
        updatedAt: true,
        // Don't include password for security reasons
      },
    });

    res.status(200).json(users);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Error fetching users");
  }
};

// Function to get current user's profile
exports.getUserProfile = async (req, res) => {
  try {
    // Get user ID from the JWT token that was decoded in middleware
    const userId = req.user.userId;

    const user = await prisma.User.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        provider: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Error fetching user profile");
  }
};

exports.getUser = async (req, res) => {
  try {
    const id = Number(req.params.id); // i think i need another function to get a user that uses clerk?
    const newUser = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        provider: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        feedback: true,
        savedRepos: true,
        languages: true,
        skill: true,
        preferenceTags: true,
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({ error: "Error fetching user" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const updatedUser = await prisma.user.update({
      where: { id },
      data: req.body,
    });
    res.json(updatedUser);
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ error: "Error updating user information" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.user.delete({
      where: { id },
    });
    res.status(204).end();
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "Error deleting user" });
  }
};
