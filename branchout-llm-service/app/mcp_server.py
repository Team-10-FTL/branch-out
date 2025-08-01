from dotenv import load_dotenv
from fastmcp import FastMCP
from pydantic import Field
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from starlette.middleware.cors import CORSMiddleware
from fastapi.middleware.cors import CORSMiddleware
from fastmcp import FastMCP, Client
from urllib.parse import quote
from typing import Any, Dict
import requests
import asyncio
import uvicorn
import base64
import json
import os

load_dotenv()
token=os.getenv("GITHUB_TOKEN")
url = "https://api.github.com"


mcp = FastMCP("My MCP Server")

@mcp.tool
def greet(name: str) -> str:
    return f"Hello, {name}!"

############################## /users/ subdomain endpoints ################################################### 

# fetch user info
@mcp.tool
async def get_user_info(username: str):
    print("Running get_user_info")
    try:
        headers = {
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github+json"
        }
        response = requests.get(f"{url}/users/{username}", headers=headers)
        data = response.json()
        return data
    except Exception as e:
        print(f"failed :P {e}")

# fetch user orgs
@mcp.tool
async def get_user_orgs(username: str):  # HAVE TO ASK FOR USERNAME
    print("Running get_user_orgs")
    try:
        headers = {
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github+json"
        }
        response = requests.get(f"{url}/users/{username}/orgs", headers=headers)
        data = response.json()
        return data
    except Exception as e:
        print(f"failed :P {e}")

############################## /repos/ subdomain endpoints ################################################### 

@mcp.tool
async def get_repo_info(owner: str, repo: str):
    print("Running get_repo_info")
    try:
        headers = {
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github+json"
        }
        response = requests.get(f"{url}/repos/{owner}/{repo}", headers=headers)
        data = response.json()
        return data
    except Exception as e:
        print(f"failed :P {e}")

# commit search for context on commits
@mcp.tool
async def commit_search(owner: str, repo: str):
    print("Running commit_search")
    try:
        headers = {
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github+json"
        }
        response = requests.get(f"{url}/repos/{owner}/{repo}/commits?per_page=3", headers=headers)
        data = response.json()
        return data
    except Exception as e:
        print(f"failed :P {e}")

# label search
@mcp.tool
async def label_search(owner: str, repo: str):
    print("Running label_search")
    try:
        headers = {
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github+json"
        }
        response = requests.get(f"{url}/repos/{owner}/{repo}/labels", headers=headers)
        data = response.json()
        return data
    except Exception as e:
        print(f"failed :P {e}")

# search topics to connect to users query
@mcp.tool
async def topic_search(owner: str, repo: str):
    print("Running topic_search")
    try:
        headers = {
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github+json"
        }
        response = requests.get(f"{url}/repos/{owner}/{repo}/topics", headers=headers)
        data = response.json()
        return data
    except Exception as e:
        print(f"failed :P {e}")
        
# get read me for more metadata
@mcp.tool
async def get_readme(owner: str, repo: str):
    print("Running get_readme")
    try:
        headers = {
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github+json"
        }
        response = requests.get(f"{url}/repos/{owner}/{repo}/readme", headers=headers)
        data = response.json()
        # regularly, readme is in plaintext, BUT from API endpoint, content is base64 encoded
        content = base64.b64decode(data['content']).decode('utf-8')
        return {"name": data['name'], "content": content}
    except Exception as e:
        print(f"failed :P {e}")

# get contribution md file for context
@mcp.tool
async def get_contributing_doc(owner: str, repo: str):
    print("Running get_contributing_doc")
    try:
        headers = {
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github+json"
        }
        response = requests.get(f"{url}/repos/{owner}/{repo}/contents/CONTRIBUTING.md", headers=headers)
        if response.status_code == 404:
            return {"error": "CONTRIBUTING.md not found in the repository"}
        data = response.json()
        content = base64.b64decode(data['content']).decode('utf-8')
        return {"name": data['name'], "content": content}
    except Exception as e:
        print(f"failed :P {e}")

# get GFIs, points to where a new dev could contribute
@mcp.tool
async def get_good_first_issues(owner: str, repo: str):
    print("Running get_good_first_issues")
    try:
        headers = {
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github+json"
        }
        response = requests.get(f"{url}/repos/{owner}/{repo}/issues?labels=good%20first%20issue,help%20wanted&state=open", headers=headers)
        data = response.json()
        return data
    except Exception as e:
        print(f"failed :P {e}")

############################## /search/ subdomain endpoints ################################################### 

# regular search bar search for snippet of code
@mcp.tool
async def code_search(query: str):
    encoded_query = quote(query)
    try:
        print("Running code_search")
        headers = {
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github+json"
        }
        response = requests.get(f"{url}/search/code?per_page=3&q={encoded_query}", headers=headers)
        data = response.json()
        return data
    except Exception as e:
        print(f"failed :P {e}")

# search bar search for issues
@mcp.tool
async def issue_search(query: str):
    encoded_query = quote(query)
    print("Running issue_search")
    try:
        headers = {
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github+json"
        }
        response = requests.get(f"{url}/search/issues?per_page=3&q={encoded_query}", headers=headers)
        data = response.json()
        return data
    except Exception as e:
        print(f"failed :P {e}")


# repo search based on query
@mcp.tool
async def repo_search(query: str):
    encoded_query = quote(query)
    print("Running repo_search")
    try:
        headers = {
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github+json"
        }
        response = requests.get(f"{url}/search/repositories?q=license:mit+{encoded_query}&per_page=3", headers=headers)
        data = response.json()
        return data
    except Exception as e:
        print(f"failed :P {e}")

# search bar search for a user
@mcp.tool
async def search_users(query: str): 
    encoded_query = quote(query)
    print("Running search_users")
    try:
        headers = {
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github+json"
        }
        response = requests.get(f"{url}/search/users?q={encoded_query}", headers=headers)
        data = response.json()
        return data
    except Exception as e:
        print(f"failed :P {e}")

############################## /orgs/ subdomain endpoints ################################################### 

# fetch org details
@mcp.tool
async def org_details(org: str):
    print("Running org_details")
    try:
        headers = {
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github+json"
        }
        response = requests.get(f"{url}/orgs/{org}", headers=headers)
        data = response.json()
        return data
    except Exception as e:
        print(f"failed :P {e}")

# fetch org repos
@mcp.tool
async def org_repos(org: str):
    print("Running org_repos")
    try:
        headers = {
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github+json"
        }
        response = requests.get(f"{url}/orgs/{org}/repos", headers=headers)
        data = response.json()
        return data
    except Exception as e:
        print(f"failed :P {e}")

############################## gists & username (eventually authenticated) subdomain endpoints ############################## 

# fetch public gists
@mcp.tool
async def get_public_gists(org: str):
    print("Running get_gists")
    try:
        headers = {
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github+json"
        }
        response = requests.get(f"{url}/gists/public", headers=headers)
        data = response.json()
        return data
    except Exception as e:
        print(f"failed :P {e}")

# fetch current users details
@mcp.tool
async def get_user_details(username: str): # HAVE TO ASK FOR USERNAME
    print("Running get_user_details")
    try:
        headers = {
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github+json"
        }
        response = requests.get(f"{url}/{username}", headers=headers)
        data = response.json()
        return data
    except Exception as e:
        print(f"failed :P {e}")

# fetch current users repositories
@mcp.tool
async def get_user_repos(username: str):  # HAVE TO ASK FOR USERNAME
    print("Running get_user_repos")
    try:
        headers = {
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github+json"
        }
        response = requests.get(f"{url}/users/{username}/repos", headers=headers)
        data = response.json()
        return data
    except Exception as e:
        print(f"failed :P {e}")



if __name__ == "__main__":
    mcp.run()