const prisma = require('../models/prismaClient');
const axios = require('axios');
const fs = require('fs');

async function main(userId) {
  // Fetch user
  const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
  if (!user) {
    console.log(JSON.stringify(null));
    return;
  }

  // Fetch feedback
  const feedback = await prisma.feedBack.findMany({
    where: { userId: Number(userId) },
    select: { repoId: true, swipeDirection: true }
  });

  const dislikedIds = new Set(
    feedback.filter(fb => fb.swipeDirection === 'left').map(fb => String(fb.repoId))
  );
  const likedIds = feedback.filter(fb => fb.swipeDirection === 'right').map(fb => String(fb.repoId));

  // Load repo embeddings
  const repoData = JSON.parse(fs.readFileSync('repo_embeddings.json', 'utf8'));

  // Optionally boost liked repo info in user profile
  let likedText = '';
  likedIds.forEach(id => {
    if (repoData[id]) {
      likedText += ' ' + (repoData[id].text || '');
    }
  });

  // Prepare user profile string
  const profile = [
    user.username,
    ...(user.languages || []),
    ...(user.skill || []),
    ...(user.preferenceTags || []),
    likedText // boost liked repo info
  ].join(' ');

  // Filter repos (exclude disliked)
  const filteredRepos = Object.entries(repoData)
    .filter(([rid]) => !dislikedIds.has(rid))
    .map(([rid, data]) => ({
      id: rid,
      text: data.text // or build text from repo fields if needed
    }));

  // Call FastAPI recommender
  const response = await axios.post('http://localhost:8000/recommend', {
    user_profile: profile,
    repos: filteredRepos
  });

  // Output recommended repo IDs
  console.log(JSON.stringify(response.data.recommendations));
}

main(process.argv[2]).finally(() => prisma.$disconnect());