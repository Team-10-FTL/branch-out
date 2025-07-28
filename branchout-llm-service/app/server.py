# In: branchout-llm-service/app/server.py
from fastmcp import FastMCP
from pydantic import Field

# --- THIS IS THE CRITICAL STEP ---
# Import the classes and variables you need from your other file.
from .git_api_service import GitAPIService, GitAPIServiceParams, API_PATH_TEMPLATES

# Define a constant for the tool name
GIT_API_SERVICE_TOOL_NAME = "GitHub_API"

mcp = FastMCP(
    name="BranchoutLLMService",
    version="1.0.0",
)

@mcp.tool(
    name=GIT_API_SERVICE_TOOL_NAME,
    description="""Use this tool to interact with the GitHub API to retrieve information about repositories, commits, pull requests, and more.
        
        :mag: AUTOMATIC TRACKING: All API calls are automatically tracked with source attribution.

        IMPORTANT: Before calling any API endpoint, ensure you have a valid GitHub token for authentication.

        Workflow:
        1. Call the `connect` method to establish a connection to the GitHub API.
        2. Use the following available API endpoints to perform various operations:

        Here are the available APIs:
        1. REST API - Fetch Current User (/user)
            - What it provides: Details about the current user.
            - Why it's useful: Use this to get information about the current user, such as their name, email, and avatar.
            Example LLM Query: "What is the current user's name?"
        2. REST API - Code Search (/search/code?q={query})
            - What it provides: Search for code in a repository.
            - Why it's useful: Use this to search for specific code in a repository.
            Example LLM Query: "What is the code for the salesforce-knowledge-pipeline repository?"
        3. REST API - Commit Search (/search/commits?q={query})
            - What it provides: Search for commits in a repository.
            - Why it's useful: Use this to search for specific commits in a repository.
            Example LLM Query: "What are the commits for the salesforce-knowledge-pipeline repository?"
        4. REST API - Issue Search (/search/issues?q={query})
            - What it provides: Search for issues in a repository.
            - Why it's useful: Use this to search for specific issues in a repository.
            Example LLM Query: "What are the issues for the salesforce-knowledge-pipeline repository?"
        5. REST API - Label Search (/search/labels?q={query}&repository_id={repository_id})
            - What it provides: Search for labels in a repository.
            - Why it's useful: Use this to search for specific labels in a repository.
            Example LLM Query: "What are the labels for the salesforce-knowledge-pipeline repository?"
        6. REST API - Fetch Organization Details (/orgs/{org})
            - What it provides: Details about a specific GitHub organization.
            - Why it's useful: Use this to get information about an organization, such as its name, description, and avatar.
            Example LLM Query: "What are the details of the salesforce organization?"
        7. REST API - Fetch Organization Repositories (/orgs/{org}/repos)
            - What it provides: List of repositories in a specific GitHub organization.
            - Why it's useful: Use this to get a quick overview of the repositories in an organization.
            Example LLM Query: "What are the repositories in the salesforce organization?"
        8. REST API - Fetch Organization Teams (/orgs/{org}/teams)
            - What it provides: List of teams in a specific GitHub organization.
            - Why it's useful: Use this to get a quick overview of the teams in an organization.
            Example LLM Query: "What are the teams in the salesforce organization?"
        9. REST API - Fetch Public Gists (/gists/public)
            - What it provides: List of public gists.
            - Why it's useful: Use this to get a quick overview of the public gists.
            Example LLM Query: "What are the public gists?"
        10. REST API - Fetch Repository Details (/repos/{owner}/{repo})
            - What it provides: Details about a specific GitHub repository.
            - Why it's useful: Use this to get information about a repository, such as its name, description, and owner.
            Example LLM Query: "What are the details of the salesforce-knowledge-pipeline repository?"
        11. REST API - Fetch Repository Search (/search/repositories?q={query})
            - What it provides: Search for repositories.
            - Why it's useful: Use this to search for specific repositories.
            Example LLM Query: "What are the repositories for the salesforce organization?"
        12. REST API - Fetch Current User Repositories (/user/repos)
            - What it provides: List of repositories for the current user.
            - Why it's useful: Use this to get a quick overview of the repositories for the current user.
            Example LLM Query: "What are the repositories for the current user?"
        13. REST API - Fetch User Details (/users/{user})
            - What it provides: Details about a specific GitHub user.
            - Why it's useful: Use this to get information about a user, such as their name, email, and avatar.
            Example LLM Query: "What are the details of the salesforce user?"
        14. REST API - Fetch User Repositories (/users/{user}/repos)
            - What it provides: List of repositories for a specific GitHub user.
            - Why it's useful: Use this to get a quick overview of the repositories for a specific user.
            Example LLM Query: "What are the repositories for the salesforce user?"
        15. REST API - Topic Search (/search/topics?q={query})
            - What it provides: Search for topics.
            - Why it's useful: Use this to search for specific topics.
            Example LLM Query: "What are the topics for the salesforce organization?"
        16. REST API - Fetch User Organizations (/user/orgs)
            - What it provides: List of organizations for the current user.
            - Why it's useful: Use this to get a quick overview of the organizations for the current user.
            Example LLM Query: "What are the organizations for the current user?"
        17. REST API - Fetch User Search (/search/users?q={query})
            - What it provides: Search for users.
            - Why it's useful: Use this to search for specific users.
            Example LLM Query: "What are the users for the salesforce organization?"""
)
async def call_git_api(
    api_endpoint: str = Field(description="The API endpoint to call", enum=list(API_PATH_TEMPLATES.keys())),
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
        return response
    except Exception as e:
        print(f"An error occurred: {e}")
        return f"An error occurred: {e}"

# Note: The if __name__ == "__main__": block is not needed
# when running with a production server like Uvicorn.
