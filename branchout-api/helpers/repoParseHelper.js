// import axios from "axios";
const axios = require("axios");

// parses raw GitHub repository data into a structured format, useful for storing or displaying only the relevant details.
async function parseRepoForGemini(repo) {
// takes in a single repo from the api
let readme = "";
let languages = [];

    // since readme is at a different endpoint, have to get it differently or return empty
    try {
        const res = await axios.get(
        `https://api.github.com/repos/${repo.full_name}/readme`,
        {
            headers: {
            Authorization: `token ${process.env.GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3.raw",
            },
        }
        );
        readme = res.data;
    } catch {
        console.warn(`No README file found for ${repo.full_name}`);
    }

    // since languages returns a map, get only the keys
    try {
        const languagesRes = await axios.get(repo.languages_url, {
            headers: {
                Authorization: `token ${process.env.GITHUB_TOKEN}`,
                Accept: "application/vnd.github+json"
            }
        });
        // The languages API returns an object where keys are language names and values are byte counts. We just want the names (keys)
        languages = Object.keys(languagesRes.data);
    } catch (error) {
        console.warn(`Could not fetch languages for ${repo.full_name}: ${error.message}`);
        // If there's an error fetching languages, you might default to the primary language (simple .language string)
        if (repo.language) { // Check if the primary 'language' field exists
            languages = [repo.language];
        }
    }

    return {
        name: repo.name,
        owner: repo.owner?.login || "",
        stars: repo.stargazers_count || 0,
        repoLink: repo.html_url || "",
        languages: repo.languages || [],
        license: repo.license?.spdx_id || "",
        description: repo.description || "",
        topics: repo.topics || [],
        readme: readme,
        created_at: repo.created_at,
        githubId: repo.id,
    };
}

module.exports = { parseRepoForGemini };
