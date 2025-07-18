import 'dotenv/config';
import {fetchReposWithFilters } from "../helpers/githubHelper.js";
import { parseRepoForGemini } from "../helpers/repoParseHelper.js";
import { analyzeRepoWithGemini } from "../src/utils/geminiClient.js";
import axios from 'axios';

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

    const limitedRepos = repos.slice(0, 1); // limit to 1 repo for testing


    for (const repo of repos){

        // get Gemini enriched data so
        // do a call to the geminin helper function here with parsed Repo as the passed-in arguments
        const geminiOutput = await analyzeRepoWithGemini(repo, AVAILABLE_TAGS, DIFFICULTY_ENUM)

        // will add pushing logic to db here later
        console.log(geminiOutput)
    }

}

repoFetcher();

