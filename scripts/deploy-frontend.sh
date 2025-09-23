#!/bin/bash

# KCISLK 課表查詢系統 - Frontend Deployment Script
# 前端部署腳本

set -e

# Configuration
FRONTEND_DIR="/Users/chenzehong/Desktop/kcislk-timetable/frontend"
BUILD_DIR="$FRONTEND_DIR/dist"
DEPLOY_TARGET="/var/www/kcislk-timetable"
NGINX_CONFIG="/etc/nginx/sites-available/kcislk-timetable"
BACKUP_DIR="/var/backups/kcislk-timetable/$(date +%Y%m%d_%H%M%S)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 KCISLK 課表查詢系統 - Frontend Deployment${NC}"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "$FRONTEND_DIR/package.json" ]; then
    echo -e "${RED}❌ Error: Frontend directory not found or invalid${NC}"
    exit 1
fi

# Navigate to frontend directory
cd "$FRONTEND_DIR"

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm ci --only=production

# Run linting and type checking
echo -e "${YELLOW}🔍 Running linting and type checking...${NC}"
npm run lint
npm run typecheck

# Build the application
echo -e "${YELLOW}🏗️ Building application for production...${NC}"
npm run build:production

# Check if build was successful
if [ ! -d "$BUILD_DIR" ]; then
    echo -e "${RED}❌ Error: Build failed - dist directory not found${NC}"
    exit 1
fi

# Create backup of current deployment (if exists)
if [ -d "$DEPLOY_TARGET" ]; then
    echo -e "${YELLOW}💾 Creating backup...${NC}"
    sudo mkdir -p "$BACKUP_DIR"
    sudo cp -r "$DEPLOY_TARGET" "$BACKUP_DIR/"
fi

# Deploy the built files
echo -e "${YELLOW}🚀 Deploying to $DEPLOY_TARGET...${NC}"
sudo mkdir -p "$DEPLOY_TARGET"
sudo cp -r "$BUILD_DIR/"* "$DEPLOY_TARGET/"

# Set proper permissions
sudo chown -R www-data:www-data "$DEPLOY_TARGET"
sudo chmod -R 755 "$DEPLOY_TARGET"

# Test nginx configuration
echo -e "${YELLOW}🔧 Testing nginx configuration...${NC}"
sudo nginx -t

# Reload nginx
echo -e "${YELLOW}🔄 Reloading nginx...${NC}"
sudo systemctl reload nginx

echo -e "${GREEN}✅ Frontend deployment completed successfully!${NC}"
echo "📊 Build size:"
du -sh "$BUILD_DIR"

echo ""
echo "🌐 Access the application at: http://your-domain.com"
echo "📝 Logs: /var/log/nginx/access.log"
echo "🔧 Config: $NGINX_CONFIG"