import { useState, useMemo, useCallback } from 'react'
import { ALL_FACETS, TEMPLATES, VALUE_MAP } from '../data/facetedPresets'
import type { TemplatePreset } from '../data/facetedPresets'
import { detectFacetConflicts, buildFacetedPrompt, buildFacetedMetadata, getSelectionSummary, getSelectedCount } from '../utils/facetedBuilder'
import type { FacetConflict } from '../utils/facetedBuilder'
import { buildDirectorFromPresets } from '../utils/presetsToDirector'
import { useDirector } from '../context/DirectorContext'

type Selections = Record<string, string | string[]>

function templateToSelections(t: TemplatePreset): Selections {
  return { ...t.selections }
}

export default function FacetedPresetPanel({ onNavigateToDirector }: { onNavigateToDirector?: () => void }) {
  const [selections, setSelections] = useState<Selections>({})
  const [activeFacet, setActiveFacet] = useState<string>('image')
  const [conflicts, setConflicts] = useState<FacetConflict[]>([])
  const [copied, setCopied] = useState(false)
  const [published, setPublished] = useState(false)
  const { setDirectorData } = useDirector()

  const counts = useMemo(() => getSelectedCount(selections), [selections])
  const prompt = useMemo(() => buildFacetedPrompt(selections), [selections])
  const summary = useMemo(() => getSelectionSummary(selections), [selections])
  const metadata = useMemo(() => buildFacetedMetadata(selections), [selections])
  const currentFacet = useMemo(() => ALL_FACETS.find(f => f.id === activeFacet), [activeFacet])

  const hasSelections = useMemo(() => counts.filled > 0, [counts.filled])

  const handleToggle = useCallback((slotId: string, valueId: string) => {
    setSelections(prev => {
      const slot = ALL_FACETS.flatMap(f => f.slots).find(s => s.id === slotId)
      if (!slot) return prev
      const next = { ...prev }
      if (slot.mode === 'single') {
        next[slotId] = next[slotId] === valueId ? '' : valueId
      } else {
        const current = (Array.isArray(next[slotId]) ? next[slotId] : []) as string[]
        if (current.includes(valueId)) {
          next[slotId] = current.filter(v => v !== valueId)
        } else {
          next[slotId] = [...current, valueId]
        }
      }
      return next
    })
  }, [])

  const handleTemplate = useCallback((t: TemplatePreset) => {
    setSelections(templateToSelections(t))
    setPublished(false)
  }, [])

  const clearAll = useCallback(() => {
    setSelections({})
    setConflicts([])
    setPublished(false)
  }, [])

  const runConflictCheck = useCallback(() => {
    setConflicts(detectFacetConflicts(selections))
  }, [selections])

  const copyPrompt = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* ignore */ }
  }, [prompt])

  const exportMetadata = useCallback(() => {
    const blob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'faceted-metadata.json'; a.click()
    URL.revokeObjectURL(url)
  }, [metadata])

  const publishToDirector = useCallback(() => {
    const director = buildDirectorFromPresets(selections)
    setDirectorData(director)
    setPublished(true)
    setTimeout(() => setPublished(false), 3000)
    onNavigateToDirector?.()
  }, [selections, setDirectorData, onNavigateToDirector])

  const randomGenerate = useCallback(() => {
    const newSelections: Selections = {}
    const allSlots = ALL_FACETS.flatMap(f => f.slots)
    for (const slot of allSlots) {
      const slotValues = ALL_FACETS.flatMap(f => f.values).filter(v => v.slot === slot.id)
      if (slotValues.length === 0) continue
      if (slot.mode === 'single') {
        newSelections[slot.id] = slotValues[Math.floor(Math.random() * slotValues.length)].id
      } else {
        const count = slot.maxSelect ? Math.min(1 + Math.floor(Math.random() * slot.maxSelect), slotValues.length) : Math.min(2, slotValues.length)
        const shuffled = [...slotValues].sort(() => Math.random() - 0.5).slice(0, count)
        newSelections[slot.id] = shuffled.map(v => v.id)
      }
    }
    setSelections(newSelections)
    setPublished(false)
  }, [])

  const isSelected = (slotId: string, valueId: string) => {
    const val = selections[slotId]
    if (typeof val === 'string') return val === valueId
    if (Array.isArray(val)) return val.includes(valueId)
    return false
  }

  return (
    <div className="faceted-preset-panel">
      <div className="flex items-center justify-between gap-3 rounded-lg border px-4 py-3 mb-4 border-border bg-card/70 backdrop-blur-sm">
        <div>
          <h2 className="text-sm font-black text-foreground">🏷️ 分面预设系统</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{counts.filled}/{counts.total} 槽位已选 · {summary || '未选择任何预设'}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={randomGenerate} className="rounded-lg px-3 py-1.5 text-xs font-bold bg-muted text-muted-foreground hover:bg-muted/80 transition">🎲 随机</button>
          <button onClick={publishToDirector} disabled={!hasSelections}
            className="rounded-lg px-3 py-1.5 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition disabled:opacity-40 disabled:cursor-not-allowed"
            title="将当前选择发布到 Director 编辑器中">
            {published ? '✅ 已发布 → 去 Director' : '🚀 发布到 Director'}
          </button>
          <button onClick={clearAll} className="rounded-lg px-3 py-1.5 text-xs font-bold bg-muted text-muted-foreground hover:bg-muted/80 transition">🗑️ 清空</button>
          <button onClick={runConflictCheck} className="rounded-lg px-3 py-1.5 text-xs font-bold bg-muted text-muted-foreground hover:bg-muted/80 transition">⚠️ 检测冲突</button>
        </div>
      </div>

      <div className="mb-4 rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-foreground">📝 输出预览</h3>
          <div className="flex gap-2">
            <span className="text-xs text-muted-foreground">{counts.filled > 0 ? `${counts.filled} 项已选` : '未选择'}</span>
          </div>
        </div>
        <textarea value={prompt} readOnly
          className="w-full resize-none rounded-lg border border-border bg-muted p-3 text-sm leading-relaxed text-foreground outline-none"
          rows={4} placeholder="选择预设值后生成提示词..." />
        <div className="mt-2 flex gap-2">
          <button onClick={copyPrompt} className="rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground transition hover:bg-primary/90 active:scale-[0.97]">
            {copied ? '✅ 已复制' : '📋 复制'}
          </button>
          <button onClick={clearAll} className="rounded-lg bg-muted px-4 py-1.5 text-xs font-bold text-muted-foreground hover:bg-muted/80 transition">
            🗑️ 清空
          </button>
          <button onClick={exportMetadata} className="rounded-lg bg-muted px-3 py-1.5 text-xs font-bold text-muted-foreground hover:bg-muted/80 transition">
            📤 导出 JSON
          </button>
        </div>
      </div>

      {conflicts.length > 0 && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-900/20">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-bold text-amber-800 dark:text-amber-300">⚠️ {conflicts.length} 个冲突</h3>
            <button onClick={() => setConflicts([])} className="text-xs text-amber-600 hover:text-amber-800 dark:text-amber-400">✕ 关闭</button>
          </div>
          <div className="space-y-1">
            {conflicts.map((c, i) => (
              <div key={i} className="flex items-center gap-2 rounded bg-amber-100/50 px-3 py-1.5 text-xs dark:bg-amber-800/20">
                <span className={`rounded px-1.5 py-0.5 font-bold ${c.type === 'hard' ? 'bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-200' : 'bg-amber-200 text-amber-800 dark:bg-amber-700 dark:text-amber-200'}`}>{c.type === 'hard' ? '禁止' : '警告'}</span>
                <span className="text-amber-700 dark:text-amber-300">{c.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <div>
          <div className="flex gap-1 mb-4 flex-wrap">
            {ALL_FACETS.map(f => (
              <button key={f.id} onClick={() => setActiveFacet(f.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  activeFacet === f.id ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted'
                }`}>
                {f.icon} {f.label}
              </button>
            ))}
          </div>

          {currentFacet && (
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-lg">{currentFacet.icon}</span>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{currentFacet.label}</h3>
                  <p className="text-xs text-muted-foreground">{currentFacet.description}</p>
                </div>
              </div>
              <div className="space-y-4">
                {currentFacet.slots.map(slot => {
                  const slotValues = currentFacet.values.filter(v => v.slot === slot.id)
                  const currentVal = selections[slot.id]
                  return (
                    <div key={slot.id}>
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="text-sm">{slot.icon}</span>
                        <span className="text-xs font-bold text-foreground">{slot.label}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {slot.mode === 'single' ? '(单选)' : `(多选${slot.maxSelect ? `, 最多${slot.maxSelect}` : ''})`}
                        </span>
                        {slot.mode === 'single' && currentVal && (
                          <span className="ml-auto text-xs text-primary font-bold">已选</span>
                        )}
                        {slot.mode === 'multi' && Array.isArray(currentVal) && currentVal.length > 0 && (
                          <span className="ml-auto text-xs text-primary font-bold">{currentVal.length}项</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {slotValues.map(v => {
                          const selected = isSelected(slot.id, v.id)
                          return (
                            <button key={v.id} onClick={() => handleToggle(slot.id, v.id)}
                              className={`rounded-full border px-2.5 py-1 text-xs font-medium transition active:scale-95 ${
                                selected
                                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                                  : 'border-border text-muted-foreground hover:border-primary/30 hover:bg-primary/5 hover:text-primary'
                              }`}>
                              {v.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-xs font-bold text-foreground mb-3">📋 模板</h3>
            <div className="space-y-2">
              {TEMPLATES.map(t => (
                <button key={t.id} onClick={() => handleTemplate(t)}
                  className="w-full rounded-lg border border-border p-3 text-left transition hover:border-primary/30 hover:bg-primary/5 text-xs">
                  <div className="font-bold text-foreground">{t.name}</div>
                  <div className="text-muted-foreground mt-0.5">{t.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-dashed border-primary/30 bg-primary/5 p-3">
            <p className="text-xs text-muted-foreground mb-1">💡 选择预设后点击「发布到 Director」</p>
            <p className="text-xs text-muted-foreground">预设词将自动分配到 Director 的对应模块中</p>
          </div>
        </div>
      </div>
    </div>
  )
}
