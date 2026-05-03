# Release Notes

## v3.1.0 - Release Candidate / Final Polish (2026-05-03)

### 🔍 最终体验检查
- 完整走通 12 步核心用户路径：Dashboard → Showcase 加载 → 编辑模块 → 多模型输出 → 复制 → Score/Conflict/Safety → Polisher → Diff → Snapshot → Prompt Pack → Export → Import
- 确认所有按钮有效、状态刷新正常、复制有 Toast 提示

### 🎨 UI 最终打磨
- Dashboard Hero 区域 CTA 按钮文案优化
- Showcase 卡片间距和布局优化
- 输出区复制按钮样式统一
- 空状态提示更友好
- Toast 提示统一（成功/错误两种样式）
- 深色模式对比度检查
- 移动端布局无横向溢出
- 长文本区域不撑爆页面

### 🔖 版本统一
- package.json / appMeta / AppFooter / README / RELEASE_NOTES / self-test 版本统一为 v3.1.0
- Footer 显示：v3.1.0 / Local First / No Backend / No Tracking / GitHub Pages Ready / built 2026-05-03

### 📝 README 发布级完善
- 新增项目一句话定位和在线访问地址
- 新增核心用户路径（两条典型路径）
- 新增功能总览（Dashboard / Director / 6 适配器 / Deconstruct / Showcase / Snapshots / Packs / Lab / Settings）
- 新增隐私说明独立章节
- 新增数据导入导出说明（含 localStorage key 表格）
- 新增 self-test / preflight 说明
- 新增适合人群
- 新增已知限制
- 新增 GitHub Pages 部署详细说明

### 🚀 GitHub Pages 发布检查
- vite base 使用 `./` 相对路径，适配 `/prompt-market/` 子目录
- build 后 dist/index.html 存在，资源路径正常
- .github/workflows/deploy.yml 自动构建部署配置正确
- README 在线地址指向 https://w0nderful666.github.io/prompt-market/

### 🧪 self-test / preflight 增强
- 新增 v3.1.0 版本一致性检查（package.json / appMeta / README / RELEASE_NOTES）
- 新增 README 内容检查（在线地址、隐私说明、Export/Import、self-test 文档）
- 新增 GitHub Pages 配置检查（vite base）
- 新增全组件 href="#" 死链接扫描
- self-test 从 154 项扩展至 154+ 项

### 📱 移动端和空状态优化
- 确认所有页面移动端无横向溢出
- 空状态提示更友好（无快照、无 Pack 等场景）
- 长文本区域使用 overflow 处理

---

## v3.0.0 Round 3 - Product Hardening Upgrade (2026-05-03)

### 🧹 清理遗留代码
- 删除 4 个未使用组件：DirectorHistory、PromptEditor、PromptGallery、TopBar
- 移除 Classic 旧模式全部 UI（activeSection === 'classic'、hidden 区域、旧关键词选择器）
- 移除 Classic 模式相关组件引用（CategoryTabs、SubTabs、SearchBox、KeywordGroup、SelectedPanel、SavedSchemes、PromptModeSwitch、PromptSections、QuickAppendPanel、TemplatePanel）
- 保留有价值的词库数据通过 storage.js 继续可用

### 🏗️ 拆分 App.vue
- 提取 AppHeader.vue — 顶部导航栏（标题、版本、深色模式切换）
- 提取 AppFooter.vue — 底部信息（版本、构建日期、隐私声明）
- 提取 AppNavigation.vue — Tab 导航组件
- 提取 DashboardSection.vue — Dashboard 页面（Hero、统计、快速入口）
- 提取 LabSection.vue — Lab 实验室页面（6 个面板）
- 提取 SettingsSection.vue — Settings 设置页面（数据管理全套）
- App.vue 行数显著下降，职责清晰

### 📸 新增 Snapshots 快照
- SnapshotsPanel.vue — 完整快照管理面板
- 功能：保存当前 Director 状态 / 列表展示 / 恢复快照 / 删除快照 / 复制 GPT Image 输出 / 导出 JSON / 导入 JSON
- 每个快照保存：id、标题、创建时间、版本、director 全部模块、模型、输出、评分、安全等级、冲突数、比例、备注
- 最多 20 条，超出提示清理
- 存储 key: prompt_market_snapshots

### 📦 新增 Prompt Packs 模板包
- PromptPacksPanel.vue — 模板包管理面板
- 功能：创建 Pack / 编辑名称描述标签 / 添加当前提示词 / 从 Pack 加载 / 删除提示词 / 导出 JSON / 导入 JSON / 删除 Pack
- 内置 3 个官方 Pack：
  1. Realistic Portrait Starter Pack（4 条 prompt）
  2. Creator Utility Pack（3 条 prompt）
  3. Dark Street Style Pack（4 条 prompt）
- 每条 prompt 至少 12 个模块，包含完整 director 数据
- 存储 key: prompt_market_packs

### 📤 统一导入导出和 Storage 管理
- storageManager.js — 全新存储管理工具
- getStorageUsage() — 本地数据占用估算（B/KB/MB）
- exportAllData() — 导出全部 prompt_market_ 前缀数据
- importAllData(json, mode) — 导入数据，支持 merge / overwrite 模式
- safeWrite() — 写入时自动捕获 QuotaExceededError
- clearHistoryData / clearDiffHistory / clearSnapshots / clearUserPacks / resetSettings / clearAllPromptMarketData
- ImportExportModal.vue — 导入导出弹窗组件
- SettingsSection 集成完整数据管理 UI

### 🖼️ Showcase 补强至 12 个示例
- 新增 4 个示例：
  9. 极简 App 图标概念（GPT Image，1:1，13 模块）
  10. AI 工具官网 Hero 图（GPT Image，16:9，13 模块）
  11. 复古胶片校园走廊（Midjourney，3:4，18 模块）
  12. 赛博朋克城市壁纸（Stable Diffusion，16:9，13 模块）
- 每个示例包含 recommendedModel、aspectRatio、tags、summary

### 🧪 增强自测和预检
- self-test.js 从 109 项扩展到 153 项
- 新增 37 项 Round 3 检查：
  - Layout 组件存在（AppHeader / AppFooter / AppNavigation / DashboardSection / LabSection / SettingsSection）
  - Classic 模式已移除
  - Snapshots 面板和逻辑存在
  - Prompt Packs 面板和逻辑存在，官方 Pack ≥ 3
  - Export/Import All Data 存在
  - storageManager.js 和 QuotaExceededError 处理存在
  - Settings 数据管理存在
  - Showcase ≥ 12 示例
  - README 包含 Snapshots / Prompt Packs / Product Hardening
  - RELEASE_NOTES 包含 Round 3 / Product Hardening
  - 无 href="#" 死链接

### 📝 文档更新
- README.md 新增：Snapshots、Prompt Packs、Product Hardening、localStorage 数据治理
- RELEASE_NOTES.md 新增：Round 3 完整变更记录

---

## v3.0.0 Round 2 - Prompt Diagnostics Upgrade (2026-05-03)

### 📊 Prompt Score 升级至 16 维度
- 从 10 维度升级到 16 维度，总分 100
- 新增维度：质感明确度、动作/姿势明确度、服装/配件明确度、背景完整度、氛围一致性、Must Keep 完整度、Avoid 完整度、Failure Guard 完整度、模型适配度、比例明确度、冲突风险、内容风险
- 每个维度有具体的改进建议（非泛泛而谈）
- 自动更新：编辑器内容变化时自动重新评分
- 等级：Excellent (≥90) / Good (≥70) / Needs Work (≥50) / Incomplete (<50)

### ⚠️ Conflict Detector 升级至 19+ 规则
- 从 8 类冲突升级到 19+ 条规则，覆盖 6 大类：
  - 质量冲突（3 条）：低分辨率 vs 超清、模糊 vs 锐利、CCD vs 棚拍
  - 场景冲突（3 条）：家庭 vs 豪华、夜晚 vs 清晨、室内 vs 户外
  - 构图冲突（4 条）：半身 vs 全身、裁切 vs 全身、特写 vs 远景、镜面自拍 vs 第三人称
  - 风格冲突（3 条）：写实 vs 卡通、随手拍 vs 商业、胶片 vs 未来科技
  - 氛围冲突（3 条）：慵懒 vs 活力、私密 vs 商业、安静 vs 高能
  - 主体冲突（3 条）：单人 vs 合影、无首饰 vs 重型、无文字 vs 大标题
- 新增风险等级标签：高风险 / 中风险 / 低风险
- 新增"移除冲突词"按钮，一键从所有模块中移除冲突关键词
- 移除后自动重新运行评分和冲突检测

### 🛡️ Safety Hints（全新）
- 9 类安全规则，本地规则匹配，无 API 调用：
  - 年龄模糊 + 亲密场景 → Caution
  - 未成年人相关词 → Risky
  - 真实人物/公众人物 → Caution
  - 商标/版权角色 → Caution
  - 偷拍/窥视/非自愿 → Risky
  - 过度性化/色情 → Risky
  - 文字/水印/标志 → Caution
  - 医疗/法律/证件 → Caution
  - 个人隐私信息模式 → Caution
- 6 个快速修复按钮，每个都实际修改编辑器字段
- 不阻断编辑，仅提供提示和建议

### ✨ Prompt Polisher（全新）
- 15 种本地润色模式：
  - 更自然 / 更专业 / 更适合 GPT Image / Midjourney / SD / Flux
  - 更短 / 更详细 / 更写实 / 更电影感 / 更低清手机质感
  - 更生活化 / 更高级产品图 / 更适合头像 / 更适合 GitHub 封面
- 预览模式：查看变更内容后再确认
- 撤销功能：一键恢复到润色前状态
- 每种模式有独立的 add/remove/transform 规则

### 🔀 Prompt Diff（全新）
- Token 级文本对比：新增 / 移除 / 保留
- 字符变化和 Token 估计统计
- localStorage 历史记录（最多 20 条）
- 复制对比摘要
- 快速发送到原始/优化区

### 🎨 UI 升级
- ConflictPanel 新增风险等级徽章和移除按钮
- PromptScorePanel 升级为 16 维度详情视图
- DirectorEditor 集成 SafetyPanel 和 PolisherPanel
- Lab 区域新增 PolisherPanel、PromptDiffPanel、SafetyPanel
- 所有新面板支持深色模式

### 📝 其他
- README.md 更新：新增 Prompt Score / Conflict Detector / Safety Hints / Polisher / Diff 文档
- self-test.js 增强：新增 26 项测试覆盖所有新功能
- 示例内容安全审查：确保 8 个内置示例全部 Safe 级别

---

## v3.0.0 - Prompt Director Studio (2026-05-03)

### 🎯 产品重命名
- 产品名统一为 "Prompt Director Studio"
- 版本号升至 3.0.0
- 新增 src/config/appMeta.js 集中管理版本、产品名、标语、构建日期

### 📊 新增：Dashboard 总览页
- Hero 区域：标题、副标题、5 个徽章（Local First / No Backend / Privacy Friendly / GPT Image Ready / GitHub Pages Ready）
- 4 个 CTA 按钮，全部真实可用：从一句话开始 / 粘贴提示词拆解 / 浏览 Showcase / 加载官方示例
- 统计数据卡片：17 模块 / 6 适配器 / 8 示例 / 100% 隐私
- 快速跳转卡片

### 🧭 新增：全局导航架构
- 6 个顶级 Tab：Dashboard / Director / Deconstruct / Showcase / Lab / Settings
- 切换不丢失编辑状态（v-show 保活）
- 自动恢复上次活跃区域（localStorage）
- 移动端响应式导航

### 🎬 Director 编辑器重构
- 18 个模块重新分组为 5 个可折叠组：
  - Foundation 基础设定: model, subject, scene, ratio
  - Visual Direction 视觉导演: composition, lighting, camera, depthOfField (新增)
  - Subject Details 主体细节: expression, face, hair, body, clothing
  - Atmosphere 氛围叙事: background, atmosphere, caption
  - Control 控制项: mustKeep, avoid
- 每组显示已填/总数统计
- 新增「景深效果」模块（depthOfField）
- 全部展开/收起按钮
- 编辑器通过 defineExpose 暴露方法给父组件

### 🤖 模型适配器增强
- 6 种输出格式全部包含景深（depthOfField）字段
- GPT Image：自然语言导演描述 + Must Keep + Avoid + Aspect Ratio
- Midjourney：英文短语 + --ar + --style raw + --no
- Stable Diffusion：拆分 Positive / Negative Prompt
- Flux：简洁高密度英文，不过度打标签
- 通用中文 / 通用英文：结构化输出

### 🖼️ Showcase 升级
- 从 6 个扩展到 8 个内置示例
- 新增：浴室兔耳镜自拍、个人头像写实摄影、暗黑赛博街头写真
- 每个示例填充 17 个模块（含 depthOfField）
- 卡片展示：标题、标签、推荐模型、推荐比例、加载按钮、复制 GPT 按钮

### ⚙️ Settings 页面
- 独立设置页面
- 深色模式一键切换
- 数据管理：导入词库、导出词库、导出方案、清空所有、重置词库
- 关于信息

### 📱 Footer
- 显示版本号 v3.0.0
- 显示构建日期 2026-05-03
- 显示隐私声明：Local First / No Backend / No Tracking / GitHub Pages Ready

### 🧪 自测增强
- 新增 v3.0.0 版本验证
- 新增 8 示例验证
- 新增导航 Tab 存在验证
- 新增 Midjourney --ar 输出验证
- 新增 Stable Diffusion Positive/Negative 验证

---

## v2.1.0 - Professional Enhancement

### ⚠️ 新增：Prompt Conflict Detector
- 检测 8 类冲突：分辨率、场景、妆容、构图、风格、光线、氛围、设备
- 每个冲突显示具体冲突词和修复建议
- 冲突卡片带 dismiss 功能

### 🧹 新增：Prompt Token Cleaner
- 一键清理重复词、空模块、多余标点
- 清理堆叠形容词、中英文混乱空格
- 检测重复的避免项和必须保留项
- 显示清理报告

### 🤖 新增：模型适配器
- 6 种模型输出格式：GPT Image / Midjourney / Stable Diffusion / Flux / 通用中文 / 通用英文
- Midjourney 自动追加 --ar 和 --style raw
- Stable Diffusion 拆分 positive/negative prompt
- Flux 简洁高密度英文
- 面板内切换，一键复制/下载

### 📋 新增：Prompt Recipe 配方卡片
- 保存为配方：标题、模型、风格标签、比例、完整度分数、修改时间
- 一键加载/复制/导出
- 卡片式网格展示

### 🔗 新增：分享链接
- 配置压缩到 URL hash，不上传服务器
- 打开链接自动恢复提示词配置
- 显示链接长度

### 🖼️ 新增：Prompt Gallery
- 6 个完整高级示例，每个模块都有详细填写
- 浴室镜自拍 / 地铁站 CCD / 夜晚便利店 / 雨天车窗 / 高级产品图 / GitHub 封面
- 带评分、标签、模型信息

### 🎨 UI 高级感优化
- 首页 Hero 区域
- Local First / No Backend / Privacy Friendly / GitHub Pages Ready 徽章
- 右侧输出区 sticky 固定
- 所有交互有动画反馈（active:scale-95, hover:translateY）
- 深色模式对比度优化

### 🧪 自测增强
- 143 项测试全部通过
- 新增冲突检测、清理器、模型适配器、分享链接、Gallery、Hero、徽章测试

---

## v2.0.0 - Prompt Director Upgrade

### 🎬 新增：结构化提示词编辑器
- 新增"提示词导演"模式，将提示词拆分为 17 个独立模块
- 每个模块支持：输入内容、一键清空、锁定模块、从预设中插入短语
- 支持中文和英文字段标题
- 模块覆盖：模型/用途、主体设定、场景环境、构图与镜头、表情与状态、脸部与妆容、发型与细节、身体与姿势、服装与配件、光线与色彩、摄影/画面质感、背景元素、整体氛围、Caption感、必须保留、避免项、比例/尺寸

### 📤 新增：5 种输出模式
- 中文简短版
- 中文标准版
- 中文导演版（结构化标题输出）
- 英文标准版
- 负面提示词 / Avoid Prompt

### 🔒 新增：必须保留 / 避免项
- 新增两个明显的区域：Must Keep / 必须保留、Avoid / 避免项
- 内置 15+ 常用避免项标签，点击即可添加

### 🎨 新增：场景预设库
- 场景：浴室镜自拍、地铁站、便利店门口、夜晚街头等 10 个
- 摄影质感：低分辨率手机自拍、老式数码相机、胶片颗粒等 10 个
- 构图：近景半身、特写、竖构图、三分法构图等 10 个
- 光线：浴室顶灯、黄昏逆光、便利店冷光等 10 个
- 氛围：慵懒、亲近、调皮、略迷离等 10 个

### 📊 新增：提示词质量评分
- 10 个维度 0-100 分评估
- 维度：主体明确、场景明确、构图明确、光线明确、风格明确、细节具体、必须保留、避免项、比例指定、无冲突描述
- 输出：分数、等级、优点列表、改进建议

### 🔍 新增：仿写拆解器
- 粘贴一段长提示词，前端规则解析自动提取 17 个模块
- 解析后自动填入结构化编辑器

### 🎲 新增：变体生成
- 11 种风格方向：更真实、更电影感、更胶片、更低清手机感、更日系、更暗黑、更生活化、更高级、更适合 GPT Image、更适合 Midjourney、更适合 Stable Diffusion
- 每个变体可复制完整提示词

### 💾 新增：导入导出
- 保存当前提示词方案到 localStorage
- 最近 10 条历史记录
- 收藏提示词
- 导出 JSON / 导入 JSON
- 一键复制当前结果
- 下载 .txt 文件

### 🌙 新增：深色模式
- 支持亮色/暗色主题切换
- 所有组件适配深色模式

### 📱 优化：移动端适配
- 响应式网格布局
- 卡片在小屏幕上自动堆叠

### 🧪 新增：自测
- self-test.html + self-test.js
- 覆盖：页面加载、模块存在、示例加载、提示词生成、评分、localStorage、导出、移动端布局

---

## v1.4.0 - 原始版本
- 绘图提示词关键词选择器
- 自然语言模式、增强描述模式、关键词模式、模板模式
- 分类标签、搜索、随机选择
- 方案保存与恢复
- 词库导入导出
