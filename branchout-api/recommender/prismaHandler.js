const prisma = require('../models/prismaClient');
const axios = require('axios');

exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.user?.userId || req.auth?.userId || req.params.userId;
    if (!userId) {
      return res.status(400).json({ recommendations: [], message: "User ID missing" });
    }

    // Fetch user and their preferences
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

    // Fetch all repos and filter out disliked ones
    const repos = await prisma.repo.findMany({
      where: {
        id: {
          notIn: Array.from(dislikedIds).map(id => Number(id))
        }
      },
      select: {
        id: true,
        name: true,
        description: true,
        language: true,
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
        repo.language || '',
        ...(repo.tags || [])
      ].join(' ')
    }));

    // Send to FastAPI for on-the-fly embedding and scoring
    const fastapiRes = await axios.post('http://localhost:8000/recommend', {
      user_profile: userProfile,
      repos: repoPayload
    });

    const recommendedRepoIds = fastapiRes.data.recommendations || [];

    res.json({ recommendations: recommendedRepoIds });

  } catch (error) {
    console.error("Recommendation error:", error.message);
    res.status(500).json({ recommendations: [], error: error.message });
  }
};
