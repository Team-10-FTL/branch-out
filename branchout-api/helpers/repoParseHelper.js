import axios from "axios";

// parses raw GitHub repository data into a structured format, useful for storing or displaying only the relevant details.

export async function parseRepoForGemini(repo) {
  // takes in a single repo from the api
  let readme = "";

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

  return {
    name: repo.name,
    owner: repo.owner?.login || "",
    stars: repo.stargazers_count || 0,
    repoLink: repo.html_url || "",
    license: repo.license?.spdx_id || "",
    description: repo.description || "",
    topics: repo.topics || [],
    readme: readme,
    created_at: repo.created_at,
    github_id: repo.id,
  };
}