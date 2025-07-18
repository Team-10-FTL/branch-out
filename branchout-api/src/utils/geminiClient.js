import { GoogleGenAI, Type } from "@google/genai";
import { parseRepoForGemini } from "../../helpers/repoParseHelper.js";
import 'dotenv/config'; // This loads .env variables into process.env

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
const ai = new GoogleGenAI(apiKey);

// wrapper that processes single repo -> calling Gemini!
export async function analyzeRepoWithGemini(repo, AVAILABLE_TAGS, DIFFICULTY_ENUM) {
  const parsedRepo = await parseRepoForGemini(repo);

  const prompt = `
  You are a computer science propfessor helping students find open source GitHub repositories to work on. Please analyze the following repository and respond in a **strict JSON format** with the following fields:
  - summary (a 150-200 word project description)
  - tags (an array of 1-5 tags selected from the provided list)
  - difficulty (one of: Beginner, Intermediate, Advanced, Professional)
  
  Repo Info:
  Name: ${parsedRepo.name}
  Owner: ${parsedRepo.owner}
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


  const difficultyFromDB = DIFFICULTY_ENUM[aiJSON.difficulty.trim().replace(/[^a-zA-Z]/g, "")] || null; // maps whatever difficulty gemini gave the repo to the ENUM we have in the schema (intermediate  ==> INTERMEDIATE)

  // return regular repo data + { summary, tags, difficulty };
  return {
    ...parsedRepo, // includes name, owner, stars, repoLink, license, description, topics, readme, created_at, github_id
    summary: aiJSON.summary,
    tags: aiJSON.tags,
    skill: difficultyFromDB ? [difficultyFromDB] : [],
    githubId: parsedRepo.github_id,
    repoLink: parsedRepo.repoLink,
  }
}