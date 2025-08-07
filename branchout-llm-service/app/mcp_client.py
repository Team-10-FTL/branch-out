from dotenv import load_dotenv
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from mcp import ClientSession
from mcp.client.stdio import stdio_client
from mcp import StdioServerParameters
from datetime import datetime
from google import genai
from google.genai.types import Content, Part
import asyncio
import json
import os

load_dotenv()
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
    env={**os.environ, "PYTHONPH": os.environ.get("PYTHONPATH", "") + ":/app"},
)

# gemini client
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=GEMINI_API_KEY)

@app.websocket("/ws/chat")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    conversation_history = []  # Per WebSocket connection chat history

    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()

            try:
                while True:
                    data = await websocket.receive_text()
                    print(f"Received: {data}")

                    # Append user message to history
                    conversation_history.append({"role": "user", "parts": [data]})

                    # Process message using persistent MCP session
                    response = await process_message(session, conversation_history)

                    # Append model response to history
                    conversation_history.append({"role": "model", "parts": [response]})

                    print(f"Response: {response}")
                    await websocket.send_text(response)

            except WebSocketDisconnect:
                print("Client disconnected")

async def process_message(session: ClientSession, conversation_history: list) -> str:
    GROUNDING_PROMPT = """ 
        You have access to the following tools that allow you to retrieve real-time GitHub information about repositories, users, organizations, issues, and code to support open source discovery and contribution. 
        You should call these tools whenever the user’s request involves GitHub data.

        Here are the available API Tools:

        1. Fetch User Details (/users/{{username}})
            - Provides details about a specific GitHub user.
            - Use this to get information about a user, such as name, bio, avatar, and public repositories.
            - Example LLM Query: "Show me details about the user torvalds."

        2. Fetch User Organizations (/users/{{username}}/orgs)
            - Lists organizations that a user belongs to.
            - Example LLM Query: "What organizations is gaearon a part of?"

        3. Fetch User Repositories (/users/{{username}}/repos)
            - Lists public repositories for a specific user.
            - Example LLM Query: "What repositories does torvalds own?"

        4. Fetch Repository Details (/repos/{{owner}}/{{repo}})
            - Retrieves metadata about a repository (description, owner, stars, forks, etc.)
            - Example LLM Query: "Get details for the freeCodeCamp repository."

        5. Fetch Recent Commits in a Repository (/repos/{{owner}}/{{repo}}/commits)
            - Retrieves the most recent commits (up to 3) in a repository.
            - Example LLM Query: "What are the latest commits in the tensorflow repository?"

        6. Fetch Repository Labels (/repos/{{owner}}/{{repo}}/labels)
            - Lists all labels available in a repository.
            - Example LLM Query: "What are the issue labels in the vuejs/vue repository?"

        7. Fetch Repository Topics (/repos/{{owner}}/{{repo}}/topics)
            - Retrieves the topics associated with a repository.
            - Example LLM Query: "List topics for the nodejs/node repository."

        8. Fetch Repository README (/repos/{{owner}}/{{repo}}/readme)
            - Retrieves and decodes the README file of a repository.
            - Example LLM Query: "Show me the README of the django repository."

        9. Fetch CONTRIBUTING.md from a Repository (/repos/{{owner}}/{{repo}}/contents/CONTRIBUTING.md)
            - Retrieves the contributing guidelines file if it exists.
            - Example LLM Query: "Does the pytorch repository have a contributing guide?"

        10. Fetch Good First Issues (/repos/{{owner}}/{{repo}}/issues?labels=good%20first%20issue&state=open)
            - Lists open beginner-friendly issues for a repository.
            - Example LLM Query: "Find me good first issues in the kubernetes/kubernetes repository."
            - If no results are found, fallback to general open issues in the repository and look for titles or descriptions that imply beginner-friendly tasks (e.g., "easy", "good for starters", "simple fix").

        11. Search Code Snippets (/search/code?q={{query}})
            - Searches for code snippets across repositories.
            - Example LLM Query: "Search for the term 'GraphQL client' in GitHub code."

        12. Search Issues (/search/issues?q={{query}})
            - Searches for issues based on a query string.
            - Example LLM Query: "Search for issues mentioning 'CI/CD pipeline' in GitHub."

        13. Search Repositories (/search/repositories?q={{query}})
            - Searches repositories based on a query string.
            - Example LLM Query: "Find repositories with the keyword 'machine learning'."

        14. Search Users (/search/users?q={{query}})
            - Searches for users based on a query string.
            - Example LLM Query: "Search for GitHub users named Alice."

        15. Fetch Organization Details (/orgs/{{org}})
            - Retrieves information about a GitHub organization.
            - Example LLM Query: "Get details about the google organization on GitHub."

        16. Fetch Organization Repositories (/orgs/{{org}}/repos)
            - Lists public repositories of a GitHub organization.
            - Example LLM Query: "What repositories does Microsoft own?"

        17. Fetch Public Gists (/gists/public)
            - Retrieves a list of recent public gists across GitHub.
            - Example LLM Query: "Show me recent public gists on GitHub."

            IMPORTANT INSTRUCTIONS: 
            - Always return in raw markdown.
            - Keep responses concise and informative. Avoid lengthy explanations or rambling.
            - Limit responses to **120-170 words maximum**, unless explicitly asked for a detailed explanation.
            """  

    response = await client.aio.models.generate_content(
        model="gemini-2.5-flash",
        contents=[
            Content(role="model", parts=[Part(text=GROUNDING_PROMPT)]),
            *[
                Content(role=msg["role"], parts=[Part(text=part) for part in msg["parts"]])
                for msg in conversation_history
            ]
        ],
        config=genai.types.GenerateContentConfig(
            temperature=0,
            tools=[session],
        ),
    )
    return response.candidates[0].content.parts[0].text

        
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)