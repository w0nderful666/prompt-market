# Prompt Market React / AI 写真人像提示词导演台

一站式 AI 写真人像提示词生成器。快速出片 + 精细调校 + 动作导演变体。

## 核心功能

- **快速生成** — 从 50+ 模板中选择，一键生成正向提示词、负面词、参数后缀
- **高级编辑** — 分面精细编辑，微调每一个细节槽位
- **Pose Director（动作导演）** — 基于场景生成 3/5/9 张动作变体，支持轻微/标准/动态强度
- **智能 Diff** — 根据选择自动启用手部修复、面部修复、动态防扭曲等
- 无后端、本地优先、localStorage 持久化

## 开发命令

```bash
npm run dev      # 启动开发服务器
npm run build    # TypeScript 检查 + Vite 构建
npm run self-test # 数据一致性检查
npm run preflight # 部署前检查
```

## 部署

GitHub Pages: 推送 main 分支自动部署到 `https://w0nderful666.github.io/prompt-market-react/`

## 技术栈

React 19, TypeScript, Tailwind CSS, Vite

## 项目状态

当前版本：feat/pose-director-bridge — 已完成状态统一，等待正式发布。
