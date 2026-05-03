# Prompt Director / 提示词导演工作台

一个面向 AI 图像生成的 **结构化 Prompt 编辑器**。通过模块化填写、多模型适配、质量评分、冲突检测，生成适合 GPT Image / Midjourney / Stable Diffusion / Flux 的高质量提示词。

Vue 3 + Vite + TailwindCSS · 纯前端 · 无后端 · 隐私友好 · GitHub Pages Ready

## 🎬 在线体验

[Prompt Director Live Demo](https://w0nderful666.github.io/prompt-market/)

所有数据保存在浏览器 localStorage，不上传服务器。

## ✨ 核心功能

### 结构化编辑器
- 17 个独立模块卡片：模型/用途、主体、场景、构图、表情、妆容、发型、身体、服装、光线、镜头、背景、氛围、Caption、必须保留、避免项、比例
- 每个模块支持：输入、锁定、一键清空、预设短语插入
- 50+ 内置预设（场景/质感/构图/光线/氛围）

### 多模型适配器
- **GPT Image** — 自然语言导演式描述
- **Midjourney** — 自动追加 `--ar` `--style raw` `--no` 参数
- **Stable Diffusion** — 拆分 positive/negative prompt
- **Flux** — 简洁高密度英文描述
- **通用中文 / 通用英文** — 结构化输出

### 专业工具
- **冲突检测** — 检测分辨率、场景、妆容、构图、风格、光线、氛围、设备冲突，给出修复建议
- **Token Cleaner** — 一键清理重复词、空模块、多余标点、堆叠形容词、中英文空格
- **质量评分** — 10 维度 0-100 分评估，附带优点和改进建议
- **仿写拆解器** — 粘贴提示词自动拆解为结构化模块
- **变体生成** — 11 种风格方向一键生成

### Prompt Gallery
内置 6 个完整可用的高级示例：
- 🛁 浴室镜自拍（低清手机质感）
- 🚇 地铁站 CCD 随拍（老式数码相机）
- 🌙 夜晚便利店门口（冷光随手拍）
- 🌧️ 雨天车窗电影感（胶片情绪人像）
- 🧴 高级产品图（电商质感）
- 💻 GitHub 项目封面图（技术感）

### 分享与导出
- 分享链接 — 配置压缩到 URL hash，不上传服务器
- 配方卡片 — 保存/加载/复制/导出提示词方案
- JSON 导入导出
- 最近 10 条历史记录
- 一键复制 / 下载 .txt

### UI 与体验
- 首页 Hero 区域 + 徽章（Local First / No Backend / Privacy Friendly / GitHub Pages Ready）
- 深色模式切换
- 右侧输出区 sticky 固定
- 移动端响应式布局
- 所有交互有动画反馈

## 🚀 本地运行

```bash
git clone https://github.com/w0nderful666/prompt-market.git
cd prompt-market
npm install
npm run dev          # 开发服务器
npm run build        # 生产构建
npm run self-test    # 运行自测 (143项)
npm run preflight    # 构建 + 自测
```

## 📦 部署

### GitHub Pages（自动）
推送 `main` 分支后，GitHub Actions 自动构建部署。

### Vercel / Netlify
导入仓库，构建命令 `npm run build`，输出目录 `dist`。

## 🔒 隐私说明

- 所有数据本地处理，不上传任何服务器
- 不调用外部 AI API，不收集用户数据
- 纯前端静态页面，可完全离线使用

## 📋 版本记录

见 [RELEASE_NOTES.md](./RELEASE_NOTES.md)

## 📄 License

MIT
