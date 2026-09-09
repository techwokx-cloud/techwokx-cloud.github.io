#!/bin/bash

# TechWokx VPS Deployment Script
# Deploys marketing dashboard and all services

set -e

echo "=========================================="
echo "TechWokx Deployment Script"
echo "=========================================="
echo ""

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root" 
   exit 1
fi

# Setup directories
echo "[1/5] Setting up directory structure..."
mkdir -p /opt/techwokx/{app,config,data,logs,backups}
mkdir -p /var/www/techwokx
chmod 755 /opt/techwokx
echo "✓ Directories created"

# Check Docker
echo "[2/5] Checking Docker installation..."
if ! command -v docker &> /dev/null; then
    echo "✗ Docker not found. Install Docker first:"
    echo "  curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh"
    exit 1
fi
echo "✓ Docker found: $(docker --version)"

if ! command -v docker-compose &> /dev/null; then
    echo "✗ Docker Compose not found. Installing..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    echo "✓ Docker Compose installed"
else
    echo "✓ Docker Compose found: $(docker-compose --version)"
fi

# Environment setup
echo "[3/5] Checking environment configuration..."
if [ ! -f /opt/techwokx/app/.env ]; then
    echo "✗ .env file not found. Creating from template..."
    cp /opt/techwokx/app/.env.example /opt/techwokx/app/.env
    echo ""
    echo "⚠️  CONFIGURATION REQUIRED:"
    echo "   Edit /opt/techwokx/app/.env with your Meta Ads credentials:"
    echo ""
    echo "   nano /opt/techwokx/app/.env"
    echo ""
    echo "   Required fields:"
    echo "   - META_ACCESS_TOKEN: Your Meta Business Account access token"
    echo "   - META_AD_ACCOUNT_ID: Your Ad Account ID (act_xxxxx)"
    echo ""
    echo "   Once configured, run this script again."
    exit 0
else
    echo "✓ .env configuration found"
fi

# Network setup
echo "[4/5] Setting up Docker network..."
docker network create techwokx-network 2>/dev/null || true
echo "✓ Network ready"

# Start services
echo "[5/5] Starting services..."
cd /opt/techwokx/config
docker-compose -p techwokx up -d

# Wait for services to be ready
echo ""
echo "Waiting for services to initialize..."
sleep 10

# Health checks
echo ""
echo "=========================================="
echo "Service Status"
echo "=========================================="

echo -n "Caddy (Reverse Proxy)... "
if docker ps | grep -q techwokx-caddy; then
    echo "✓ Running"
else
    echo "✗ Failed"
fi

echo -n "API Gateway (Port 3000)... "
if docker ps | grep -q techwokx-gateway; then
    echo "✓ Running"
else
    echo "✗ Failed"
fi

echo -n "Marketing Dashboard (Port 3001)... "
if docker ps | grep -q techwokx-marketing; then
    echo "✓ Running"
else
    echo "✗ Failed"
fi

echo ""
echo "=========================================="
echo "Deployment Complete"
echo "=========================================="
echo ""
echo "Available endpoints:"
echo "  Health Check:     https://api.techwokx.online/health"
echo "  Marketing API:    https://api.techwokx.online/marketing/*"
echo "  Campaigns:        https://api.techwokx.online/marketing/api/campaigns"
echo "  Dashboard:        https://api.techwokx.online/marketing/api/dashboard/summary"
echo "  Top Ads:          https://api.techwokx.online/marketing/api/ads/top-performers"
echo ""
echo "View logs:"
echo "  docker-compose -p techwokx logs -f marketing"
echo ""
echo "Stop services:"
echo "  docker-compose -p techwokx down"
echo ""
echo "Restart services:"
echo "  docker-compose -p techwokx restart"
echo ""
