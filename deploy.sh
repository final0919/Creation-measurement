#!/bin/bash

# 阿里云轻量应用服务器部署脚本
# 使用方法: chmod +x deploy.sh && ./deploy.sh

set -e

echo "=========================================="
echo "  开始部署到阿里云轻量应用服务器"
echo "=========================================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 配置变量
APP_NAME="zaowuce"
APP_DIR="/var/www/$APP_NAME"
NGINX_CONF="/etc/nginx/sites-available/$APP_NAME"
NGINX_ENABLED="/etc/nginx/sites-enabled/$APP_NAME"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-admin123}"

echo -e "${YELLOW}[1/7] 更新系统包...${NC}"
sudo apt-get update && sudo apt-get upgrade -y

echo -e "${YELLOW}[2/7] 安装 Node.js 和 Nginx...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs nginx
sudo apt-get install -y build-essential

echo -e "${YELLOW}[3/7] 安装 PM2...${NC}"
sudo npm install -g pm2

echo -e "${YELLOW}[4/7] 创建项目目录...${NC}"
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

echo -e "${YELLOW}[5/7] 复制项目文件...${NC}"
cp -r . $APP_DIR/
cd $APP_DIR

echo -e "${YELLOW}[6/7] 安装依赖并构建...${NC}"
npm install
npm run build

echo -e "${YELLOW}[7/7] 配置 Nginx...${NC}"
# 复制 Nginx 配置
sudo cp nginx.conf $NGINX_CONF

# 创建符号链接
sudo ln -sf $NGINX_CONF $NGINX_ENABLED

# 测试 Nginx 配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx

# 设置环境变量
export ADMIN_PASSWORD=$ADMIN_PASSWORD

echo -e "${YELLOW}[8/8] 启动应用...${NC}"
# 停止旧的 PM2 进程
pm2 delete $APP_NAME 2>/dev/null || true

# 启动新的应用
ADMIN_PASSWORD=$ADMIN_PASSWORD pm2 start server.js --name $APP_NAME

# 保存 PM2 配置
pm2 save

# 设置 PM2 开机自启
pm2 startup | tail -n 1 | sudo -E bash -

echo ""
echo -e "${GREEN}=========================================="
echo "  部署成功！"
echo "==========================================${NC}"
echo ""
echo "应用信息:"
echo "  - 应用目录: $APP_DIR"
echo "  - Nginx 配置: $NGINX_CONF"
echo "  - PM2 状态: pm2 status"
echo "  - PM2 日志: pm2 logs $APP_NAME"
echo ""
echo "管理命令:"
echo "  - 查看状态: pm2 status"
echo "  - 查看日志: pm2 logs $APP_NAME"
echo "  - 重启应用: pm2 restart $APP_NAME"
echo "  - 停止应用: pm2 stop $APP_NAME"
echo "  - Nginx 重启: sudo systemctl restart nginx"
echo ""
