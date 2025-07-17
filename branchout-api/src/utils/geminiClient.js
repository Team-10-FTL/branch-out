import { GoogleGenAI } from "@google/genai";
import { parseRepoForGemini } from "../../helpers/repoParseHelper";

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

// must input VITE_GEMINI_API_KEY into local .env file
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey });
const model = ai.getGenerativeModel({
  model: "gemini-1.5-pro",
  systemInstruction:
    "You are a computer science professor, helping students interested in exploring open source GitHub projects.",
});

// wrapper that processes single repo -> calling Gemini!
export async function analyzeRepoWithGemini(
  repo,
  AVAILABLE_TAGS,
  DIFFICULTY_ENUM
) {
  const parsedRepo = await parseRepoForGemini(repo);
  const tags = await repoTags(parsedRepo, AVAILABLE_TAGS);
  const difficulty = await repoDifficulty(parsedRepo, DIFFICULTY_ENUM);
  const summary = await repoSummary(parsedRepo, tags, difficulty);

  return { summary, tags, difficulty };
}

export async function repoTags(repo, AVAILABLE_TAGS) {
  try {
    const { name, owner, stars, description, topics, readme } = repo;
    const prompt = `Based on the repo information, assign between 1-5 of the provided tags:
    
    Name: ${name}
    Owner: ${owner}
    Stars: ${stars}
    Description: ${description}
    Topics: ${Array.isArray(topics) ? topics.join(", ") : "None"}
    README: ${readme?.slice(0, 3000) || "No README available"}

    Provided Tags: ${AVAILABLE_TAGS}
    `;
    const result = await model.generateContent({
      contents: [{ parts: [{ text: prompt }] }],
    });
    const tagString = await result.response.text();
    console.log(tagString);
    const parseTagString = (tagString) => {
      // split for commas, remove spaces
      return tagString.split(",").map((tag) => tag.trim());
    };

    const tags = parseTagString(tagString);
    return tags;
  } catch (error) {
    console.log("Error with creating repo tags: ", error);
  }
}

export async function repoDifficulty(repo, DIFFICULTY_ENUM) {
  try {
    const { name, owner, stars, description, topics, readme } = repo;
    const prompt = `Categorize the repo into one of the 4 available difficulty levels based on the provided information:
    
    
    Name: ${name}
    Owner: ${owner}
    Stars: ${stars}
    Description: ${description}
    Topics: ${Array.isArray(topics) ? topics.join(", ") : "None"}
    README: ${readme?.slice(0, 3000) || "No README available"}

    The difficulty levels are as follows: ${skillLevels}
    `;
    const result = await model.generateContent({
      contents: [{ parts: [{ text: prompt }] }],
    });

    const enumDif = await result.response.text();
    console.log("Raw difficulty:", enumDif);

    const difficulty =
      DIFFICULTY_ENUM[enumDif.trim().replace(/[^a-zA-Z]/g, "")] || null;

    return difficulty;
  } catch (error) {
    console.log("Error with creating repo difficulty/skill level: ", error);
  }
}

//
export async function repoSummary(repo, tags, difficulty) {
  try {
    const { name, owner, stars, description, topics, readme } = repo;
    const prompt = `Please generate a clean, concise 150-200 word summary based on the following repo information.
    
    Name: ${name}
    Owner: ${owner}
    Stars: ${stars}
    Description: ${description}
    Topics: ${Array.isArray(topics) ? topics.join(", ") : "None"}
    README: ${readme?.slice(0, 3000) || "No README available"}


    The user-defined tags for this project are:
    ${tags.join(", ")}

    The estimated difficulty level of the repository is:
    ${difficulty}
    `;
    const result = await model.generateContent({
      contents: [{ parts: [{ text: prompt }] }],
    });
    const summary = await result.response.text();
    console.log(summary);
    return summary;
  } catch (error) {
    console.log("Error with creating repo summary: ", error);
  }
}

// const result = await analyzeRepoWithGemini(repo, AVAILABLE_TAGS, DIFFICULTY_ENUM);
