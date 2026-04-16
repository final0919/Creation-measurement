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
├── fly.toml            # Fly.io 部署配置
├── package.json        # 项目依赖
└── vite.config.ts      # Vite 配置
```

## 技术栈

- **前端**: React + TypeScript + Vite + Tailwind CSS
- **后端**: Express + Node.js
- **数据存储**: 本地文件系统（Fly.io 持久化卷）
- **部署**: Fly.io (免费)

## 开发

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run preview` - 预览生产构建

## 许可证

MIT
