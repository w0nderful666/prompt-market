# Release Notes

## v1.1.0 (2026-05-09)

### Three.js Ambient Showcase Layer

新增轻量 3D 氛围层，探索 Three.js 接入可行性：

#### 新增功能
- **ThreeAmbientLayer 组件** - 首页 Hero 背景层
- **粒子场效果** - 150 个缓慢漂浮粒子 (移动端 80 个)
- **交互支持** - 鼠标移动时轻微视差偏移
- **性能保护**:
  - prefers-reduced-motion 时自动关闭
  - 移动端 (< 768px) 自动降级或关闭
  - document.visibilityState 隐藏时暂停动画
  - renderer 使用 alpha 透明 canvas
  - pointer-events-none 不阻挡 UI 交互

#### 技术实现
- 原生 Three.js (非 @react-three/fiber)
- BufferGeometry + PointsMaterial
- GPU 加速粒子渲染
- 完整 dispose / cleanup 生命周期

#### 依赖更新
- 新增 three 依赖

#### 测试
- build: PASS
- check: PASS
- self-test: 增加 Three.js 相关断言
- preflight: 通过

---

## v1.0.0 (2026-05-08)

### Token Inspector - Design System Workbench

新增完整的设计系统 token 检查器，让用户可以查看、复制、理解当前 UI Kit 的所有设计 token：

#### 新增功能
- **TokenInspector 组件** - ControlPanel Export & Health 区域
- **7 个 Token 分组**:
  1. **Colors** - 19 个颜色 token (background / foreground / primary / secondary / muted / accent / border / destructive / success / warning / info 等)
  2. **Surfaces** - 6 个 surface class (Panel / Card / Toolbar / Input / Code / Container)
  3. **Shape** - 8 个形状 token (radius / shadow / borderStyle / blurStrength / surfaceMaterial / cardStyle / buttonStyle / inputStyle)
  4. **Motion** - 运动 token (motionLevel + 9 个 CSS 变量)
  5. **Typography** - 字体 token (fontScale / density)
  6. **Layout** - 布局 token (layoutStyle / dockStyle / panelChrome / headerHeight / contentShape / iconStyle / experienceStyle)
  7. **Export** - 导出文件名说明

#### 技术实现
- 新增 TokenInspector.tsx 组件
- 使用 tabs 切换不同分组
- 每个 token 行显示名称、css variable、当前值、copy 按钮
- 颜色 token 显示色块预览
- 复用 themes.ts 的 getThemeTokens
- 复用 motion.ts 的 getMotionCSSVariables
- 复用 previewSurfaces.ts 的 surface class 获取函数

#### 版本同步
- package.json version: 1.0.0
- package-lock.json version: 1.0.0

#### 测试
- build: PASS
- check: PASS
- self-test: 140/140
- preflight: 21/21

---

## v0.9.0 (2026-05-08)

### Preset Gallery - 高级预设库

新增一键应用的高级风格预设库：

#### 新增功能
- **PresetGallery 组件** - ControlPanel 中新增折叠区
- **8 套高级预设**:
  1. **Aurora Glass** - 极光玻璃风，适合高级展示页 / OS 首页
  2. **Deep Space** - 深空控制台，适合 dashboard / AI / cyber 工具
  3. **Linux Frost** - Linux 工作站风，适合 OS 项目迁移
  4. **Terminal Pro** - 终端工程师风，适合开发者工具 / 安全控制台
  5. **Cyber Neon** - 赛博霓虹风，适合高级演示和分享截图
  6. **Paper Minimal** - 极简纸张风，适合文章、文档、博客
  7. **Ocean Panel** - 蓝绿色控制台风，适合 SaaS / dashboard
  8. **Warm Studio** - 暖色创作工作台，适合内容工具 / design studio

#### 技术实现
- 新增 PresetGallery.tsx 组件
- 8 个预设加入 STYLE_PRESETS (builder.ts)
- 每个预设包含完整 BuilderConfig 配置
- 卡片包含 gradient strip 预览
- Apply / Applied 状态显示

#### 测试
- self-test: 132/132
- preflight: 21/21

---

## v0.8.0 (2026-05-08)

### Showcase Scene Switcher

将 Live Preview 区域升级为多场景 UI Kit 展示台，支持 7 种真实应用场景预览：

#### 场景
1. **Overview** - 当前 UI Kit 总览，展示颜色、按钮、卡片、输入框、徽章等基础组件
2. **Dashboard** - 仪表盘场景，包含侧边栏、顶部导航、统计卡片、活动列表
3. **Settings** - 设置面板场景，包含设置分组、开关、 segmented controls、保存按钮
4. **Article** - 文章阅读场景，包含标题、摘要、标签、正文、引用块、代码块
5. **Landing** - 产品首页场景，包含 hero、feature cards、CTA、trust badges
6. **Window** - OS 风格窗口场景，包含 window chrome、traffic lights、terminal 内容
7. **Form** - 表单场景，包含 input、select、textarea、checkbox/switch、error text

#### 技术实现
- 新增 ShowcaseSceneSwitcher 组件
- 使用 framer-motion 实现场景切换动画
- 支持 prefers-reduced-motion
- 场景内容使用项目已有 CSS variables

#### 测试
- self-test: 125/125

---

## v0.7.0 (2026-05-08)

### Starter Kit ZIP Export

新增一键下载完整可运行 Starter Kit 的功能：

#### 导出功能
- **downloadStarterKitZip(config)** - 一键生成 ZIP 包
- **generateStarterKitReadme(config)** - 生成 README 说明文档
- 使用 JSZip (轻量级 ~3KB gzipped)

#### ZIP 内容
- `demo.html` - 可直接浏览器打开的完整演示页面
- `demo.css` - 基于主题 Token 的 CSS 组件类
- `ui-kit.json` - 完整配置备份
- `README.md` - 使用说明文档

#### IntegrationGuide 更新
- Starter Files tab 增加 "Download Starter Kit ZIP" 按钮
- 显示 ZIP 包内容说明：包含 demo.html, demo.css, ui-kit.json, README.md

#### 测试更新
- 新增 4 个测试用例验证 ZIP 功能
- self-test: 120/120

---

## v0.6.0 (2026-05-07)

### 阶段 1-5 完成摘要

#### 阶段 1：项目骨架 + 标准文档层
- Vite + React + TypeScript + Tailwind CSS + Framer Motion 技术栈
- 项目标准层文档（PROJECT_CONTRACT、ARCHITECTURE、UI_STYLE_GUIDE 等）
- 自测脚本 (self-test.mjs) + 预检脚本 (preflight.mjs)

#### 阶段 2：核心 lib 层
- **themes.ts**：20 个主题 × 2 模式 (light/dark)，完整 20 个 token
- **motion.ts**：5 级 Motion System (off/subtle/normal/expressive/cinematic)
- **storage.ts**：localStorage 持久化，key: `ui-kit-builder-config`
- **export.ts**：5 种导出格式
- **applyTheme.ts**：主题应用到 CSS Variables
- **builder.ts**：配置类型定义 + 可选项数组

#### 阶段 3：UI 组件层
- Button (7 variants: solid/soft/outline/ghost/gradient/glass/neon)
- Card (6 variants: solid/glass/bordered/elevated/floating/terminal)
- Input (5 variants: filled/outline/minimal/glass/terminal)
- Badge (6 variants: default/secondary/success/warning/info/destructive)
- Tabs、Dialog、Switch、Progress、Table、Alert、Toast、CodeBlock

#### 阶段 4：Builder 布局层
- 左右双栏布局（LivePreview + ControlPanel）
- ThemePicker (20 主题选择器)
- BackgroundPicker (12 种背景选择器)
- StyleOptionGroup (通用样式选项组)
- ExportPanel (5 种导出功能)
- MotionPreview + TokenPreview

#### 阶段 5：完整 Preview App
- PreviewShell (App Shell 布局)
- PreviewApp (完整 Web App 预览)
- CommandPalettePreview (命令面板)
- FloatingWindowPreview (浮动窗口)
- SettingsPanelPreview (设置面板)
- EmptyStatePreview (空状态)
- ActivityPanelPreview (活动面板)

### 核心数据

- **20 个主题**：Tokyo Night、Catppuccin、Dracula、Nord、Gruvbox、Rosé Pine、One Dark、Solarized、Monokai、GitHub Light、Vercel Geist、Linear Dark、Raycast、Cyber Neon、Frosted Glass、Mint Lab、Amber Studio、Rose Terminal、Slate Pro、Oceanic
- **12 种背景**：Solid、Soft Gradient、Radial Glow、Grid Surface、Noise Glass、Aurora、Terminal Matrix、Mesh Gradient、Frosted Panel、Starfield、Blueprint Grid、Minimal Paper
- **11 项配置**：Theme、Background、Mode、Radius、Shadow、Density、Button Style、Card Style、Input Style、Motion Level、Font Scale
- **5 种导出**：CSS Variables、theme.css、Tailwind Config、ui-kit.json、React Token Object

### 测试结果

- `npm run build`：PASS
- `npm run check`：PASS
- `npm run self-test`：49/49
- `npm run preflight`：21/21

---

## v0.1.0 (2026-05-07)

### 初始化

- 项目骨架搭建
- 技术栈：Vite + React + TypeScript + Tailwind CSS + Framer Motion
- 项目标准层文档初始化
- 自测脚本初始化
