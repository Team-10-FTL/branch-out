import asyncio
from fastmcp import Client

async def main():
    client = Client("http://localhost:8080/mcp/")
    async with client:
        tools = await client.list_tools()
        print("Tools:", tools)
        result = await client.call_tool(
            "GitHub_API",
            {"api_endpoint": "fetch_current_user_url"}
        )
        print("Result:", result)

if __name__ == "__main__":
    asyncio.run(main())
