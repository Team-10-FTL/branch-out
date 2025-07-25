const axios = require('axios');
require('dotenv').config();

async function fetchReposWithFilters({ startDate, endDate }) {
    
    // Filters: Must have a MIT license, must have at least one good first issue, and must be created between a startDate and endDate
    const query = `license:mit good-first-issues:>0 created:${startDate}..${endDate}`;

    // actual full search API URL - encoded component hides the full url
    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=20`;

    const response = await axios.get(url, {
        headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json"
        }
    });

    return response.data.items; // returns a promise array of matching objects
}

module.exports = { fetchReposWithFilters };


