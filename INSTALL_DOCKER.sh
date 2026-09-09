#!/bin/bash

# Install Docker and Docker Compose on Ubuntu 24.04

echo "=========================================="
echo "Installing Docker on Ubuntu 24.04"
echo "=========================================="
echo ""

# Update system
echo "[1/4] Updating system packages..."
apt-get update
apt-get upgrade -y

# Install Docker
echo "[2/4] Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose (as plugin)
echo "[3/4] Installing Docker Compose..."
apt-get install -y docker-compose-plugin

# Verify installation
echo "[4/4] Verifying installation..."
docker --version
docker compose version

echo ""
echo "=========================================="
echo "✅ Docker Installation Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "  1. cd /opt/techwokx/config"
echo "  2. docker compose -p techwokx up -d"
echo "  3. docker compose -p techwokx logs -f"
echo ""
