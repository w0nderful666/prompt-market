import { getThemeTokens } from './themes'
import type { Mode, MotionLevel, ThemeTokens } from './builder'

const STORAGE_KEY = 'prompt_market_theme'

const tokenKeys: (keyof ThemeTokens)[] = [
  'background', 'foreground', 'card', 'cardForeground',
  'primary', 'primaryForeground', 'secondary', 'secondaryForeground',
  'muted', 'mutedForeground', 'accent', 'accentForeground',
  'border', 'input', 'ring',
  'destructive', 'destructiveForeground',
  'success', 'warning', 'info',
]

const motionLevels: Record<MotionLevel, Record<string, string>> = {
  instant: {
    '--motion-duration-instant': '0s', '--motion-duration-fast': '0s', '--motion-duration-normal': '0s', '--motion-duration-slow': '0s', '--motion-duration-slower': '0s',
    '--motion-easing-default': 'ease-out', '--motion-easing-in': 'ease-in', '--motion-easing-out': 'ease-out', '--motion-easing-in-out': 'ease-in-out', '--motion-easing-spring': 'ease-out',
    '--motion-list-stagger': '0s',
  },
  subtle: {
    '--motion-duration-instant': '0.05s', '--motion-duration-fast': '0.1s', '--motion-duration-normal': '0.15s', '--motion-duration-slow': '0.2s', '--motion-duration-slower': '0.3s',
    '--motion-easing-default': 'ease-out', '--motion-easing-in': 'ease-in', '--motion-easing-out': 'ease-out', '--motion-easing-in-out': 'ease-in-out', '--motion-easing-spring': 'ease-out',
    '--motion-list-stagger': '0.03s',
  },
  normal: {
    '--motion-duration-instant': '0.08s', '--motion-duration-fast': '0.15s', '--motion-duration-normal': '0.2s', '--motion-duration-slow': '0.3s', '--motion-duration-slower': '0.4s',
    '--motion-easing-default': 'cubic-bezier(0.4, 0, 0.2, 1)', '--motion-easing-in': 'cubic-bezier(0.4, 0, 1, 1)', '--motion-easing-out': 'cubic-bezier(0, 0, 0.2, 1)', '--motion-easing-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)', '--motion-easing-spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    '--motion-list-stagger': '0.05s',
  },
  expressive: {
    '--motion-duration-instant': '0.1s', '--motion-duration-fast': '0.2s', '--motion-duration-normal': '0.3s', '--motion-duration-slow': '0.45s', '--motion-duration-slower': '0.6s',
    '--motion-easing-default': 'cubic-bezier(0.4, 0, 0.2, 1)', '--motion-easing-in': 'cubic-bezier(0.4, 0, 1, 1)', '--motion-easing-out': 'cubic-bezier(0, 0, 0.2, 1)', '--motion-easing-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)', '--motion-easing-spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    '--motion-list-stagger': '0.08s',
  },
  cinematic: {
    '--motion-duration-instant': '0.15s', '--motion-duration-fast': '0.25s', '--motion-duration-normal': '0.4s', '--motion-duration-slow': '0.6s', '--motion-duration-slower': '0.8s',
    '--motion-easing-default': 'cubic-bezier(0.4, 0, 0.2, 1)', '--motion-easing-in': 'cubic-bezier(0.4, 0, 1, 1)', '--motion-easing-out': 'cubic-bezier(0, 0, 0.2, 1)', '--motion-easing-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)', '--motion-easing-spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    '--motion-list-stagger': '0.12s',
  },
  elastic: {
    '--motion-duration-instant': '0s', '--motion-duration-fast': '0.1s', '--motion-duration-normal': '0.3s', '--motion-duration-slow': '0.5s', '--motion-duration-slower': '0.8s',
    '--motion-easing-default': 'ease-out', '--motion-easing-in': 'ease-in', '--motion-easing-out': 'ease-out', '--motion-easing-in-out': 'ease-in-out', '--motion-easing-spring': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    '--motion-list-stagger': '0.08s',
  },
  snappy: {
    '--motion-duration-instant': '0s', '--motion-duration-fast': '0.05s', '--motion-duration-normal': '0.1s', '--motion-duration-slow': '0.15s', '--motion-duration-slower': '0.2s',
    '--motion-easing-default': 'ease-out', '--motion-easing-in': 'ease-in', '--motion-easing-out': 'ease-out', '--motion-easing-in-out': 'ease-in-out', '--motion-easing-spring': 'ease-out',
    '--motion-list-stagger': '0.02s',
  },
}

function kebabCase(key: string): string {
  return key.replace(/([A-Z])/g, '-$1').toLowerCase()
}

export function applyTheme(themeId: string, mode: Mode, options?: { motionLevel?: MotionLevel; radius?: string; shadowSm?: string; shadowMd?: string; shadowLg?: string; shadowXl?: string; shadowGlow?: string }) {
  const root = document.documentElement
  const tokens = getThemeTokens(themeId, mode)

  for (const key of tokenKeys) {
    root.style.setProperty(`--${kebabCase(key)}`, tokens[key])
  }

  root.style.setProperty('--chart-1', tokens.primary)
  root.style.setProperty('--chart-2', tokens.info)
  root.style.setProperty('--chart-3', tokens.warning)
  root.style.setProperty('--chart-4', tokens.success)
  root.style.setProperty('--chart-5', tokens.destructive)

  const r = options?.radius || '6px'
  root.style.setProperty('--radius', r)
  root.style.setProperty('--radius-sm', '4px')
  root.style.setProperty('--radius-md', r)
  root.style.setProperty('--radius-lg', '8px')
  root.style.setProperty('--radius-xl', '12px')
  root.style.setProperty('--radius-2xl', '16px')

  root.style.setProperty('--shadow-sm', options?.shadowSm || '0 1px 2px rgba(0,0,0,0.05)')
  root.style.setProperty('--shadow-md', options?.shadowMd || '0 2px 8px rgba(0,0,0,0.08)')
  root.style.setProperty('--shadow-lg', options?.shadowLg || '0 4px 16px rgba(0,0,0,0.1)')
  root.style.setProperty('--shadow-xl', options?.shadowXl || '0 8px 24px rgba(0,0,0,0.12)')
  root.style.setProperty('--shadow-glow', options?.shadowGlow || `0 0 20px hsl(${tokens.primary} / 0.3)`)

  const motionLevel = options?.motionLevel || 'normal'
  const motionVars = motionLevels[motionLevel] || motionLevels.normal
  for (const [key, value] of Object.entries(motionVars)) {
    root.style.setProperty(key, value)
  }

  root.classList.toggle('dark', mode === 'dark')

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ themeId, mode }))
  } catch {}
}

export function loadTheme(): { themeId: string; mode: Mode } {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const { themeId, mode } = JSON.parse(saved)
      applyTheme(themeId || 'material-you', mode || 'light')
      return { themeId: themeId || 'material-you', mode: mode || 'light' }
    }
  } catch {}
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const mode: Mode = prefersDark ? 'dark' : 'light'
  applyTheme('material-you', mode)
  return { themeId: 'material-you', mode }
}

export const BACKGROUND_STYLES: Record<string, { name: string; cls: string }> = {
  solid: { name: '纯色 Solid', cls: 'bg-background' },
  'soft-gradient': { name: '柔和渐变', cls: 'bg-gradient-to-br from-background via-muted/40 to-background' },
  'radial-glow': { name: '径向光晕', cls: 'bg-background [background-image:radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.24),transparent_35%),radial-gradient(circle_at_80%_70%,hsl(var(--accent)/0.18),transparent_35%)]' },
  'grid-surface': { name: '网格表面', cls: 'bg-background [background-image:linear-gradient(hsl(var(--border)/0.5)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/0.5)_1px,transparent_1px)] [background-size:24px_24px]' },
  'noise-glass': { name: '噪点玻璃', cls: 'bg-background/80 backdrop-blur-xl [background-image:radial-gradient(hsl(var(--foreground)/0.08)_1px,transparent_1px)] [background-size:4px_4px]' },
  aurora: { name: '极光 Aurora', cls: 'bg-background [background-image:radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.32),transparent_32%),radial-gradient(circle_at_85%_25%,hsl(var(--info)/0.22),transparent_28%),radial-gradient(circle_at_50%_90%,hsl(var(--success)/0.16),transparent_35%)]' },
  'terminal-matrix': { name: '终端矩阵', cls: 'bg-background [background-image:linear-gradient(rgba(34,197,94,0.08)_1px,transparent_1px)] [background-size:12px_12px]' },
  'mesh-gradient': { name: '网格渐变', cls: 'bg-background [background-image:linear-gradient(135deg,hsl(var(--primary)/0.2),transparent_30%),linear-gradient(45deg,hsl(var(--warning)/0.14),transparent_35%),linear-gradient(225deg,hsl(var(--info)/0.16),transparent_40%)]' },
  'frosted-panel': { name: '磨砂面板', cls: 'bg-background/60 backdrop-blur-2xl [background-image:linear-gradient(135deg,hsl(var(--card)/0.5),hsl(var(--primary)/0.08))]' },
  starfield: { name: '星空 Starfield', cls: 'bg-background [background-image:radial-gradient(white_1px,transparent_1px),radial-gradient(hsl(var(--primary))_1px,transparent_1px)] [background-size:48px_48px,72px_72px] [background-position:0_0,24px_36px]' },
  'blueprint-grid': { name: '蓝图网格', cls: 'bg-background [background-image:linear-gradient(rgba(96,165,250,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(96,165,250,0.16)_1px,transparent_1px)] [background-size:24px_24px]' },
  'minimal-paper': { name: '极简纸张', cls: 'bg-background [background-image:linear-gradient(rgba(0,0,0,0.035)_1px,transparent_1px)] [background-size:100%_28px]' },
  'spotlight-stage': { name: '聚光灯舞台', cls: 'bg-background [background-image:radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.15),transparent_50%),radial-gradient(circle_at_100%_100%,hsl(var(--accent)/0.1),transparent_40%)]' },
  'carbon-grid': { name: '碳纤维网格', cls: 'bg-background [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:8px_8px]' },
  'layered-glass': { name: '层叠玻璃', cls: 'bg-background/60 backdrop-blur-lg [background-image:linear-gradient(135deg,hsl(var(--primary)/0.08),transparent_40%),linear-gradient(225deg,hsl(var(--accent)/0.06),transparent_40%)]' },
  'sunset-mesh': { name: '日落网格', cls: 'bg-background [background-image:linear-gradient(135deg,hsl(var(--warning)/0.15),transparent_40%),linear-gradient(45deg,hsl(var(--destructive)/0.1),transparent_40%),linear-gradient(225deg,hsl(var(--primary)/0.08),transparent_40%)]' },
  'deep-space': { name: '深空 Deep Space', cls: 'bg-background [background-image:radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.1)_0%,transparent_50%),radial-gradient(circle_at_70%_30%,hsl(var(--info)/0.08)_0%,transparent_40%)]' },
  'circuit-board': { name: '电路板', cls: 'bg-background [background-image:linear-gradient(45deg,transparent_48%,hsl(var(--primary)/0.05)_48%,hsl(var(--primary)/0.05)_52%,transparent_52%),linear-gradient(-45deg,transparent_48%,hsl(var(--primary)/0.05)_48%,hsl(var(--primary)/0.05)_52%,transparent_52%)] [background-size:16px_16px]' },
  'soft-noise': { name: '柔和噪点', cls: 'bg-background [background-image:url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")] [opacity:0.03]' },
  'diagonal-lines': { name: '斜线纹理', cls: 'bg-background [background-image:repeating-linear-gradient(45deg,hsl(var(--border)/0.1)_0px,hsl(var(--border)/0.1)_1px,transparent_1px,transparent_8px)]' },
  'liquid-blobs': { name: '液态云朵', cls: 'bg-background [background-image:radial-gradient(circle_at_20%_30%,hsl(var(--primary)/0.12),transparent_30%),radial-gradient(circle_at_80%_60%,hsl(var(--accent)/0.1),transparent_30%),radial-gradient(circle_at_50%_80%,hsl(var(--info)/0.08),transparent_25%)]' },
  'windows-bloom': { name: 'Windows 光晕', cls: 'bg-background [background-image:radial-gradient(circle_at_30%_20%,rgba(96,165,250,0.15)_0%,transparent_50%),radial-gradient(circle_at_70%_80%,rgba(147,197,253,0.12)_0%,transparent_40%)]' },
  'windows-classic-clouds': { name: 'Windows 经典云', cls: 'bg-background [background-image:radial-gradient(ellipse_at_20%_30%,rgba(180,200,220,0.4)_0%,transparent_50%),radial-gradient(ellipse_at_80%_70%,rgba(200,215,230,0.3)_0%,transparent_40%)]' },
  'ubuntu-jammy-gradient': { name: 'Ubuntu 渐变', cls: 'bg-background [background-image:linear-gradient(135deg,rgba(280,50,80,0.15)_0%,transparent_50%),linear-gradient(225deg,rgba(25,60,110,0.2)_0%,transparent_50%)]' },
  'gnome-adwaita-waves': { name: 'GNOME 波浪', cls: 'bg-background [background-image:radial-gradient(circle_at_40%_30%,rgba(52,152,219,0.08)_0%,transparent_30%),radial-gradient(circle_at_70%_60%,rgba(46,204,113,0.05)_0%,transparent_25%)]' },
  'kali-dragon-grid': { name: 'Kali 龙网格', cls: 'bg-background [background-image:linear-gradient(rgba(0,180,216,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(0,180,216,0.06)_1px,transparent_1px),radial-gradient(circle_at_50%_50%,rgba(0,180,216,0.08)_0%,transparent_40%)] [background-size:24px_24px]' },
  'unix-crt-scanlines': { name: 'Unix CRT 扫描线', cls: 'bg-background [background-image:repeating-linear-gradient(0deg,rgba(0,0,0,0.15)_0px,rgba(0,0,0,0.15)_1px,transparent_1px,transparent_2px)] [background-size:100%_3px]' },
  'macos-aqua-aurora': { name: 'macOS Aqua 极光', cls: 'bg-background [background-image:radial-gradient(ellipse_at_20%_10%,rgba(0,130,255,0.2)_0%,transparent_40%),radial-gradient(ellipse_at_80%_90%,rgba(120,200,255,0.15)_0%,transparent_35%),radial-gradient(ellipse_at_50%_50%,rgba(255,255,255,0.3)_0%,transparent_50%)]' },
  'macos-graphite-mist': { name: 'macOS Graphite 薄雾', cls: 'bg-background [background-image:radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.05)_0%,transparent_40%),radial-gradient(circle_at_70%_80%,rgba(100,110,120,0.08)_0%,transparent_35%),linear-gradient(180deg,transparent_0%,rgba(255,255,255,0.02)_100%)]' },
  'centos-server-grid': { name: 'CentOS 服务器网格', cls: 'bg-background [background-image:linear-gradient(rgba(100,80,180,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(100,80,180,0.08)_1px,transparent_1px),radial-gradient(circle_at_50%_50%,rgba(130,100,200,0.06)_0%,transparent_40%)] [background-size:20px_20px]' },
  'android-material-shapes': { name: 'Android Material 形状', cls: 'bg-background [background-image:radial-gradient(circle_at_25%_25%,rgba(0,200,150,0.12)_0%,transparent_30%),radial-gradient(circle_at_75%_75%,rgba(33,150,243,0.1)_0%,transparent_28%)]' },
  'material-you-blobs': { name: 'Material You 云朵', cls: 'bg-background [background-image:radial-gradient(circle_at_15%_20%,rgba(200,150,255,0.15)_0%,transparent_35%),radial-gradient(circle_at_60%_40%,rgba(255,180,150,0.12)_0%,transparent_30%),radial-gradient(circle_at_85%_70%,rgba(150,200,255,0.1)_0%,transparent_28%)]' },
  'debian-swirl-soft': { name: 'Debian 柔和漩涡', cls: 'bg-background [background-image:radial-gradient(circle_at_30%_30%,rgba(200,50,50,0.1)_0%,transparent_35%),radial-gradient(circle_at_70%_70%,rgba(150,100,100,0.08)_0%,transparent_30%)]' },
  'fedora-blue-waves': { name: 'Fedora 蓝色波浪', cls: 'bg-background [background-image:linear-gradient(135deg,rgba(30,70,150,0.15)_0%,transparent_50%),linear-gradient(225deg,rgba(60,100,180,0.1)_0%,transparent_50%)]' },
  'arch-cyber-minimal': { name: 'Arch 赛博极简', cls: 'bg-background [background-image:linear-gradient(45deg,transparent_48%,rgba(0,255,255,0.03)_48%,rgba(0,255,255,0.03)_52%,transparent_52%),radial-gradient(circle_at_80%_20%,rgba(0,255,255,0.05)_0%,transparent_25%)]' },
  'misty-color-fields': { name: '雾色田野', cls: 'bg-background [background-image:radial-gradient(circle_at_20%_40%,hsl(var(--primary)/0.08)_0%,transparent_35%),radial-gradient(circle_at_60%_20%,hsl(var(--accent)/0.06)_0%,transparent_30%),radial-gradient(circle_at_80%_70%,hsl(var(--info)/0.05)_0%,transparent_28%),radial-gradient(circle_at_40%_80%,hsl(var(--success)/0.04)_0%,transparent_25%)]' },
  'soft-glass-orbs': { name: '柔和玻璃球', cls: 'bg-background/70 backdrop-blur-sm [background-image:radial-gradient(circle_at_30%_30%,hsl(var(--primary)/0.1)_0%,transparent_40%),radial-gradient(circle_at_70%_60%,hsl(var(--accent)/0.08)_0%,transparent_35%)]' },
  'aurora-fog': { name: '极光之雾', cls: 'bg-background [background-image:linear-gradient(120deg,hsl(var(--primary)/0.05)_0%,transparent_30%),linear-gradient(240deg,hsl(var(--accent)/0.04)_0%,transparent_35%),linear-gradient(180deg,hsl(var(--info)/0.03)_0%,transparent_40%)]' },
  'layered-pastel-fog': { name: '层叠粉彩雾', cls: 'bg-background [background-image:radial-gradient(ellipse_at_20%_20%,hsl(var(--primary)/0.06)_0%,transparent_40%),radial-gradient(ellipse_at_60%_50%,hsl(var(--accent)/0.05)_0%,transparent_35%),radial-gradient(ellipse_at_80%_80%,hsl(var(--info)/0.04)_0%,transparent_30%)]' },
}
