#!/bin/bash

# Set the image name
IMAGE_NAME="branchout-ui"

# Build the Docker image
echo "🛠️ Building frontend Docker image..."
docker build -t $IMAGE_NAME ./frontend

# Run the container
echo "🚀 Running frontend on http://localhost:5173"
docker run -p 5173:5173 --name $IMAGE_NAME-container $IMAGE_NAME
