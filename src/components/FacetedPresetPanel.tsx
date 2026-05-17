import { useState, useMemo, useCallback } from 'react'
import { ALL_FACETS } from '../data/facetedPresets'
import type { FacetValue } from '../data/facetedPresets'
import { useDirector } from '../context/DirectorContext'
import { usePromptState } from '../context/PromptStateContext'
import { detectFacetConflicts, buildFacetedPrompt, getSelectionSummary, getSelectedCount } from '../utils/facetedBuilder'
import type { FacetConflict } from '../utils/facetedBuilder'
import { copyToClipboard } from '../utils/clipboard'

type Selections = Record<string, string | string[]>

function getAllValues(): FacetValue[] {
  return ALL_FACETS.flatMap(f => f.values || [])
}

const SOURCE_LABELS: Record<string, string> = {
  director: '来自快速生成模板',
  advanced: '手动精细微调',
  variant: '已应用动作变体',
  mixed: '快速生成 + 手动微调',
}

export default function FacetedPresetPanel({ onNavigateToQuick }: { onNavigateToQuick?: () => void }) {
  const { sharedFacetSelections, setSharedFacetSelections, syncFromPresets } = useDirector()
  const promptState = usePromptState()
  const [activeFacet, setActiveFacet] = useState<string>('image')
  const [conflicts, setConflicts] = useState<FacetConflict[]>([])
  const [copied, setCopied] = useState(false)

  const allValues = useMemo(() => getAllValues(), [])
  const counts = useMemo(() => getSelectedCount(sharedFacetSelections), [sharedFacetSelections])
  const prompt = useMemo(() => buildFacetedPrompt(sharedFacetSelections), [sharedFacetSelections])
  const summary = useMemo(() => getSelectionSummary(sharedFacetSelections), [sharedFacetSelections])
  const currentFacet = useMemo(() => ALL_FACETS.find(f => f.id === activeFacet), [activeFacet])
  const hasBridgeData = useMemo(() => Object.keys(sharedFacetSelections).length > 0, [sharedFacetSelections])

  const handleToggle = useCallback((slotId: string, valueId: string) => {
    const slot = ALL_FACETS.flatMap(f => f.slots).find(s => s.id === slotId)
    if (!slot) return
    setSharedFacetSelections(prev => {
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
  }, [setSharedFacetSelections])

  const clearAll = useCallback(() => {
    setSharedFacetSelections({})
    setConflicts([])
  }, [setSharedFacetSelections])

  const runConflictCheck = useCallback(() => {
    setConflicts(detectFacetConflicts(sharedFacetSelections))
  }, [sharedFacetSelections])

  const copyPrompt = useCallback(async () => {
    const ok = await copyToClipboard(prompt)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [prompt])

  const isSelected = (slotId: string, valueId: string) => {
    const val = sharedFacetSelections[slotId]
    if (typeof val === 'string') return val === valueId
    if (Array.isArray(val)) return val.includes(valueId)
    return false
  }

  return (
    <div className="faceted-preset-panel">
      {/* Info bar */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 mb-4 dark:border-amber-700 dark:bg-amber-900/20">
        <div className="flex items-center gap-2">
          <span className="text-sm">🔧</span>
          <div>
            <h3 className="text-xs font-bold text-amber-800 dark:text-amber-300">高级编辑模式</h3>
            <p className="text-[10px] text-amber-600 dark:text-amber-400">
              {SOURCE_LABELS[promptState.state.source] || '手动精细微调'}
              {promptState.state.variants.appliedVariantId ? ' · 已应用动作变体' : ''}
            </p>
          </div>
          {onNavigateToQuick && (
            <button onClick={() => { syncFromPresets(); onNavigateToQuick(); }}
              className="ml-auto shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold bg-amber-200 text-amber-800 hover:bg-amber-300 transition dark:bg-amber-800 dark:text-amber-200">
              🎬 返回快速生成
            </button>
          )}
        </div>
      </div>

      {/* Controls bar */}
      <div className="flex items-center justify-between gap-3 rounded-lg border px-4 py-3 mb-4 border-border bg-card/70 backdrop-blur-sm">
        <div>
          <h2 className="text-sm font-black text-foreground">🔧 分面精细编辑</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{counts.filled}/{counts.total} 槽位已选 · {summary || '未选择任何预设'}{hasBridgeData ? ' · 🔗 已同步模板' : ''}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={clearAll} className="rounded-lg px-3 py-1.5 text-xs font-bold bg-muted text-muted-foreground hover:bg-muted/80 transition">🗑️ 清空</button>
          <button onClick={runConflictCheck} className="rounded-lg px-3 py-1.5 text-xs font-bold bg-muted text-muted-foreground hover:bg-muted/80 transition">⚠️ 检测冲突</button>
        </div>
      </div>

      {/* Prompt preview */}
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
        </div>
      </div>

      {/* Conflicts */}
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

      {/* Facets */}
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
              const slotValues = allValues.filter(v => v.slot === slot.id)
              const currentVal = sharedFacetSelections[slot.id]
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
  )
}
