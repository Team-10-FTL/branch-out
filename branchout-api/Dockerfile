FROM --platform=linux/amd64 ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies
RUN apt-get update && \
    apt-get install -y software-properties-common curl wget bzip2 \
    build-essential libffi-dev libssl-dev libxml2 libxslt-dev \
    python3.8 python3.8-venv python3.8-dev python3-pip gcc

# Install Node.js 22.x
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs

# Set Python 3.8 as default
RUN ln -sf /usr/bin/python3.8 /usr/bin/python && \
    ln -sf /usr/bin/python3.8 /usr/local/bin/python && \
    ln -sf /usr/bin/pip3 /usr/local/bin/pip

# Optional: virtualenv (recommended)
RUN pip install --upgrade pip virtualenv

# Set working directory
WORKDIR /app

# Copy and install Node dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the app
COPY . .

# Create Python virtual environment and install Python dependencies
RUN python -m venv /opt/venv && \
    /opt/venv/bin/pip install --upgrade pip && \
    /opt/venv/bin/pip install -r recommender/requirements.txt

# Make venv active by default
ENV PATH="/opt/venv/bin:$PATH"

RUN npx prisma --version
RUN npx prisma generate



# Expose relevant ports
EXPOSE 5000 3000 8080

# Install concurrently globally
RUN npm install -g concurrently

# Start both Node server and recommender server (adjust commands as needed)
CMD ["concurrently", "\"npm:start\"", "node controllers/wsServer.js"]
