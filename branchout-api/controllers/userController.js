const prisma = require("../models/prismaClient");
const axios = require("axios");

const FASTAPI_URL = process.env.FASTAPI_URL || "http://localhost:8000";

exports.getRecommendations = async (req, res) => {
  try {
    let userId = req.user?.userId || req.auth?.userId || req.params.userId || req.query.userId;
    if (!userId) {
      return res.status(400).json({ recommendations: [], message: "User ID missing" });
    }

    // Fetch user and their preferences
    if (userId.startsWith("user_")) {
      const userObj = await prisma.user.findUnique({
        where: { clerkId: userId },
        select: { id: true }
      });
      if (!userObj) {
        console.log("User not found for ID:", userObj);
        return res.status(404).json({ recommendations: [], message: "User not found" });
      }
      userId = userObj.id; // Use the actual numeric ID for further queries
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: {
        username: true,
        languages: true,
        skill: true,
        preferenceTags: true
      }
    });

    if (!user) {
      return res.status(404).json({ recommendations: [], message: "User not found" });
    }

    // Fetch disliked repo IDs
    const dislikes = await prisma.feedBack.findMany({
      where: { userId: Number(userId), swipeDirection: 'left' },
      select: { repoId: true }
    });
    const dislikedIds = new Set(dislikes.map(d => String(d.repoId)));

    // Fetch saved repo IDs to exclude them too
    const savedRepos = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: { savedRepos: { select: { id: true } } }
    });
    const savedRepoIds = new Set(savedRepos?.savedRepos?.map(repo => String(repo.id)) || []);

    // Combine excluded IDs
    const excludedIds = new Set([...dislikedIds, ...savedRepoIds]);

    // Fetch all repos and filter out excluded ones
    const repos = await prisma.repo.findMany({
      where: {
        id: {
          notIn: Array.from(excludedIds).map(id => Number(id))
        }
      },
      select: {
        id: true,
        name: true,
        description: true,
        languages: true,
        tags: true
      }
    });

    if (!repos.length) {
      return res.json({ recommendations: [] });
    }

    // Construct user profile string
    const userProfile = [
      user.username,
      ...(user.languages || []),
      ...(user.skill || []),
      ...(user.preferenceTags || [])
    ].join(' ');

    // Build list of repos with descriptive fields for embedding
    const repoPayload = repos.map(repo => ({
      id: repo.id,
      text: [
        repo.name,
        repo.description || '',
        ...(repo.languages || []),
        ...(repo.tags || [])
      ].join(' ')
    }));

    // Send to FastAPI for on-the-fly embedding and scoring
    const fastapiRes = await axios.post(`${process.env.FASTAPI_URL}/recommend`, {
      user_profile: userProfile,
      repos: repoPayload
    });

    const recommendedRepoIds = fastapiRes.data.recommendations || [];
    const confidenceScores = fastapiRes.data.confidence || [];

    // Get the top 10 recommendations
    const top10RepoIds = recommendedRepoIds.slice(0, 10);
    const top10Confidence = confidenceScores.slice(0, 10);

    // From those 10, select the top 3 for the discovery page
    const displayRepoIds = top10RepoIds.slice(0, 3);
    const displayConfidence = top10Confidence.slice(0, 3);

    // Fetch the full repo data for display
    const displayRepos = displayRepoIds.length
      ? await prisma.repo.findMany({
          where: { id: { in: displayRepoIds.map(id => Number(id)) } }
        })
      : [];

    // Order them according to the recommendation ranking
    const orderedRepos = displayRepoIds.map(id =>
      displayRepos.find(repo => repo.id === Number(id))
    ).filter(Boolean);

    res.json({ 
      recommendations: orderedRepos,
      confidence: displayConfidence 
    });
  } catch (error) {
    console.error("Recommendation error:", error.message);
    res.status(500).json({ recommendations: [], error: error.message });
  }
};

// Keep all other existing exports unchanged
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
        languages: true,
        skill: true,
        preferenceTags: true,
        savedRepos: true,
        hasCompletedOnboarding: true,
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
  const userId = req.user?.userId || req.auth?.userId;

  try {
    const newUser = await prisma.user.findUnique({
      where: { id: userId },
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

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user?.userId || req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const updatedUser = await prisma.User.update({
      where: { id: userId },
      data: {
        username: req.body.username,
        email: req.body.email,
        languages: req.body.languages,
        skill: req.body.skill,
        preferenceTags: req.body.preferenceTags,
        hasCompletedOnboarding: req.body.hasCompletedOnboarding || false,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error("Failed to update profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

exports.getPreferences = async (req, res) => {
  console.log("🧪 getPreferences accessed by role:", req.user?.role);
  const userId = req.user?.userId || req.auth?.userId;
  try {
    console.log("userId in getPreferences:", userId);
    const userPreferences = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        skill: true,
        languages: true,
        preferenceTags: true,
      },
    });
    res.json(userPreferences);
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ error: "Error finding user preferences" });
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