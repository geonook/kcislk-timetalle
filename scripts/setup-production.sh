#!/bin/bash

# KCISLK 課表查詢系統 - Production Setup Script
# 生產環境初始化腳本

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 KCISLK 課表查詢系統 - Production Setup${NC}"
echo "=================================================="

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}❌ Please run this script as root (sudo ./setup-production.sh)${NC}"
    exit 1
fi

# Update system packages
echo -e "${YELLOW}📦 Updating system packages...${NC}"
apt update && apt upgrade -y

# Install required packages
echo -e "${YELLOW}📦 Installing required packages...${NC}"
apt install -y \
    nginx \
    python3 \
    python3-pip \
    python3-venv \
    nodejs \
    npm \
    sqlite3 \
    git \
    curl \
    supervisor \
    ufw

# Install PM2 globally
echo -e "${YELLOW}🔧 Installing PM2...${NC}"
npm install -g pm2

# Create application user
echo -e "${YELLOW}👤 Creating application user...${NC}"
if ! id "kcislk" &>/dev/null; then
    useradd -r -m -s /bin/bash kcislk
    usermod -aG www-data kcislk
fi

# Create necessary directories
echo -e "${YELLOW}📁 Creating application directories...${NC}"
mkdir -p /opt/kcislk-timetable
mkdir -p /var/www/kcislk-timetable
mkdir -p /var/log/kcislk-timetable
mkdir -p /var/backups/kcislk-timetable

# Set proper ownership
chown -R kcislk:kcislk /opt/kcislk-timetable
chown -R www-data:www-data /var/www/kcislk-timetable
chown -R kcislk:kcislk /var/log/kcislk-timetable

# Configure firewall
echo -e "${YELLOW}🔒 Configuring firewall...${NC}"
ufw allow ssh
ufw allow 'Nginx Full'
ufw --force enable

# Enable and start services
echo -e "${YELLOW}🔧 Enabling services...${NC}"
systemctl enable nginx
systemctl start nginx

# Create systemd service for PM2
echo -e "${YELLOW}⚙️ Setting up PM2 service...${NC}"
cat > /etc/systemd/system/pm2-kcislk.service << 'EOF'
[Unit]
Description=PM2 process manager for KCISLK
After=network.target

[Service]
Type=forking
User=kcislk
LimitNOFILE=infinity
LimitNPROC=infinity
LimitCORE=infinity
Environment=PATH=/usr/local/bin:/usr/bin:/bin
Environment=PM2_HOME=/home/kcislk/.pm2
PIDFile=/home/kcislk/.pm2/pm2.pid
Restart=on-failure

ExecStart=/usr/local/bin/pm2 resurrect
ExecReload=/usr/local/bin/pm2 reload all
ExecStop=/usr/local/bin/pm2 kill

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable pm2-kcislk

# Create log rotation
echo -e "${YELLOW}📝 Setting up log rotation...${NC}"
cat > /etc/logrotate.d/kcislk-timetable << 'EOF'
/var/log/kcislk-timetable/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 0644 kcislk kcislk
    postrotate
        pm2 reloadLogs
    endscript
}
EOF

echo -e "${GREEN}✅ Production environment setup completed!${NC}"
echo ""
echo -e "${BLUE}📋 Next steps:${NC}"
echo "1. Deploy your application using the deployment scripts"
echo "2. Configure nginx with your domain"
echo "3. Set up SSL certificates (Let's Encrypt recommended)"
echo "4. Configure backups"
echo ""
echo -e "${BLUE}🔧 Useful commands:${NC}"
echo "  systemctl status nginx        - Check nginx status"
echo "  systemctl status pm2-kcislk   - Check PM2 service status"
echo "  pm2 status                    - Check application status"
echo "  journalctl -u pm2-kcislk -f   - View PM2 service logs"