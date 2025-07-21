require('dotenv').config();
const { fetchReposWithFilters } = require("../helpers/githubHelper");
const { parseRepoForGemini } = require("../helpers/repoParseHelper");
const { analyzeRepoWithGemini } = require("../src/utils/geminiClient");
const axios = require('axios');
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

// instead of having separate logic on the same edited file, use helpr functions in the helpers/ folder
// here we can modularize the logic and PRs

// skill level enum adjusted for UI
const DIFFICULTY_ENUM = {
    Beginner: "FIRSTYEAR",
    Intermediate: "SECONDYEAR",     // can either export this explicitly from the repoParseHelper or do this
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

const repoFetcher = async () => {
    // get last pulled information
    const lastPulled = '2025-07-10'; // but pls replace this w an actual date
    const currentDate = new Date().toISOString().slice(0, 10);

    // fetch repos from github (call the github helper)
    const repos = await fetchReposWithFilters({ startDate: lastPulled, endDate: currentDate })

    const limitedRepos = repos.slice(0, 3); // limit to 1 repo for testing

    for (const repo of limitedRepos){
        // get Gemini enriched data 
        const geminiOutput = await analyzeRepoWithGemini(repo, AVAILABLE_TAGS, DIFFICULTY_ENUM)
        const exists = await prisma.repo.findUnique({
            where: {githubId: geminiOutput.githubId }
        })

        if (!exists){
            await prisma.repo.create({
                data: {
                    owner: geminiOutput.owner,
                    name: geminiOutput.name,
                    stars: geminiOutput.stars,
                    languages: geminiOutput.languages || [],
                    tags: geminiOutput.tags || [],
                    topics: geminiOutput.topics || [],
                    skill: geminiOutput.skill || [],
                    summary: geminiOutput.summary || "",
                    description: geminiOutput.description || "",
                    githubId: geminiOutput.githubId,
                    repoLink: geminiOutput.repoLink,
                }
            });
            console.log(`Inserted repo: ${geminiOutput.name}`)
        } else {
            console.log(`Repo already exists: ${geminiOutput.name}`)
        }
    }

}

repoFetcher();

