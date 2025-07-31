# In: branchout-llm-service/app/server.py
import asyncio
import uvicorn
import json
from fastmcp import FastMCP
from pydantic import Field
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from fastapi.middleware.cors import CORSMiddleware
from typing import Any, Dict


# Import the classes and variables you need from your other file.
# from git_api_service import GitAPIService, GitAPIServiceParams, API_PATH_TEMPLATES
from app.git_api_service import GitAPIService, GitAPIServiceParams, API_PATH_TEMPLATES

# Define a constant for the tool name
GIT_API_SERVICE_TOOL_NAME = "GitHub_API"

mcp = FastMCP(
    name="OpenSourceInsight",
    version="1.0.0",
    middleware=[
        {
            "middleware_class": CORSMiddleware,
            "options": {
                "allow_origins": ["http://localhost:5173"],
                "allow_credentials": True,
                "allow_methods": ["GET", "POST", "OPTIONS"],
                "allow_headers": ["*"],
            },
        }
    ]
)

@mcp.tool(
    name=GIT_API_SERVICE_TOOL_NAME,
    description="""Use this tool to interact with the GitHub API to retrieve detailed information about repositories, users, and issues to support open source discovery and contribution.
        
        :mag: AUTOMATIC TRACKING: All API calls are automatically tracked with source attribution.

        IMPORTANT: Before calling any API endpoint, ensure you have a valid GitHub token for authentication.

        Workflow:
        1. Call the `connect` method to establish a connection to the GitHub API.
        2. Use the API endpoints below to gather information about repositories, issues, users, and more to help users discover projects and contribution opportunities.

        Here are the available APIs:
        1. REST API - Fetch Current User (/user)
            - Provides details about the authenticated GitHub user.
            - Useful to get profile info such as name, email, and avatar.
            Example LLM Query: "What is my GitHub username?"
        2. REST API - Code Search (/search/code?q={query})
            - Search for code snippets in repositories.
            - Useful to find specific implementations or examples.
            Example LLM Query: "Show me examples of OAuth code in the branchout-llm-service repo."
        3. REST API - Commit Search (/search/commits?q={query})
            - Search commits in repositories.
            - Useful to explore recent changes or history.
            Example LLM Query: "What recent commits have been made to the open source recommendation engine?"
        4. REST API - Issue Search (/search/issues?q={query})
            - Search for issues in repositories.
            - Useful to find open issues suitable for contribution.
            Example LLM Query: "List open issues labeled 'good first issue' in the branchout repo."
        5. REST API - Label Search (/search/labels?q={query}&repository_id={repository_id})
            - Search for labels within a repository.
            - Useful to understand issue categorization.
            Example LLM Query: "What labels are available in the branchout-llm-service repo?"
        6. REST API - Fetch Organization Details (/orgs/{org})
            - Get details about a GitHub organization.
            - Useful to overview organizations hosting repositories.
            Example LLM Query: "What is the description of the 'branchout' organization?"
        7. REST API - Fetch Organization Repositories (/orgs/{org}/repos)
            - List repositories in an organization.
            - Useful to discover projects to contribute to within an organization.
            Example LLM Query: "What repositories belong to the 'branchout' organization?"
        8. REST API - Fetch Organization Teams (/orgs/{org}/teams)
            - List teams within an organization.
            - Useful to understand project groups and maintainers.
            Example LLM Query: "What teams exist in the 'branchout' org?"
        9. REST API - Fetch Public Gists (/gists/public)
            - List public gists.
            - Useful to explore community code snippets.
            Example LLM Query: "Show me recent public gists on OAuth implementations."
        10. REST API - Fetch Repository Details (/repos/{owner}/{repo})
            - Get details about a specific repository.
            - Useful to gather description, owner, contributors, and activity.
            Example LLM Query: "What are the details of the 'branchout-llm-service' repository?"
        11. REST API - Repository Search (/search/repositories?q={query})
            - Search for repositories across GitHub.
            - Useful to find projects matching a keyword or topic.
            Example LLM Query: "Find repositories related to 'open source contribution'."
        12. REST API - Fetch Current User Repositories (/user/repos)
            - List repositories owned by the current user.
            - Useful for personalized views of user projects.
            Example LLM Query: "List my GitHub repositories."
        13. REST API - Fetch User Details (/users/{user})
            - Get profile details for a GitHub user.
            - Useful to display info about other contributors or users.
            Example LLM Query: "What is the GitHub profile info for user 'janedoe'?"
        14. REST API - Fetch User Repositories (/users/{user}/repos)
            - List repositories owned by a specified user.
            - Useful to explore potential projects to contribute to.
            Example LLM Query: "Show me repositories owned by 'janedoe'."
        15. REST API - Topic Search (/search/topics?q={query})
            - Search topics used to tag repositories.
            - Useful to find projects by interest area.
            Example LLM Query: "What topics are tagged for 'machine learning'?"
        16. REST API - Fetch User Organizations (/user/orgs)
            - List organizations the current user belongs to.
            - Useful for personalized contribution contexts.
            Example LLM Query: "What organizations am I a member of?"
        17. REST API - User Search (/search/users?q={query})
            - Search for users by name or username.
            - Useful to find contributors or collaborators.
            Example LLM Query: "Find users with the name 'janedoe'."
    """
)
async def call_git_api(
    api_endpoint: str = Field(
        description="The API endpoint to call",
        json_schema_extra={"enum": list(API_PATH_TEMPLATES.keys())}
    ),
    owner: str = Field(description="The owner of the repository", default=""),
    repo: str = Field(description="The name of the repository", default=""),
    user: str = Field(description="The name of the user", default=""),
    query: str = Field(description="The query to search for", default=""),
    org: str = Field(description="The name of the organization", default=""),
    repository_id: str = Field(description="The ID of the repository", default=""),
) -> str:
    """Calls the specified GitHub API endpoint with the given parameters."""
    params = GitAPIServiceParams(
        api_endpoint=api_endpoint,
        owner=owner,
        repo=repo,
        user=user,
        query=query,
        org=org,
        repository_id=repository_id,
    )
    try:
        print(f"Calling Git API Service with params: {params}")
        git_api_service = GitAPIService()
        response = await git_api_service._make_api_call(params=params)
        return {"result": json.dumps(response)}
    except Exception as e:
        print(f"An error occurred: {e}")
        return f"An error occurred: {e}"

if __name__ == "__main__":
    mcp.run(transport="streamable-http", host="0.0.0.0", port=8000)