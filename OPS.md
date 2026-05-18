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

### IPv6 绑定原理（为什么 `--host 0.0.0.0` 不行，要用 `--host ::`）

在 Linux 上，`0.0.0.0` 只绑定 IPv4 协议栈：
```
0.0.0.0:8787  →  仅 IPv4
```
如果用户通过 `ssh -L 8787:[::1]:8787` 做端口转发，SSH 会尝试连接到 `[::1]:8787`（IPv6 localhost），但进程没有在 IPv6 上监听，所以返回 `Connection refused`。

`::` 才是 IPv6 的"全接口"通配符。在 Debian 上 `ipv6only` 默认关闭，所以绑定 `::` 会自动同时处理 IPv4 连接：
```
*:8787  →  IPv6 + IPv4 双栈
```

**所以：如果需要同时支持 IPv4 和 IPv6 访问（例如 SSH -L 转发到 [::1]），必须用 `--host ::` 而非 `--host 0.0.0.0`。**

Vite 8 的 `--host` 参数：
| 值 | 监听范围 | SSH -L [::1] 转发 |
|---|---|---|
| `0.0.0.0` | 仅 IPv4 | ❌ Connection refused |
| `::` | IPv6 + IPv4 | ✅ 正常连接 |
| `localhost` | 仅 127.0.0.1 + ::1 | ✅ 但仅限本机 |
| 具体 IPv6 地址 | 仅该地址 | ✅ |

### 当前项目使用的命令

```bash
# 开发（SSH 端口转发场景，支持 IPv4 + IPv6）
nohup npx vite --port 8787 --host '::' > /tmp/vite8787.log 2>&1 &

# 访问路径
# 本地：   http://localhost:8787/prompt-market-react/
# SSH 转发：ssh -L 8787:[::1]:8787 -p 6657 root@[240e:95d:c01:700::4:27af]
#           然后本地浏览器打开 http://localhost:8787/prompt-market-react/

# 验证监听
ss -tlnp6 | grep 8787    # 应该看到 *:8787

# 验证响应
curl -s -o /dev/null -w "%{http_code}" 'http://[::1]:8787/prompt-market-react/'
# 应返回 200
```

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
