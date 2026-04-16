<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 造物测

一个展示创意作品和设计灵感的平台。

## 本地运行

**前置条件:** Node.js

1. 安装依赖:
   ```bash
   npm install
   ```

2. 运行应用:
   ```bash
   npm run dev
   ```

应用会自动在 http://localhost:8080 启动。

## 部署到 Fly.io ⭐ 推荐

Fly.io 是一个不会休眠的平台，有免费额度，非常适合部署全栈应用。

### 步骤 1: 安装 Fly CLI

**Mac 用户:**
```bash
brew install flyctl
```

**Linux 用户:**
```bash
curl -L https://fly.io/install.sh | sh
```

**Windows 用户:**
```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

### 步骤 2: 登录 Fly.io

```bash
flyctl auth signup  # 如果没有账号
flyctl auth login
```

### 步骤 3: 部署应用

确保你在项目根目录（有 fly.toml 文件的目录）:

```bash
# 1. 初始化 Fly 应用（会自动检测 fly.toml）
flyctl launch

# 2. 部署到 Fly.io
flyctl deploy
```

首次部署时，Fly CLI 会询问一些配置：
- 选择区域：推荐 `hkg` (香港) 或 `sin` (新加坡)
- 是否需要数据库：选择 No

### 步骤 4: 设置环境变量

```bash
flyctl secrets set ADMIN_PASSWORD=your_secure_password
```

### 步骤 5: 查看应用状态

```bash
# 查看应用状态
flyctl status

# 查看应用日志
flyctl logs

# 打开应用
flyctl open
```

### 注意事项

- ✅ **不会休眠**: 应用会一直运行
- ✅ **数据持久化**: 使用永久存储卷，重启不丢数据
- ✅ **全球部署**: 可以选择离用户最近的区域
- ✅ **免费额度**: 每月有一定的免费 CPU/内存使用量

部署完成后，你的应用地址会是: `https://zaowuce.fly.dev`

### 数据持久化说明

Fly.io 配置了永久存储卷（在 fly.toml 中配置），数据文件会存储在 `/data` 目录，即使应用重启或重新部署，数据也不会丢失。

## 部署到阿里云轻量应用服务器 ⭐ 最划算

阿里云轻量应用服务器是国内性价比最高的部署方案，**年费仅需 38-68 元**，且不需要绑定信用卡。

### 为什么选择阿里云轻量？

- 💰 **超便宜**：38-68元/年（仅相当于 3.2-5.7元/月）
- 🚀 **性能好**：2核2G 足够运行全栈应用
- ⚡ **速度快**：200M 峰值带宽，不限流量
- 🌏 **国内访问快**：国内用户访问延迟低
- 💳 **支付方便**：支持支付宝/微信，不需要绑定信用卡
- 🔄 **不休眠**：24 小时在线运行

### 购买步骤

1. 登录 [阿里云控制台](https://swas.console.aliyun.com/)
2. 点击"购买服务器"
3. 选择配置：
   - **服务器类型**：轻量应用服务器
   - **镜像**：Ubuntu 20.04/22.04
   - **配置**：2核2G
   - **套餐**：68元/年（38元为秒杀价，看运气）
   - **地域**：香港（免备案）或北京/上海/杭州（需要备案）
4. 点击"立即购买"
5. 支付完成后，等待 1-3 分钟服务器创建完成

### 部署步骤

#### 1. 连接到服务器

在阿里云控制台找到你的服务器 IP，然后 SSH 连接：

```bash
# 使用 root 用户连接
ssh root@你的服务器IP

# 或使用阿里云提供的连接方式
```

#### 2. 上传项目文件

**方法 A：使用 scp 上传**
```bash
# 在本地终端运行
scp -r "/Users/final/Desktop/游戏软件/造物测-(zaowuce)" root@你的服务器IP:/root/
```

**方法 B：使用 Git 克隆**
```bash
# 在服务器上运行
git clone https://github.com/final0919/Creation-measurement.git
cd Creation-measurement
```

#### 3. 运行部署脚本

```bash
# 进入项目目录
cd /root/zaowuce

# 给脚本添加执行权限
chmod +x deploy.sh

# 运行部署脚本
./deploy.sh
```

部署脚本会自动完成以下操作：
- ✅ 安装 Node.js、Nginx、PM2
- ✅ 配置 Nginx 反向代理
- ✅ 安装项目依赖
- ✅ 构建前端
- ✅ 启动后端服务
- ✅ 配置开机自启

#### 4. 设置管理员密码（可选）

如果需要修改管理员密码，编辑 `/var/www/zaowuce/ecosystem.config.js`：

```bash
sudo vi /var/www/zaowuce/ecosystem.config.js

# 在 env 中添加
env: {
  NODE_ENV: 'production',
  PORT: 8080,
  ADMIN_PASSWORD: '你的密码'
}

# 重启应用
pm2 restart zaowuce
```

#### 5. 访问应用

在浏览器中输入你的服务器 IP 地址即可访问应用！

### 常用管理命令

```bash
# 查看 PM2 状态
pm2 status

# 查看应用日志
pm2 logs zaowuce

# 重启应用
pm2 restart zaowuce

# 停止应用
pm2 stop zaowuce

# 重启 Nginx
sudo systemctl restart nginx

# 查看 Nginx 状态
sudo systemctl status nginx
```

### 更新部署

当你的代码有更新时：

```bash
# 1. 拉取最新代码
cd /root/zaowuce
git pull

# 2. 重新部署
./deploy.sh
```

### 注意事项

- ⚠️ **备案**：如果选择国内地域（北京/上海/杭州），需要进行 ICP 备案；选择香港地域可免备案
- 📁 **数据存储**：数据存储在 `/var/www/zaowuce/data.json`，定期备份
- 🔒 **安全建议**：
  - 修改默认管理员密码
  - 配置防火墙规则（只开放 80/443 端口）
  - 定期更新系统：`sudo apt update && sudo apt upgrade`

### 成本对比

| 平台 | 年费 | 是否休眠 | 需要信用卡 |
|------|------|----------|-----------|
| **阿里云轻量** | **68元** | **不休眠** | 支付宝/微信 |
| Railway Pro | $60（约420元） | 不休眠 | 需要信用卡 |
| Render 免费版 | 0元 | 休眠 | 需要信用卡 |
| Fly.io | 免费额度 | 不休眠 | 需要信用卡 |

**阿里云是性价比最高的选择！**

## 其他部署选项

### 1. Railway Pro ($5/月)
- 从免费版升级，$5/月
- 不会休眠，最简单的选择

### 2. Oracle Cloud Free Tier
- 永久免费 2个 VPS
- 完全控制，但需要自己配置

### 3. Render (免费但会休眠)
- 适合测试，不适合生产
- 需要配合外部数据库使用

## 项目结构

```
zaowuce/
├── src/
│   ├── components/      # React 组件
│   ├── services/        # API 服务
│   ├── lib/            # 工具函数
│   ├── App.tsx         # 主应用
│   └── main.tsx        # 应用入口
├── server.js           # Express 后端服务器
├── nginx.conf          # Nginx 配置（阿里云部署）
├── ecosystem.config.js  # PM2 配置（阿里云部署）
├── deploy.sh           # 部署脚本（阿里云部署）
├── fly.toml            # Fly.io 部署配置
├── package.json        # 项目依赖
└── vite.config.ts      # Vite 配置
```

## 技术栈

- **前端**: React + TypeScript + Vite + Tailwind CSS
- **后端**: Express + Node.js
- **数据存储**: 本地文件系统
- **Web 服务器**: Nginx（阿里云部署）
- **进程管理**: PM2（阿里云部署）
- **部署**: 阿里云轻量应用服务器（推荐）/ Fly.io

## 开发

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run preview` - 预览生产构建

## 许可证

MIT
