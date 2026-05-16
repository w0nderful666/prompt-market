import { useTheme } from '../context/ThemeContext'
import { useState, useEffect } from 'react'
import { THEMES, THEME_LIST } from '../lib/themes'

const backgroundStyles: Record<string, { name: string }> = {
  solid: { name: 'Solid' },
  'soft-gradient': { name: 'Soft Gradient' },
  'radial-glow': { name: 'Radial Glow' },
  'grid-surface': { name: 'Grid Surface' },
  'noise-glass': { name: 'Noise Glass' },
  aurora: { name: 'Aurora' },
  'terminal-matrix': { name: 'Terminal Matrix' },
  'mesh-gradient': { name: 'Mesh Gradient' },
  'frosted-panel': { name: 'Frosted Panel' },
  starfield: { name: 'Starfield' },
}

export default function SettingsSection() {
  const { themeId, mode, bgStyle, setTheme, setMode, toggleMode, setBgStyle } = useTheme()
  const [showAllThemes, setShowAllThemes] = useState(false)
  const [radius, setRadius] = useState(12)
  const [density, setDensity] = useState(1)
  const [fontScale, setFontScale] = useState(100)
  const [motionLevel, setMotionLevel] = useState(2)

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--pm-radius', `${radius}px`)
    root.style.setProperty('--pm-density', String(density))
    root.style.setProperty('--pm-font-scale', `${fontScale}%`)
    root.style.setProperty('--pm-motion-level', String(motionLevel))
    const intervals = [0, 150, 300, 500, 800]
    const dur = intervals[motionLevel] ?? 300
    root.style.setProperty('--pm-transition-dur', `${dur}ms`)
  }, [radius, density, fontScale, motionLevel])

  const visibleThemes = showAllThemes ? THEME_LIST : THEME_LIST.slice(0, 8)
  const theme = THEMES[themeId]

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-3">
        <span className="text-2xl">⚙️</span>
        <div>
          <h1 className="text-lg font-black text-foreground">设置</h1>
          <p className="text-xs text-muted-foreground">自定义应用外观和行为</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🎨</span>
            <h2 className="text-sm font-bold text-foreground">主题</h2>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">{themeId}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {visibleThemes.map(t => {
              const tokens = theme && themeId === t.id ? theme.light : (THEMES[t.id]?.light || THEMES['material-you']!.light)
              const colors = [tokens.primary, tokens.accent, tokens.secondary, tokens.muted].map(hsl => `hsl(${hsl})`)
              return (
                <button key={t.id} onClick={() => setTheme(t.id)}
                  className={`group relative overflow-hidden rounded-lg border p-2 text-left transition-all hover:shadow-md ${
                    themeId === t.id
                      ? 'border-primary bg-primary/10 ring-1 ring-primary'
                      : 'border-border/50 bg-card hover:border-primary/30 hover:bg-primary/5'
                  }`}
                  aria-label={`主题: ${t.name}`}>
                  <div className="flex gap-0.5 mb-1.5">
                    {colors.slice(0, 4).map((c, i) => (
                      <div key={i} className="h-3 flex-1 rounded-sm" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                  <span className="text-[10px] font-medium text-foreground/80 truncate block">{t.name}</span>
                </button>
              )
            })}
          </div>

          {THEME_LIST.length > 8 && (
            <button onClick={() => setShowAllThemes(!showAllThemes)}
              className="mt-2 w-full rounded-lg bg-muted py-1.5 text-xs text-muted-foreground hover:bg-muted/80 transition">
              {showAllThemes ? '收起' : `显示全部 (${THEME_LIST.length} 个)`}
            </button>
          )}
        </div>

        <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🌓</span>
            <h2 className="text-sm font-bold text-foreground">显示模式</h2>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">{mode}</span>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setMode('light')}
              className={`flex-1 rounded-lg border py-3 text-sm font-bold transition ${
                mode === 'light' ? 'border-primary bg-primary text-primary-foreground shadow-sm' : 'border-border/50 bg-card text-foreground hover:bg-muted/50'
              }`}
              aria-label="浅色模式">
              <span className="block text-lg mb-1">☀️</span>
              浅色
            </button>
            <button onClick={() => setMode('dark')}
              className={`flex-1 rounded-lg border py-3 text-sm font-bold transition ${
                mode === 'dark' ? 'border-primary bg-primary text-primary-foreground shadow-sm' : 'border-border/50 bg-card text-foreground hover:bg-muted/50'
              }`}
              aria-label="深色模式">
              <span className="block text-lg mb-1">🌙</span>
              深色
            </button>
            <button onClick={toggleMode}
              className={`flex-1 rounded-lg border py-3 text-sm font-bold transition ${
                'border-border/50 bg-card text-foreground hover:bg-muted/50'
              }`}
              aria-label="跟随系统">
              <span className="block text-lg mb-1">💻</span>
              跟随系统
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-5 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🖼️</span>
            <h2 className="text-sm font-bold text-foreground">背景样式</h2>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">{backgroundStyles[bgStyle]?.name || bgStyle}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {Object.entries(backgroundStyles).map(([id, { name }]) => (
              <button key={id} onClick={() => setBgStyle(id)}
                className={`rounded-lg border p-3 text-center text-xs font-medium transition-all hover:shadow-md ${
                  bgStyle === id
                    ? 'border-primary bg-primary/10 ring-1 ring-primary text-foreground'
                    : 'border-border/50 bg-card text-muted-foreground hover:bg-muted/50'
                }`}
                aria-label={`背景: ${name}`}>
                <span className="block text-lg mb-1" aria-hidden="true">
                  {id === 'solid' ? '🎨' : id === 'soft-gradient' ? '🌈' : id === 'radial-glow' ? '💫' : id === 'grid-surface' ? '🔲' : id === 'noise-glass' ? '🧊' : id === 'aurora' ? '🌌' : id === 'terminal-matrix' ? '💻' : id === 'mesh-gradient' ? '🔮' : id === 'frosted-panel' ? '❄️' : id === 'starfield' ? '⭐' : '🎨'}
                </span>
                {name}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">📐</span>
            <h2 className="text-sm font-bold text-foreground">界面布局</h2>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-muted-foreground">圆角大小</span>
                <span className="text-xs font-bold text-primary">{radius}px</span>
              </div>
              <input type="range" min="0" max="24" value={radius} onChange={e => setRadius(Number(e.target.value))}
                className="w-full h-1.5 rounded-full bg-muted accent-primary appearance-none cursor-pointer"
                aria-label="圆角大小" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-muted-foreground">内容密度</span>
                <span className="text-xs font-bold text-primary">{['紧凑', '标准', '宽松'][density]}</span>
              </div>
              <input type="range" min="0" max="2" value={density} onChange={e => setDensity(Number(e.target.value))}
                className="w-full h-1.5 rounded-full bg-muted accent-primary appearance-none cursor-pointer"
                aria-label="内容密度" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-muted-foreground">字号缩放</span>
                <span className="text-xs font-bold text-primary">{fontScale}%</span>
              </div>
              <input type="range" min="75" max="150" value={fontScale} onChange={e => setFontScale(Number(e.target.value))}
                className="w-full h-1.5 rounded-full bg-muted accent-primary appearance-none cursor-pointer"
                aria-label="字号缩放" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">⚡</span>
            <h2 className="text-sm font-bold text-foreground">动效</h2>
          </div>

          <div className="space-y-3">
            <div className="flex gap-2">
              {['关闭', '柔和', '标准', '丰富', '电影'].map((label, i) => (
                <button key={i} onClick={() => setMotionLevel(i)}
                  className={`flex-1 rounded-lg border py-2 text-xs font-medium transition ${
                    motionLevel === i ? 'border-primary bg-primary/10 text-primary' : 'border-border/50 text-muted-foreground hover:bg-muted/50'
                  }`}
                  aria-label={`动效: ${label}`}>
                  {label}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>动效强度: {['Off', 'Subtle', 'Normal', 'Expressive', 'Cinematic'][motionLevel]}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border/30 bg-card/30 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>🎯 当前配置：</span>
            <span className="rounded bg-muted px-2 py-0.5 font-medium text-foreground">{themeId}</span>
            <span className="rounded bg-muted px-2 py-0.5 font-medium text-foreground">{mode}</span>
            <span className="rounded bg-muted px-2 py-0.5 font-medium text-foreground">{backgroundStyles[bgStyle]?.name || bgStyle}</span>
          </div>
          <div className="text-[10px] text-muted-foreground">Prompt Director Studio v0.1.0</div>
        </div>
      </div>
    </div>
  )
}
