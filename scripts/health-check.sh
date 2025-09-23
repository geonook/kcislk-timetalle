#!/bin/bash

# KCISLK 課表查詢系統 - Health Check Script
# Docker container health check for frontend nginx

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
HEALTH_CHECK_URL="http://localhost/health"
FRONTEND_URL="http://localhost/"
TIMEOUT=10

echo "Performing health check for KCISLK frontend container..."

# Check if nginx is running
if ! pgrep nginx > /dev/null; then
    echo -e "${RED}[ERROR] Nginx is not running${NC}"
    exit 1
fi

echo -e "${GREEN}[OK] Nginx is running${NC}"

# Check if we can reach the frontend
if curl -f -s --max-time $TIMEOUT "$FRONTEND_URL" > /dev/null; then
    echo -e "${GREEN}[OK] Frontend is accessible${NC}"
else
    echo -e "${RED}[ERROR] Frontend is not accessible${NC}"
    exit 1
fi

# Check if we can reach the health endpoint (proxy to backend)
if curl -f -s --max-time $TIMEOUT "$HEALTH_CHECK_URL" > /dev/null; then
    echo -e "${GREEN}[OK] Backend health check passed${NC}"
else
    echo -e "${YELLOW}[WARN] Backend health check failed (backend may not be ready)${NC}"
    # Don't exit with error as frontend can still serve static files
fi

echo -e "${GREEN}[SUCCESS] Frontend container health check passed${NC}"
exit 0