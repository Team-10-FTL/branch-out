#!/bin/bash

set -e

IMAGE_NAME="branchout-api"
CONTAINER_NAME="branchout-api-container"

# Optional: Check for .env file
if [ ! -f .env ]; then
  echo "⚠️  .env file not found. Exiting."
  exit 1
fi

# Optional: Stop and remove any previous container
if docker ps -a --format '{{.Names}}' | grep -Eq "^${CONTAINER_NAME}\$"; then
  echo "🧹 Removing existing container..."
  docker rm -f $CONTAINER_NAME
fi

# Build the Docker image
echo "🐳 Building Docker image..."
docker build -t $IMAGE_NAME .

# Run the container
echo "🚀 Starting container..."
docker run -d \
  --name $CONTAINER_NAME \
  --env-file .env \
  -p 5000:5000 \
  -p 3000:3000 \
  -p 8080:8080 \
  $IMAGE_NAME

echo "✅ Container '$CONTAINER_NAME' is running."
