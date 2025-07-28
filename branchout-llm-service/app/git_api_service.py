# from typing import Dict, Any
# import logging
# import httpx
# from .base_api_service import BaseAPIService
# from pydantic import BaseModel # used for data validation (makes sure params are right)
# from config.settings import settings # makes it easy to manage secrets

# logger = logging.getLogger(__name__) #logger for monitoring and debugging.

# # dictionary maps easy-to-remember names to the actual GitHub API URL paths.
# # makes the code cleaner and easier to maintain.
# API_PATH_TEMPLATES = {
#     "fetch_current_user_url": "/user",
#     "code_search": "/search/code?q={query}",
#     "commit_search": "/search/commits?q={query}",
#     "issue_search": "/search/issues?q={query}",
#     "label_search": "/search/labels?q={query}&repository_id={repository_id}",
#     "fetch_organization_details": "/orgs/{org}",
#     "fetch_organization_repositories": "/orgs/{org}/repos",
#     "fetch_organization_teams": "/orgs/{org}/teams",
#     "fetch_public_gists": "/gists/public",
#     "fetch_repository_details": "/repos/{owner}/{repo}",
#     "repository_search": "/search/repositories?q={query}",
#     "fetch_current_user_repositories": "/user/repos",
#     "topic_search": "/search/topics?q={query}",
#     "fetch_user_details": "/users/{user}",
#     "fetch_user_organizations": "/user/orgs",
#     "fetch_user_repositories": "/users/{user}/repos",
#     "user_search": "/search/users?q={query}"
# }

# # Pydantic model that defines the expected data types for the parameters that can be passed to the API - helps prevent errors by catching invalid data early.
# class GitAPIServiceParams(BaseModel):
#     api_endpoint: str
#     owner: str
#     repo: str
#     user: str
#     query: str
#     org: str
#     repository_id: str

# class GitAPIService():
#     def __init__(self):
#         # loads the GitHub token and API URL from the settings.
#         self._token = settings.github.token
#         self._api_url = settings.github.api_url
#         logger.info(f"GitAPIService initialized.")

#     async def _make_api_call(self, params: GitAPIServiceParams) -> Dict[str, Any]:
#         # async makes the actual API call.
#         headers = {
#             # The GitHub token is included in the request headers for authentication 
#             "Authorization": f"Bearer {self._token}"
#         }
#         # URL constructed by combining the base API URL with the specific endpoint template.
#         # The **params.model_dump() is a neat trick to fill in the placeholders (e.g., {query}, {owner}) in the URL.
#         url = f"{self._api_url}{API_PATH_TEMPLATES[params.api_endpoint].format(**params.model_dump())}"
#         print(f"Making API call to {url}")

#         # httpx uses async client meaning app can handle other tasks while waiting for GitHub's response
#         async with httpx.AsyncClient(verify=False) as client:
#             response = await client.get(url, headers=headers)
        
#         if response.status_code >= 400:
#             raise Exception(f"API request failed with status {response.status_code}: {response.text}")
        
#         # The method returns a dictionary with the endpoint name, status code, and the JSON response from the API.
#         return {
#             "endpoint": params.api_endpoint,
#             "status_code": response.status_code,
#             "response": response.json()
#         }


# In: branchout-llm-service/app/git_api_service.py

from typing import Dict, Any
import logging
import httpx
from pydantic import BaseModel

# For now, let's define settings here. We can move this to a config file later.
# You will need to create a .env file in the branchout-llm-service directory
# and add your GITHUB_TOKEN="ghp_..." and GITHUB_API_URL="https://api.github.com"
import os
from dotenv import load_dotenv
load_dotenv()

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
