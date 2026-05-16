import { useState, useMemo, useCallback, useEffect } from 'react'
import modules from '../data/directorModules.json'
import presetsData from '../data/presets.json'
import DirectorCard from './DirectorCard'
import ConflictPanel from './ConflictPanel'
import FacetedKeywordBrowser from './FacetedKeywordBrowser'
import { useDirector } from '../context/DirectorContext'

interface GroupDef {
  id: string; label: string; icon: string; sublabel?: string; modules: typeof modules
}

const moduleGroups: GroupDef[] = [
  { id: 'foundation', label: '基础设定', icon: '📦', sublabel: '主体 / 场景 / 模型', modules: modules.filter(m => m.group === 'foundation') },
  { id: 'visual', label: '视觉参数', icon: '🎨', sublabel: '构图 / 光线 / 质感', modules: modules.filter(m => m.group === 'visual') },
  { id: 'subject', label: '人物细节', icon: '👤', sublabel: '表情 / 妆容 / 服装', modules: modules.filter(m => m.group === 'subject') },
  { id: 'atmosphere', label: '氛围背景', icon: '✨', sublabel: '背景 / 氛围 / Caption', modules: modules.filter(m => m.group === 'atmosphere') },
  { id: 'control', label: '控制指令', icon: '🎯', sublabel: '必须保留 / 避免 / 负面', modules: modules.filter(m => m.group === 'control') },
]

function createInitialDirector(): Record<string, string> {
  const d: Record<string, string> = {}
  modules.forEach(m => { d[m.id] = '' })
  d.model = 'GPT Image'
  return d
}
const getInitialDirector = () => createInitialDirector()

function getPresetsForModule(moduleId: string) {
  const entry = (presetsData as Record<string, { id: string; zh: string }[]>)[moduleId]
  return entry || []
}

export default function DirectorEditor() {
  const [director, setDirector] = useState<Record<string, string>>(getInitialDirector)
  const [locks, setLocks] = useState<Record<string, boolean>>({})
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({ foundation: true, visual: true, subject: true, atmosphere: true, control: true })
  const [outputFormat, setOutputFormat] = useState('director')
  const [conflicts, setConflicts] = useState<any[]>([])
  const [showKeywordLib, setShowKeywordLib] = useState(false)
  const [loadedFromPresets, setLoadedFromPresets] = useState(false)
  const { directorData, setDirectorField, setDirectorData, clearDirector } = useDirector()

  const filledCount = useMemo(() => modules.filter(m => director[m.id]?.trim()).length, [director])
  const allLocked = useMemo(() => modules.every(m => locks[m.id]), [locks])

  useEffect(() => {
    const hasData = Object.values(directorData).some(v => v && v.trim())
    if (hasData && !loadedFromPresets) {
      setDirector(prev => {
        const merged = { ...prev }
        let changed = false
        for (const [key, val] of Object.entries(directorData)) {
          if (val && val.trim() && modules.some(m => m.id === key)) {
            merged[key] = val
            changed = true
          }
        }
        if (changed) setLoadedFromPresets(true)
        return merged
      })
    }
  }, [directorData, loadedFromPresets])

  const outputFormats = [
    { id: 'director', label: 'Director' },
    { id: 'midjourney', label: 'Midjourney' },
    { id: 'gpt-image', label: 'GPT Image' },
  ]

  const liveText = useMemo(() => {
    if (outputFormat === 'midjourney') {
      return `${director.subject || ''} ${director.scene || ''} ${director.composition || ''} ${director.expression || ''} ${director.face || ''} ${director.hair || ''} ${director.body || ''} ${director.clothing || ''} ${director.lighting || ''} ${director.camera || ''} --ar ${director.ratio || '3:4'} --v 6`
    }
    return Object.entries(director).filter(([k, v]) => v && k !== 'model' && k !== 'ratio').map(([k, v]) => `${v}`).join('，')
  }, [director, outputFormat])

  const handleModuleChange = useCallback((id: string, value: string) => {
    setDirector(prev => ({ ...prev, [id]: value }))
    setDirectorField(id, value)
  }, [setDirectorField])

  const toggleLock = useCallback((id: string) => {
    setLocks(prev => ({ ...prev, [id]: !prev[id] }))
  }, [])

  const clearModule = useCallback((id: string) => {
    setDirector(prev => ({ ...prev, [id]: '' }))
    setDirectorField(id, '')
  }, [setDirectorField])

  const toggleGroup = (id: string) => {
    setExpandedGroups(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const clearAll = () => {
    setDirector(getInitialDirector())
    setConflicts([])
    setLoadedFromPresets(false)
    clearDirector()
  }

  const toggleAllLocks = () => {
    const next = !allLocked
    const newLocks: Record<string, boolean> = {}
    modules.forEach(m => { newLocks[m.id] = next })
    setLocks(newLocks)
  }

  const expandAllGroups = () => {
    const allExpanded = Object.values(expandedGroups).every(Boolean)
    const newExpanded: Record<string, boolean> = {}
    moduleGroups.forEach(g => { newExpanded[g.id] = !allExpanded })
    setExpandedGroups(newExpanded)
  }

  const randomGenerate = () => {
    const newDirector = getInitialDirector()
    modules.forEach(m => {
      const presets = getPresetsForModule(m.id)
      if (presets.length > 0) {
        newDirector[m.id] = presets[Math.floor(Math.random() * presets.length)].zh
      }
    })
    setDirector(newDirector)
    setDirectorData(newDirector)
  }

  const detectConflictsNow = () => {
    const results: any[] = []
    const avoid = director.avoid || ''
    const mustKeep = director.mustKeep || ''
    if (avoid && mustKeep) {
      const avoidWords = avoid.split(/[，,、]/).map(s => s.trim()).filter(Boolean)
      const keepWords = mustKeep.split(/[，,、]/).map(s => s.trim()).filter(Boolean)
      for (const a of avoidWords) {
        for (const k of keepWords) {
          if (a.includes(k) || k.includes(a)) {
            results.push({ type: 'conflict', word1: a, word2: k, message: `"${a}" 与 "${k}" 可能冲突` })
          }
        }
      }
    }
    setConflicts(results)
  }

  const copyOutput = async (text: string) => {
    try { await navigator.clipboard.writeText(text) } catch { /* ignore */ }
  }

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(director, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'director-config.json'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="director-editor">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3 mb-4 border-border bg-card/70 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-black text-foreground">🎬 结构化编辑器</h2>
          <span className="rounded-full px-2 py-0.5 text-xs font-bold bg-primary/10 text-primary">{filledCount}/{modules.length} 模块</span>
          {loadedFromPresets && (
            <span className="rounded-full px-2 py-0.5 text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              ✅ 已加载预设
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="toolbar-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-muted text-muted-foreground hover:bg-muted/80 transition" onClick={exportJson}>📤 导出</button>
          <button className="toolbar-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-muted text-muted-foreground hover:bg-muted/80 transition" onClick={() => setShowKeywordLib(!showKeywordLib)}>{showKeywordLib ? '📖 关闭词库' : '📖 词库'}</button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-4">
            <div className="rounded-lg border bg-card p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">📝 提示词预览</h3>
                <div className="flex items-center gap-1">
                  {outputFormats.map(fmt => (
                    <button key={fmt.id} onClick={() => setOutputFormat(fmt.id)}
                      className={`rounded px-2.5 py-1 text-xs font-bold transition active:scale-95 ${
                        outputFormat === fmt.id ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}>{fmt.label}</button>
                  ))}
                  <button onClick={() => copyOutput(liveText)} className="ml-1 rounded bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary hover:bg-primary/20">📋 复制</button>
                </div>
              </div>
              <textarea value={liveText} readOnly
                className="w-full resize-none rounded-lg border border-border bg-muted p-3 text-sm leading-relaxed text-foreground outline-none"
                rows={5} placeholder="选择预设词或输入内容，提示词会实时生成..." />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 rounded-lg border px-4 py-3 mb-4 border-border bg-card/70 backdrop-blur-sm">
            <button className="action-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-muted text-muted-foreground hover:bg-muted/80 transition" onClick={clearAll}>🗑️ 清空全部</button>
            <button className="action-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-muted text-muted-foreground hover:bg-muted/80 transition" onClick={toggleAllLocks}>{allLocked ? '🔓 全部解锁' : '🔒 全部锁定'}</button>
            <button className="action-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-muted text-muted-foreground hover:bg-muted/80 transition" onClick={randomGenerate}>🎲 随机生成</button>
            <button className="action-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-muted text-muted-foreground hover:bg-muted/80 transition" onClick={detectConflictsNow}>⚠️ 检测冲突</button>
            <button className="action-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-muted text-muted-foreground hover:bg-muted/80 transition" onClick={expandAllGroups}>
              {Object.values(expandedGroups).every(Boolean) ? '收起全部组' : '展开全部组'}
            </button>
          </div>

          {conflicts.length > 0 && <ConflictPanel conflicts={conflicts} onDismiss={() => setConflicts([])} onRemoveWord={(w: string) => {
            setDirector(prev => {
              const next = { ...prev }
              for (const key of Object.keys(next)) {
                if (next[key].includes(w)) {
                  next[key] = next[key].split(/[，,、]/).filter((part: string) => part.trim() !== w).join('，')
                }
              }
              return next
            })
          }} />}

          <div className="space-y-4 mb-4">
            {moduleGroups.map(group => (
              <div key={group.id} className="rounded-lg border overflow-hidden border-border bg-card">
                <button className="flex w-full items-center justify-between px-4 py-3 transition hover:bg-muted" onClick={() => toggleGroup(group.id)}>
                  <div className="flex items-center gap-2">
                    <span className="text-base">{group.icon}</span>
                    <span className="text-sm font-bold text-foreground">{group.label}</span>
                    <span className="text-xs text-muted-foreground">{group.sublabel}</span>
                    <span className="rounded-full px-1.5 py-0.5 text-xs font-bold bg-muted text-muted-foreground">
                      {group.modules.filter(m => director[m.id]?.trim()).length}/{group.modules.length}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{expandedGroups[group.id] ? '▼' : '▶'}</span>
                </button>
                {expandedGroups[group.id] && (
                  <div className="px-4 pb-4">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {group.modules.map(mod => (
                        <DirectorCard key={mod.id}
                          value={director[mod.id] || ''}
                          title={mod.zh}
                          icon={mod.icon}
                          placeholder={mod.placeholder}
                          locked={locks[mod.id]}
                          presets={getPresetsForModule(mod.id)}
                          moduleId={mod.id}
                          onChange={(v) => handleModuleChange(mod.id, v)}
                          onToggleLock={() => toggleLock(mod.id)}
                          onClear={() => clearModule(mod.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {showKeywordLib && (
          <div className="w-72 shrink-0">
            <div className="sticky top-20">
              <FacetedKeywordBrowser
                onInsert={(moduleId, text) => {
                  handleModuleChange(moduleId, (director[moduleId] || '') + (director[moduleId] ? '，' : '') + text)
                }}
                onClose={() => setShowKeywordLib(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
