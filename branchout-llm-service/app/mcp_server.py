
import asyncio
import uvicorn
import os
from dotenv import load_dotenv
import json
from fastmcp import FastMCP
from pydantic import Field
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from starlette.middleware.cors import CORSMiddleware
from fastapi.middleware.cors import CORSMiddleware
from typing import Any, Dict
import requests
from fastmcp import FastMCP, Client

load_dotenv()
token=os.getenv("GITHUB_TOKEN")

# Import the classes and variables you need from your other file.
# from git_api_service import GitAPIService, GitAPIServiceParams, API_PATH_TEMPLATES

url = "https://api.github.com"


mcp = FastMCP("My MCP Server")

@mcp.tool
def greet(name: str) -> str:
    return f"Hello, {name}!"

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
    except:
        print("failed :(")

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
    except:
        print("failed ;-;")

@mcp.tool
async def code_search(query: str):
    try:
        print("Running code_search")
        headers = {
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github+json"
        }
        response = requests.get(f"{url}/search/code?per_page=3&q={query}", headers=headers)
        data = response.json()
        return data
    except:
        print("failed :0")

@mcp.tool
async def issue_search(query: str):
    print("Running issue_search")
    try:
        headers = {
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github+json"
        }
        response = requests.get(f"{url}/search/issues?per_page=3&q={query}", headers=headers)
        data = response.json()
        return data
    except:
        print("failed :P")

if __name__ == "__main__":
    mcp.run()