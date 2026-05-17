# Operations & Setup

## Dev Server

```bash
# 启动（IPv6，WARP 环境）
npx vite --host 240e:95d:c01:700::4:27b8 --port 5173 --base /w0nderful-ui-foundation/

# 访问
# http://[240e:95d:c01:700::4:27b8]:5173/w0nderful-ui-foundation/

# 后台运行
nohup npx vite --host 240e:95d:c01:700::4:27b8 --port 5173 --base /w0nderful-ui-foundation/ > /dev/null 2>&1 & disown
```

> **注意**：IPv6 地址一定要写全 `240e:95d:c01:700::4:27b8`，只写 `::4` 会 bind 失败（EADDRNOTAVAIL）。

## 网络 & WARP

- 直连 IPv4 被墙，所有 GitHub 操作必须走 SOCKS5 代理
- WARP 提供 IPv6 连通性，断开后 `240e:95d:c01:700::4:27b8` 会不可用，改用 `--host 0.0.0.0` 或 `localhost`
- Git 代理设置：

```bash
git config --global http.proxy socks5://127.0.0.1:2080
git config --global https.proxy socks5://127.0.0.1:2080
# 克隆
git -c http.proxy=socks5://127.0.0.1:2080 clone --depth 1 <repo-url>
# 取消代理
git config --global --unset http.proxy
git config --global --unset https.proxy
```

## Build

```bash
npm run build
# tsc -b && vite build
# 构建产物在 dist/
```

## 已知问题

- `navigator.clipboard.writeText()` 在 HTTP 下不可用，已实现 `execCommand('copy')` 回退（`src/utils/clipboard.ts`）
- `.js` 文件是旧版遗留，`.ts` 为源码；修改 `.ts` 后需要 `npm run build` 才生效

## 变更历史关键节点

| 日期 | 内容 |
|------|------|
| 2026-05-16 | 初始克隆，处理 children 词汇，自然语言输出，expanded presets，加强 negative prompts，clipboard fallback，sync-to-presets 双向同步 |
