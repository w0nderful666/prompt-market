# Prompt Market / 提示词集市

一个面向 AI 人像绘图的 Prompt 关键词选择器。用户可以按分类选择关键词，生成自然语言提示词，复制后用于 Stable Diffusion、Midjourney、即梦、通义万相等图像生成工具。

项目使用 Vue 3 + Vite + TailwindCSS，所有数据都来自本地 JSON 文件，不依赖后端，适合部署到 Cloudflare Pages、GitHub Pages、Vercel、Netlify 或任意静态服务器。

## 在线体验

你可以直接打开下面的 Demo 试用：

```text
https://w0nderful666.github.io/prompt-market/
```

在线 Demo 是纯前端静态页面，不会调用后端服务，也不会调用外部 AI API。用户导入的词库、保存的方案和编辑内容都只会保存在当前浏览器的 `localStorage` 中，不会上传到服务器，也不会影响其他用户。

## 功能特点

- 分类选择提示词关键词
- 一键生成自然语言人像 Prompt
- 关键词模式、自然语言模式、增强描述模式、模板模式
- 正向提示词和负面提示词合并输出
- 提示词可手动编辑
- 支持预设方案、真实照片随机
- 支持保存方案到 localStorage
- 支持导入、导出自定义词库
- 支持导出保存方案
- 纯前端静态部署

## 本地运行

```bash
npm install
npm run dev
npm run build
```

构建产物会输出到：

```text
dist/
```

## 部署说明

这个项目可以直接部署为静态网站。

### Cloudflare Pages

推荐配置：

```text
Framework preset: Vite
Build command: npm run build
Build output directory: dist
```

### GitHub Pages

项目已将 Vite 的 `base` 设置为 `./`，构建后的资源路径是相对路径，适合部署在 GitHub Pages 的仓库子路径下。

常见流程：

```bash
npm install
npm run build
```

然后把 `dist/` 发布到 GitHub Pages。

如果使用 GitHub Actions，可以让 Actions 执行 `npm run build`，再发布 `dist` 目录。

### Nginx / 静态服务器

直接把 `dist/` 目录放到网站根目录即可。

```text
dist/index.html
dist/assets/...
```

## 词库导入导出

项目默认词库位于：

```text
src/data/prompts.json
```

页面顶部提供：

- 导入：导入新的词库 JSON
- 导出词库：导出当前正在使用的词库
- 导出方案：导出用户保存的方案
- 重置：恢复项目内置默认词库

页面会优先读取浏览器 `localStorage` 中的自定义词库。如果你导入过词库，再修改 `src/data/prompts.json`，页面可能仍然显示旧词库。此时点击页面顶部的“重置”即可恢复默认词库。

## 词库 JSON 格式

词库必须是一个 JSON 对象，基础结构如下：

```json
{
  "version": "1.4.0",
  "updatedAt": "2026-04-29",
  "categories": [
    {
      "id": "draw",
      "name": "绘图",
      "tabs": [
        {
          "id": "subject",
          "name": "主体",
          "groups": [
            {
              "id": "person",
              "name": "人物",
              "items": [
                {
                  "id": "female",
                  "zh": "女性",
                  "en": "female"
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  "templates": []
}
```

### 顶层字段

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `version` | 是 | 词库版本号，例如 `1.4.0` |
| `updatedAt` | 是 | 更新时间，建议使用 `YYYY-MM-DD` |
| `categories` | 是 | 一级用途分类数组 |
| `templates` | 否 | 提示词模板数组 |

## 分类结构要求

### categories

一级分类，例如：

```json
{
  "id": "draw",
  "name": "绘图",
  "tabs": []
}
```

建议保留这些一级分类，方便后续扩展：

```text
draw      绘图
video     视频
writing   写作
design    设计
coding    编程
```

目前项目主要增强的是 `draw` 绘图分类。

### tabs

二级分类，例如：

```json
{
  "id": "subject",
  "name": "主体",
  "groups": []
}
```

绘图分类推荐使用这些 tab id：

```text
subject       主体
clothing      服装
accessories   配饰
makeup_hair   妆发
scene         场景
atmosphere    氛围
style         风格
composition   构图
lighting      光影
camera        镜头
quality       质量
negative      负面词
```

这些 id 会被自然语言生成器识别。比如 `subject` 会进入“画面主体”，`scene` 会进入“场景”，`negative` 会进入最终提示词末尾的“负面提示词”。

### groups

每个 tab 下可以有多个分组：

```json
{
  "id": "expression_pose",
  "name": "表情与姿态",
  "items": []
}
```

分组 id 可以自定义，但建议使用英文、数字、下划线，例如：

```text
person
age_identity
expression_pose
snapshot_realism
photo_imperfections
realism_quality
```

### items

关键词项格式：

```json
{
  "id": "clear_eye_contact",
  "zh": "眼神有焦点",
  "en": "clear eye contact"
}
```

字段要求：

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `id` | 是 | 关键词唯一 ID，建议全词库内尽量唯一 |
| `zh` | 是 | 中文显示和中文提示词内容 |
| `en` | 否 | 英文提示词内容，没有时会回退使用 `zh` |

建议：

- `id` 使用小写英文和下划线，例如 `natural_skin_texture`
- `zh` 不要写成乱码或问号
- `en` 尽量填写，对英文 Prompt 有帮助
- 同一个 tab 下尽量避免含义完全重复的词
- 真实摄影词和动漫插画词建议分组放置，避免随机时混用

## 负面词格式

负面词也是普通 item，但必须放在 `negative` tab 下：

```json
{
  "id": "plastic_skin",
  "zh": "塑料皮肤",
  "en": "plastic skin"
}
```

生成时会自动合并到最终提示词末尾：

```text
负面提示词：塑料皮肤，坏手，水印
```

## 模板格式

`templates` 是可选字段。没有模板时，项目仍然可以正常生成自然语言提示词。

模板示例：

```json
{
  "id": "natural_portrait_template",
  "name": "自然人像描述模板",
  "description": "适合写实人像、街拍、生活感照片和可编辑中文长 prompt。",
  "type": "image",
  "mode": "template",
  "variables": [
    "subject",
    "clothing",
    "accessories",
    "makeup",
    "scene",
    "atmosphere",
    "style",
    "composition",
    "lighting",
    "camera",
    "quality"
  ],
  "zh": "这是一张{style}风格的人像画面，画面主体是{subject}。场景位于{scene}，镜头采用{composition}，光线来自{lighting}。",
  "en": "A {style} portrait image featuring {subject}. The scene is set in {scene}, composed with {composition}, lit by {lighting}.",
  "negative": "low quality, blurry, watermark, plastic skin, AI-generated look"
}
```

### 支持的模板变量

```text
{subject}
{clothing}
{accessories}
{makeup}
{scene}
{atmosphere}
{style}
{composition}
{lighting}
{camera}
{quality}
{negative}
```

变量会从用户已选关键词中按 tab 自动填充。

例如用户选择：

```text
女性
地铁站
胶片摄影
俯拍
自然光
```

模板中的：

```text
{subject}
{scene}
{style}
{composition}
{lighting}
```

会被替换成对应内容。

## 自定义词库准备建议

为了让生成效果更自然，建议不要只准备单个名词，也可以准备短语型关键词。

### 普通关键词

```json
{
  "id": "female",
  "zh": "女性",
  "en": "female"
}
```

### 短语关键词

```json
{
  "id": "natural_portrait_subject",
  "zh": "自然真实的人像主体",
  "en": "natural realistic portrait subject"
}
```

### 真实摄影质感

```json
{
  "id": "slightly_missed_focus",
  "zh": "轻微跑焦",
  "en": "slightly missed focus"
}
```

### 人像细节

```json
{
  "id": "believable_skin_pores",
  "zh": "可信皮肤毛孔",
  "en": "believable skin pores"
}
```

## 导入校验规则

导入词库时，项目会做基础校验：

- 顶层必须有 `version`
- 顶层必须有 `updatedAt`
- 顶层必须有 `categories`
- `categories` 必须是数组
- 每个 category 必须有 `id`、`name`、`tabs`
- 每个 tab 必须有 `id`、`name`、`groups`
- 每个 group 必须有 `id`、`name`、`items`
- 每个 item 至少需要 `id` 和 `zh`

如果格式不正确，页面会提示导入失败。

## 导入导出和 localStorage

本项目没有后端，用户数据都保存在浏览器本地：

```text
localStorage
```

保存内容包括：

- 当前已选关键词
- 用户保存的方案
- 自定义导入词库
- 编辑后的提示词
- 当前生成模式

注意：

- 换浏览器或清理浏览器缓存后，本地数据可能丢失
- 发布到线上后，不同用户的数据互不影响
- 导出的词库 JSON 可以再次导入
- 导出的方案 JSON 目前主要用于备份，不等同于词库 JSON

## 项目结构

```text
src/
  App.vue
  main.js
  style.css
  components/
    CategoryTabs.vue
    KeywordChip.vue
    KeywordGroup.vue
    PromptEditor.vue
    PromptModeSwitch.vue
    PromptSections.vue
    QuickAppendPanel.vue
    SavedSchemes.vue
    SearchBox.vue
    SelectedPanel.vue
    SubTabs.vue
    TemplatePanel.vue
    TopBar.vue
  data/
    prompts.json
  utils/
    naturalPromptBuilder.js
    promptBuilder.js
    promptTextTools.js
    storage.js
```

## 常见问题

### 为什么我修改了 `src/data/prompts.json`，页面没变化？

因为页面优先读取 localStorage 中的自定义词库。点击顶部“重置”恢复默认词库即可。

### 可以只准备中文词库吗？

可以。`en` 不是必填字段。没有 `en` 时，英文模式会回退使用中文。

### 可以部署到 Cloudflare 或 GitHub Pages 吗？

可以。项目是纯静态前端，构建后上传 `dist/` 即可。

### 导入词库会影响其他用户吗？

不会。导入词库只保存在当前浏览器的 localStorage 中。

## License

你可以按自己的需求继续修改、扩展和部署。
