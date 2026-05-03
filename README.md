# Prompt Director Studio / 导演级 AI 图像提示词工作台

> 从一句灵感，到一份可控的导演级 AI 图像提示词。

一个面向 AI 图像生成的 **结构化 Prompt 编辑器**。通过模块化填写、多模型适配、质量评分、冲突检测，生成适合 GPT Image / Midjourney / Stable Diffusion / Flux 的高质量提示词。

**v3.0.0** · Vue 3 + Vite + TailwindCSS · 纯前端 · 无后端 · 隐私友好 · GitHub Pages Ready

## 🎬 核心定位

Prompt Director Studio 不只是关键词选择器——它是一个**提示词导演工作台**。你可以像导演一样，逐模块构思画面的每个维度，然后一键生成适配不同 AI 模型的高质量提示词。

## ✨ 核心功能

### 📊 Dashboard 总览
- 项目概览与快速入口
- 统计数据：模块数、适配器数、示例数
- 快速跳转到各功能区

### 🎬 Director 结构化编辑器
- 18 个独立模块，分为 5 个可折叠分组：
  - **Foundation 基础设定**: 模型、主体、场景、比例
  - **Visual Direction 视觉导演**: 构图、光线、镜头、景深
  - **Subject Details 主体细节**: 表情、脸部、发型、身体、服装
  - **Atmosphere 氛围叙事**: 背景、氛围、Caption
  - **Control 控制项**: 必须保留、避免项
- 每个模块支持：编辑、清空、锁定、预设插入、字符计数
- 50+ 内置预设（场景/质感/构图/光线/氛围）
- 配方保存/加载/导出

### 🤖 6 种模型适配器
- **GPT Image** — 自然语言导演式描述，包含 Must Keep / Avoid / Aspect Ratio
- **Midjourney** — 英文短语 + 自动追加 `--ar` `--style raw` `--no` 参数
- **Stable Diffusion** — 拆分 Positive Prompt / Negative Prompt
- **Flux** — 简洁高密度英文描述，不过度打标签
- **通用中文** — 结构化中文输出
- **通用英文** — 结构化英文输出
- 每种输出带复制按钮、字符计数、比例/避免项标记

### 🔍 Deconstruct 拆解器
- 粘贴一段长提示词，前端规则解析自动提取模块
- 解析后一键填入 Director 编辑器

### 🖼️ Showcase 展示库
- 12 个内置高级示例，每个填充 12+ 模块
- 浴室兔耳镜自拍 / 夜晚便利店冷光半身照 / 地铁站 CCD 快照 / 雨天车窗电影感肖像 / GitHub 项目封面图 / 高级电商产品图 / 个人头像写实摄影 / 暗黑赛博街头写真 / 极简 App 图标概念 / AI 工具官网 Hero 图 / 复古胶片校园走廊 / 赛博朋克城市壁纸
- 一键加载到 Director / 一键复制 GPT Image 输出 / 一键加入 Prompt Pack

### 📸 Snapshots 快照
- 保存和恢复当前完整提示词状态
- 每个快照包含：标题、时间、模块内容、模型、评分、安全等级、冲突数、比例、备注
- 功能：保存 / 列表 / 恢复 / 删除 / 复制 GPT Image 输出 / 导出 JSON / 导入 JSON
- 默认最多 20 条，超出提示清理

### 📦 Prompt Packs 模板包
- 把多条提示词配方打包管理
- 功能：创建 Pack / 编辑名称描述标签 / 添加当前提示词 / 从 Showcase 添加 / 加载提示词 / 删除提示词 / 导出 JSON / 导入 JSON / 删除 Pack
- 内置 3 个官方 Pack：Realistic Portrait Starter Pack / Creator Utility Pack / Dark Street Style Pack
- 每个官方 Pack 至少 3 条 prompt，每条 prompt 至少 12 个模块

### 🧪 Lab 实验室
- **变体生成** — 11 种风格方向一键生成
- **质量评分** — 16 维度 0-100 分评估，自动更新
- **Token 清理** — 一键清理重复词、空模块、多余标点
- **Prompt Polisher** — 15 种润色模式，预览/确认/撤销
- **Prompt Diff** — Token 级对比，历史记录，快速发送
- **Safety Hints** — 9 类安全检查，快速修复按钮

### ⚙️ Settings 设置
- 深色模式切换
- 本地存储占用查看
- Export All Data — 导出全部本地数据为 JSON
- Import All Data — 导入全部数据（支持合并 / 覆盖模式）
- 词库导入/导出
- 清空历史 / 清空 Diff / 清空 Snapshots / 清空用户 Packs
- 恢复默认设置
- 清空所有数据
- QuotaExceededError 处理 — 存储满时友好提示

### 其他功能
- **Prompt Score** — 16 维度 0-100 分评估，自动更新，涵盖主体/场景/构图/光线/质感/姿势/服装/背景/氛围/Must Keep/Avoid/Failure Guard/模型适配/比例/冲突风险/内容风险
- **Conflict Detector** — 19+ 冲突规则，6 大类（质量/场景/构图/风格/氛围/主体），风险等级标签，一键移除冲突词
- **Safety Hints** — 9 类安全检查（年龄模糊/未成年/公众人物/版权/偷拍/过度性化/文字风险/医疗法律/隐私），快速修复按钮，不阻断编辑
- **Prompt Polisher** — 15 种润色模式（更自然/更专业/GPT Image/Midjourney/SD/Flux/更短/更详细/更写实/更电影感/更低清/更生活化/更高级产品图/更头像/GitHub 封面），预览/确认/撤销
- **Prompt Diff** — Token 级文本对比，新增/移除/保留统计，字符变化和 Token 估计，localStorage 历史记录（最多 20 条），快速发送到原始/优化区
- 所有分析本地完成，不上传服务器
- 深色模式 — 全局亮色/暗色主题
- 移动端响应式 — 所有页面自适应
- 本地持久化 — 编辑状态、配方、设置全部保存在 localStorage
- Footer 显示版本、构建日期、隐私声明

## 🏗️ Product Hardening (v3.0.0 Round 3)

本轮产品硬化和收口，不新增大功能，聚焦工程质量：

- **清理遗留代码** — 删除 4 个未使用组件（DirectorHistory / PromptEditor / PromptGallery / TopBar），移除 Classic 旧模式及全部相关 UI
- **拆分 App.vue** — 提取 AppHeader / AppFooter / AppNavigation / DashboardSection / LabSection / SettingsSection，App.vue 行数显著下降
- **新增 Snapshots** — 快照保存/恢复/删除/导入/导出，完整状态持久化
- **新增 Prompt Packs** — 模板包管理，3 个内置官方 Pack，导入导出
- **统一导入导出** — Export All Data / Import All Data，支持合并/覆盖导入，QuotaExceededError 处理
- **Showcase 补强** — 从 8 个示例扩展到 12 个
- **自测增强** — 从 109 项扩展到 153 项，覆盖所有新功能
- **组件架构规范化** — layout / sections 目录分离，职责清晰

## 🚀 本地运行

```bash
git clone https://github.com/w0nderful666/prompt-market.git
cd prompt-market
npm install
npm run dev          # 开发服务器 http://localhost:3000
npm run build        # 生产构建
npm run self-test    # 运行自测
npm run preflight    # 构建 + 自测
```

## 📦 部署

### GitHub Pages（自动）
推送 `main` 分支后，GitHub Actions 自动构建部署。

### Vercel / Netlify
导入仓库，构建命令 `npm run build`，输出目录 `dist`。

### 任意静态服务器
`dist` 目录可直接部署到任何静态文件服务器。

## 🔒 隐私说明

- **所有数据保存在浏览器 localStorage**，不上传任何服务器
- 不调用外部 AI API，不收集用户数据
- 不使用 Cookie，不进行用户追踪
- 纯前端静态页面，可完全离线使用
- 代码完全开源，可自行审计

## 💾 localStorage 数据治理

所有用户数据存储在浏览器 localStorage 中，key 统一以 `prompt_market_` 前缀命名：

| Key | 用途 |
|-----|------|
| `prompt_market_dark_mode` | 深色模式偏好 |
| `prompt_market_active_section` | 当前所在页面 |
| `prompt_market_director_current` | Director 当前编辑内容 |
| `prompt_market_director_schemes` | 保存的配方列表 |
| `prompt_market_snapshots` | 快照列表（最多 20 条） |
| `prompt_market_packs` | Prompt Packs 列表 |
| `prompt_market_diff_history` | Diff 对比历史 |
| `prompt_market_schemes` | Classic 方案（兼容） |
| `prompt_market_custom_prompts` | 自定义词库 |

- Settings 页面可查看当前存储占用
- Export All Data 可一键备份全部数据
- Import All Data 支持合并/覆盖恢复
- 写入时自动处理 QuotaExceededError

## 📋 版本信息

- **当前版本**: v3.0.0
- **构建日期**: 2026-05-03
- **技术栈**: Vue 3 + Vite + TailwindCSS
- **详细日志**: [RELEASE_NOTES.md](./RELEASE_NOTES.md)

## 📄 License

MIT
