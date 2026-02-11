#!/bin/bash

# Shadow Protocol 部署脚本
# 用于服务器上自动部署前后端

set -e  # 遇到错误立即退出

echo "🚀 开始部署 Shadow Protocol..."

# 1. 检查环境
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装"
    exit 1
fi

if ! command -v pm2 &> /dev/null; then
    echo "📦 安装 PM2..."
    npm install -g pm2
fi

# 2. 安装依赖
echo "📦 安装依赖..."
npm install --production=false

# 3. 构建前端
echo "🔨 构建前端..."
npm run build

# 4. 停止旧的后端服务（如果存在）
echo "⏹️  停止旧服务..."
pm2 delete shadow-backend 2>/dev/null || true

# 5. 启动后端服务
echo "🚀 启动后端服务..."
pm2 start server/index.js --name shadow-backend --env production

# 6. 保存 PM2 配置
pm2 save

# 7. 检查服务状态
echo "✅ 检查服务状态..."
pm2 list

echo ""
echo "✅ 部署完成！"
echo "📍 前端路径: dist/"
echo "📍 后端服务: http://localhost:3001"
echo "📍 查看日志: pm2 logs shadow-backend"
