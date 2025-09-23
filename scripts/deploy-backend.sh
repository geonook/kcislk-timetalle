#!/bin/bash

# KCISLK 課表查詢系統 - Backend Deployment Script
# 後端部署腳本

set -e

# Configuration
BACKEND_DIR="/Users/chenzehong/Desktop/kcislk-timetable/timetable_api"
DEPLOY_TARGET="/opt/kcislk-timetable/backend"
PM2_CONFIG="/opt/kcislk-timetable/ecosystem.config.js"
VENV_DIR="$DEPLOY_TARGET/venv"
BACKUP_DIR="/var/backups/kcislk-timetable/backend_$(date +%Y%m%d_%H%M%S)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 KCISLK 課表查詢系統 - Backend Deployment${NC}"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "$BACKEND_DIR/requirements.txt" ]; then
    echo -e "${RED}❌ Error: Backend directory not found or invalid${NC}"
    exit 1
fi

# Create backup of current deployment (if exists)
if [ -d "$DEPLOY_TARGET" ]; then
    echo -e "${YELLOW}💾 Creating backup...${NC}"
    sudo mkdir -p "$BACKUP_DIR"
    sudo cp -r "$DEPLOY_TARGET" "$BACKUP_DIR/"
fi

# Create deployment directory
echo -e "${YELLOW}📁 Setting up deployment directory...${NC}"
sudo mkdir -p "$DEPLOY_TARGET"

# Copy application files
echo -e "${YELLOW}📋 Copying application files...${NC}"
sudo cp -r "$BACKEND_DIR/"* "$DEPLOY_TARGET/"

# Set proper ownership
sudo chown -R $USER:$USER "$DEPLOY_TARGET"

# Navigate to deployment directory
cd "$DEPLOY_TARGET"

# Create virtual environment if it doesn't exist
if [ ! -d "$VENV_DIR" ]; then
    echo -e "${YELLOW}🐍 Creating virtual environment...${NC}"
    python3 -m venv "$VENV_DIR"
fi

# Activate virtual environment
source "$VENV_DIR/bin/activate"

# Upgrade pip
echo -e "${YELLOW}⬆️ Upgrading pip...${NC}"
pip install --upgrade pip

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
pip install -r requirements.txt

# Run tests (if available)
if [ -d "tests" ]; then
    echo -e "${YELLOW}🧪 Running tests...${NC}"
    python -m pytest tests/ || echo -e "${YELLOW}⚠️ Tests failed but continuing deployment${NC}"
fi

# Set proper permissions
sudo chown -R www-data:www-data "$DEPLOY_TARGET"
sudo chmod +x "$DEPLOY_TARGET/run_server.py"

# Stop existing PM2 process
echo -e "${YELLOW}🛑 Stopping existing application...${NC}"
pm2 stop kcislk-api || echo "No existing process found"

# Start the application with PM2
echo -e "${YELLOW}🚀 Starting application with PM2...${NC}"
pm2 start "$PM2_CONFIG"

# Save PM2 configuration
pm2 save

echo -e "${GREEN}✅ Backend deployment completed successfully!${NC}"
echo ""
echo "🔧 Management commands:"
echo "  pm2 status           - Check application status"
echo "  pm2 logs kcislk-api  - View application logs"
echo "  pm2 restart kcislk-api - Restart application"
echo "  pm2 monit            - Monitor application"