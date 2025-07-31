import os
import asyncio
from datetime import datetime
import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from mcp import ClientSession
from mcp.client.stdio import stdio_client
from mcp import StdioServerParameters
from google import genai

app = FastAPI()

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MCP Server Parameters
server_params = StdioServerParameters(
    command="python",
    args=["./app/mcp_server.py"],
    env={**os.environ, "PYTHONPATH": os.environ.get("PYTHONPATH", "") + ":/app"},
)

# Create server parameters for stdio connection
server_params = StdioServerParameters(
    command="python",  # Executable
    args=["./app/mcp_server.py"],  # MCP Server
    env={
        **os.environ,
        "PYTHONPATH": os.environ.get("PYTHONPATH", "") + ":/app"
    },  # Optional environment variables
)

# gemini client
GEMINI_API_KEY="AIzaSyAXQnUUSmvcUt1LI4HOKioh-LoA2MsHjxc"
client = genai.Client(api_key=GEMINI_API_KEY)

#   define form of communication frontend -> here
@app.websocket("/ws/chat")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            print(f"Received: {data}")      #run params on whats passed in

            # run mcp client logic block here
            response = await process_message(data)
            print(f"Response: {response}")

            await websocket.send_text(response)
    except WebSocketDisconnect:
        print("Client disconnected")

# async def run(Message: str):
async def process_message(message: str) -> str:
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            #prompt="Tell me about the user. This is the username JackieJrdo"
            # get_repo_info prompt
            #prompt= "Get me information about the repository 'IslandOps' owned by 'JackieJrdo'."

            # code_search prompt
            # prompt= "Search GitHub code for the keyword 'FastMCP'."

            # prmt = """

            # Use this tool to interact with the GitHub API to retrieve detailed information about repositories, users, and issues to support open source discovery and contribution.
            # Use the API endpoints below to gather information about repositories, issues, users, and more to help users discover projects and contribution opportunities.


            # """
            
            # issue_search prompt
            # prompt = "Search GitHub for open issues regarding 'UI Fixes' that are suitable for contribution. "

            # Send request to the model with MCP function declarations


            # call Gemini with MCP session (as a toooooool)
            response = await client.aio.models.generate_content(
                model="gemini-2.5-flash",
                contents=f"""
                    You have access to the following tools that allow you to retrieve real-time GitHub information. You should call these tools whenever the user’s request involves GitHub data.

                    Tools:

                    get_user_info
                    Description: Retrieves GitHub user profile information.
                    Parameters:
                    username (string): The GitHub username you want to look up.
                    Example Call:
                    get_user_info(username="JackieJrdo")

                    get_repo_info
                    Description: Retrieves information about a specific GitHub repository.
                    Parameters:
                    owner (string): The GitHub username or organization that owns the repository.
                    repo (string): The name of the repository.
                    Example Call:
                    get_repo_info(owner="JackieJrdo", repo="branchout-llm-service")

                    code_search
                    Description: Searches for code snippets across GitHub repositories using a search query.
                    Parameters:
                    query (string): The search term to look for in GitHub code.
                    Example Call:
                    code_search(query="FastMCP")

                    issue_search
                    Description: Searches for GitHub issues (open or closed) using a search query.
                    Parameters:
                    query (string): The search term to look for in GitHub issues.
                    Example Call:
                    issue_search(query="login bug in repo:JackieJrdo/branchout-llm-service")

                    Instructions:
                    Whenever a user asks for GitHub-related information, use the appropriate tool.
                    Make sure to use the correct parameter names and values as shown in the examples.
                    Use get_user_info for user profiles.
                    Use get_repo_info for specific repository details.
                    Use code_search for searching code snippets.
                    Use issue_search for finding GitHub issues.

                    Example User Requests and Tool Calls:
                    "Tell me about the GitHub user JackieJrdo." → Call get_user_info(username="JackieJrdo")
                    "Get me info about the repository branchout-llm-service owned by JackieJrdo." → Call get_repo_info(owner="JackieJrdo", repo="branchout-llm-service")
                    "Search for code related to OAuth in GitHub." → Call code_search(query="OAuth")
                    "Find issues mentioning 'authentication failure' in the repo JackieJrdo/branchout-llm-service." → Call issue_search(query="authentication failure in repo:JackieJrdo/branchout-llm-service")


                    This is the users message: {message}
                """,
                config=genai.types.GenerateContentConfig(
                    temperature=0,
                    tools=[session], #uses session but will automatically call the session
                ),
            )
            return response.text

# Start the asyncio event loop and run the main function
# asyncio.run(run("Can you tell me more about this repo: JackieJrdo/IslandOps"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)