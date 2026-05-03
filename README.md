# Prompt Director / 提示词导演工作台

一个面向 AI 图像生成的 **结构化 Prompt 编辑器**。通过模块化填写、预设选择、仿写拆解、质量评分，生成适合 GPT Image / Midjourney / Stable Diffusion 的高质量提示词。

项目使用 Vue 3 + Vite + TailwindCSS，纯前端静态页面，不依赖后端，适合部署到 GitHub Pages、Vercel、Netlify 或任意静态服务器。

## 🎬 在线体验

[Prompt Director Live Demo](https://w0nderful666.github.io/prompt-market/)

所有数据保存在浏览器 localStorage，不会上传服务器。

## ✨ 功能特点

### 🎹 经典模式（原有功能）
- 分类选择提示词关键词
- 一键生成自然语言人像 Prompt
- 关键词模式、自然语言模式、增强描述模式、模板模式
- 正向提示词和负面提示词合并输出
- 支持预设方案、真实照片随机
- 支持保存方案到 localStorage
- 支持导入、导出自定义词库

### 🎬 导演模式（新增功能）
- **结构化提示词编辑器** — 17 个独立模块卡片，覆盖主体、场景、构图、光线、妆发、服装等全部维度
- **5 种输出模式** — 中文简短版、中文标准版、中文导演版、英文标准版、负面提示词
- **必须保留 / 避免项** — 内置 15+ 常用避免项标签，一键添加
- **场景预设库** — 场景、摄影质感、构图、光线、氛围共 50+ 预设
- **提示词质量评分** — 10 个维度 0-100 分评估，附带优点和建议
- **仿写拆解器** — 粘贴提示词自动拆解为结构化模块
- **变体生成** — 11 种风格方向一键生成（更真实/更电影/更适合GPT等）
- **导入导出** — JSON 导入导出、历史记录、收藏、方案保存
- **示例数据** — 内置 3 个高质量示例，打开即可测试
- **深色模式** — 支持亮色/暗色主题切换
- **移动端适配** — 响应式布局，手机可用

## 🚀 本地运行

```bash
# 克隆仓库
git clone https://github.com/w0nderful666/prompt-market.git
cd prompt-market

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 运行自测
npm run self-test
```

## 📦 部署到 GitHub Pages

### 方式一：GitHub Actions（推荐）

1. 在仓库 Settings → Pages 中选择 "GitHub Actions" 作为 Source
2. 推送代码后会自动构建和部署

### 方式二：手动部署

```bash
npm run build
# 将 dist/ 目录推送到 gh-pages 分支
```

### 方式三：Vercel / Netlify

直接导入仓库，构建命令填 `npm run build`，输出目录填 `dist`。

## 🎯 使用示例

### 导演模式工作流

1. 点击顶部 "🎬 导演模式" 切换
2. 点击 "📋 加载示例" 快速体验
3. 在各模块卡片中填写或选择预设短语
4. 点击 "🚀 生成全部输出" 查看 5 种格式
5. 点击 "📊 评分" 查看提示词质量
6. 点击 "🎲 生成变体" 获取不同风格方向
7. 保存方案、导出 JSON 或复制文本

### 经典模式工作流

1. 在分类标签中选择关键词类别
2. 点击关键词添加到选择
3. 点击 "生成" 按钮生成提示词
4. 一键复制使用

## 🔒 隐私说明

- **所有数据本地处理**，不上传任何服务器
- 用户导入的词库、保存的方案和编辑内容只保存在浏览器 `localStorage`
- 不调用外部 AI API，不收集用户数据
- 纯前端静态页面，可完全离线使用

## 🎨 适合场景

- AI 人像绘图提示词生成
- GPT Image / Midjourney / Stable Diffusion 提示词优化
- 摄影风格参考和创意探索
- Prompt 工程师工作流

## 📋 版本记录

见 [RELEASE_NOTES.md](./RELEASE_NOTES.md)

## 📄 License

MIT
