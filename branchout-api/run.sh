#!/bin/bash

set -e

PYTHON_VERSION="3.10"
VENV_DIR=".venv"

# Check for pyenv, install if missing
if ! command -v pyenv &>/dev/null; then
  echo "❌ pyenv is not installed. Installing with Homebrew..."
  brew install pyenv
fi

# Install Python 3.8 with pyenv if not present
if ! pyenv versions | grep -q "${PYTHON_VERSION}"; then
  echo "🐍 Installing Python ${PYTHON_VERSION} with pyenv..."
  pyenv install ${PYTHON_VERSION}
fi

# Set local python version
pyenv local ${PYTHON_VERSION}

# Create virtual environment if it doesn't exist
if [ ! -d "$VENV_DIR" ]; then
  echo "🐍 Creating Python ${PYTHON_VERSION} virtual environment..."
  python3 -m venv $VENV_DIR
fi

# Activate the virtual environment
source $VENV_DIR/bin/activate


# Install project dependencies
pip3 install -r requirements.txt

# Optional: Check for .env file
if [ ! -f .env ]; then
  echo "⚠️  .env file not found. Exiting."
  deactivate
  exit 1
fi

# ✅ Run FastAPI server from project root to keep imports valid
echo "🚀 Starting FastAPI server..."
fastapi dev ./recommender/sentence_transformer_predict.py

deactivate
