require('dotenv').config();
const { GoogleGenAI, Type } = require("@google/genai");
const { parseRepoForGemini } = require("../../helpers/repoParseHelper");

// skill level enum adjusted for UI
const DIFFICULTY_ENUM = {
  Beginner: "FIRSTYEAR",
  Intermediate: "SECONDYEAR",
  Advanced: "THIRDYEAR",
  Professional: "FOURTHYEAR",
};

const AVAILABLE_TAGS = [
  "Full-Stack Web Development",
  "Frontend Web Development",
  "Backend Web Development",
  "Mobile Development Kotlin",
  "Mobile Development Swift",
  "Operating Systems",
  "Machine Learning/NLP",
  "Game Development",
  "AI",
  "DSA",
  "Data Science (or Big Data)",
  "Internet of Things",
  "Cybersecurity",
  "Information Technology",
  "Model Context Protocol",
  "Hardware",
  "Cloud Computing",
  "AR/VR Development",
  "Block Chain/NFT",
  "Compiler Design",
  "DevOps, CI/CD",
];
const apiKey = process.env.GEMINI_API_KEY;
console.log("Gemini API Key:", apiKey ? "Loaded" : "Not Loaded"); // Check if key is loaded
if (!apiKey) {
    console.error("GEMINI_API_KEY is not set in .env or environment variables!");
}
const ai = new GoogleGenAI({ apiKey });

// wrapper that processes single repo -> calling Gemini!
async function analyzeRepoWithGemini(repo, AVAILABLE_TAGS, DIFFICULTY_ENUM) {
  const parsedRepo = await parseRepoForGemini(repo);

  const prompt = `
  You are a computer science professor helping university students find open source GitHub repositories to work on. Please analyze the following repository and respond in a **strict JSON format** with the following fields:
  - summary title (25 characters or less)
  - summary (a 100-150 word project description)
  - tags (an array of 1-5 tags selected from the provided list)
  - difficulty (one of: Beginner, Intermediate, Advanced, Professional)
  
  Repo Info:
  Name: ${parsedRepo.name}
  Owner: ${parsedRepo.owner}
  Languages: ${parsedRepo.languages}
  Stars: ${parsedRepo.stars}
  Description: ${parsedRepo.description}
  Topics: ${parsedRepo.topics.join(", ")}
  README (truncated): ${parsedRepo.readme?.slice(0, 3000) || "No README available"}

  Allowed Tags: ${AVAILABLE_TAGS.join(", ")}
  `

  let aiJSON;
  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summaryTitle: {type: Type.STRING},
            summary: { type: Type.STRING },
            tags: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
                enum: AVAILABLE_TAGS,
              },
            },
            difficulty: {
              type: Type.STRING,
              enum: Object.keys(DIFFICULTY_ENUM),
            },
          },
        },
      },
    });
  
    aiJSON = JSON.parse(result.text);
  } catch (error) {
    console.error("Error parsing Gemini response:", error);
    throw new Error("AI parsing failed");
  }


  let difficultyFromDB = null;
  if (aiJSON.difficulty && typeof aiJSON.difficulty === 'string') {   // this only attempts to trim and replace if aiJSON.difficulty exists and is a string
      difficultyFromDB = DIFFICULTY_ENUM[aiJSON.difficulty.trim().replace(/[^a-zA-Z]/g, "")] || null; 
  } else {
      console.warn(`Gemini response: 'difficulty' field is missing or not a string. Received: ${aiJSON.difficulty}`);
      difficultyFromDB = DIFFICULTY_ENUM.Beginner;  // can decide null here instead if we want
  }

  // return regular repo data + { summary title, summary, tags, difficulty };
  return {
    ...parsedRepo, // includes name, owner, stars, repoLink, license, description, topics, readme, created_at, github_id
    summaryTitle: aiJSON.summaryTitle,
    summary: aiJSON.summary,
    tags: aiJSON.tags,
    skill: difficultyFromDB ? [difficultyFromDB] : [],
    githubId: parsedRepo.githubId,
    repoLink: parsedRepo.repoLink,
  }
}

module.exports = { analyzeRepoWithGemini };
