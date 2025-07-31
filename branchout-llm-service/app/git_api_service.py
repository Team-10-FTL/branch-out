from typing import Dict, Any
import logging
import httpx
from pydantic import BaseModel
import os
from dotenv import load_dotenv
load_dotenv()
# Create a .env file in the branchout-llm-service directory
# and add your GITHUB_TOKEN="ghp_..." and GITHUB_API_URL="https://api.github.com"

logger = logging.getLogger(__name__)

# This dictionary should live with the service that uses it.
API_PATH_TEMPLATES = {
    "fetch_current_user_url": "/user",
    "code_search": "/search/code?q={query}",
    "commit_search": "/search/commits?q={query}",
    "issue_search": "/search/issues?q={query}",
    "label_search": "/search/labels?q={query}&repository_id={repository_id}",
    "fetch_organization_details": "/orgs/{org}",
    "fetch_organization_repositories": "/orgs/{org}/repos",
    "fetch_organization_teams": "/orgs/{org}/teams",
    "fetch_public_gists": "/gists/public",
    "fetch_repository_details": "/repos/{owner}/{repo}",
    "repository_search": "/search/repositories?q={query}",
    "fetch_current_user_repositories": "/user/repos",
    "topic_search": "/search/topics?q={query}",
    "fetch_user_details": "/users/{user}",
    "fetch_user_organizations": "/user/orgs",
    "fetch_user_repositories": "/users/{user}/repos",
    "user_search": "/search/users?q={query}"
}

class GitAPIServiceParams(BaseModel):
    api_endpoint: str
    owner: str = ""
    repo: str = ""
    user: str = ""
    query: str = ""
    org: str = ""
    repository_id: str = ""

class GitAPIService:
    def __init__(self):
        # We'll load secrets directly for simplicity.
        self._token = os.getenv("GITHUB_TOKEN")
        self._api_url = os.getenv("GITHUB_API_URL", "https://api.github.com")
        if not self._token:
            raise ValueError("GITHUB_TOKEN is not set in the environment.")
        logger.info("GitAPIService initialized.")

    async def _make_api_call(self, params: GitAPIServiceParams) -> Dict[str, Any]:
        headers = {"Authorization": f"Bearer {self._token}"}
        url = f"{self._api_url}{API_PATH_TEMPLATES[params.api_endpoint].format(**params.model_dump())}"
        print(f"Making API call to {url}")

        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers)
        
        response.raise_for_status() # This is a better way to handle HTTP errors
        
        return {
            "endpoint": params.api_endpoint,
            "status_code": response.status_code,
            "response": response.json()
        }
