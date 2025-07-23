const WebSocket = require('ws');
const prisma = require('../models/prismaClient');
const { spawn } = require('child_process');

// Start a WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 8080 }, () => {
  console.log('WebSocket server running on ws://localhost:8080');
});

// Call the Python recommendation script and get recommended repo IDs
async function getRecommendedRepoIds(userId) {
  return new Promise((resolve, reject) => {
    const py = spawn('python3', [
      './recommender/lightfm_predict.py',
      userId
    ], { cwd: __dirname + '/../' });

    let data = '';
    let error = '';

    py.stdout.on('data', (chunk) => {
      data += chunk.toString();
    });

    py.stderr.on('data', (chunk) => {
      error += chunk.toString();
    });

    py.on('close', (code) => {
      if (code !== 0 || error) {
        reject(error || `Python process exited with code ${code}`);
      } else {
        try {
          // Expecting a JSON array of repo IDs
          const ids = JSON.parse(data);
          resolve(ids);
        } catch (e) {
          reject('Failed to parse Python output: ' + e.message);
        }
      }
    });
  });
}

// Fetch repo details from the database
async function getRepoById(repoId) {
  if (!repoId) return null;
  const repo = await prisma.repo.findUnique({
    where: { id: Number(repoId) },
    select: {
      id: true,
      name: true,
      owner: true,
      stars: true,
      languages: true,
      tags: true,
      topics: true,
      summary: true,
      description: true,
      repoLink: true
    }
  });
  return repo;
}

wss.on('connection', (ws) => {
  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      if (data.userId) {
        // 1. Get a single recommended repo ID from Python
        const recommendedId = await getRecommendedRepoIds(data.userId);

        // 2. Fetch repo details from DB
        const repo = await getRepoById(recommendedId);

        // 3. Send to client as an array for consistency
        ws.send(JSON.stringify({ recommendations: repo ? [repo] : [] }));
      }
    } catch (err) {
      ws.send(JSON.stringify({ error: 'Recommendation error: ' + err }));
    }
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});