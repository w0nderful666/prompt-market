import { useState, useMemo } from 'react'
import { ALL_FACETS } from '../data/facetedPresets'
import { SLOT_TO_DIRECTOR, directorFieldLabel } from '../data/slotToDirectorMapping'

interface Props {
  onInsert: (moduleId: string, text: string) => void
  onClose: () => void
}

export default function FacetedKeywordBrowser({ onInsert, onClose }: Props) {
  const [activeFacet, setActiveFacet] = useState('image')
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedSlots, setExpandedSlots] = useState<Record<string, boolean>>({})

  const currentFacet = useMemo(() => ALL_FACETS.find(f => f.id === activeFacet), [activeFacet])

  const toggleSlot = (slotId: string) => {
    setExpandedSlots(prev => ({ ...prev, [slotId]: !prev[slotId] }))
  }

  const handleClick = (slotId: string, label: string) => {
    const moduleId = SLOT_TO_DIRECTOR[slotId] || 'subject'
    onInsert(moduleId, label)
  }

  const filteredSlots = useMemo(() => {
    if (!currentFacet) return []
    if (!searchTerm.trim()) return currentFacet.slots
    const term = searchTerm.toLowerCase()
    return currentFacet.slots.filter(slot => {
      const slotValues = currentFacet.values.filter(v => v.slot === slot.id)
      return slotValues.some(v => v.label.toLowerCase().includes(term))
    })
  }, [currentFacet, searchTerm])

  const getSlotValues = (slotId: string) => {
    if (!currentFacet) return []
    return currentFacet.values.filter(v => v.slot === slotId)
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <h3 className="text-xs font-bold text-foreground">📖 分面关键词库</h3>
        <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground" aria-label="关闭词库">✕</button>
      </div>

      <div className="p-2">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="搜索关键词..."
          aria-label="搜索关键词"
          className="w-full rounded-md border border-border bg-muted px-2.5 py-1.5 text-xs text-foreground outline-none placeholder:text-muted-foreground mb-2"
        />
        <div className="flex gap-0.5 mb-2 flex-wrap">
          {ALL_FACETS.map(f => (
            <button key={f.id} onClick={() => setActiveFacet(f.id)}
              className={`rounded px-2 py-1 text-[10px] font-bold transition ${activeFacet === f.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
              aria-label={f.label}>
              {f.icon}
            </button>
          ))}
        </div>
      </div>

      {currentFacet && (
        <div className="max-h-[60vh] overflow-y-auto px-2 pb-2">
          {filteredSlots.length === 0 && (
            <p className="p-3 text-xs text-muted-foreground text-center">无匹配结果</p>
          )}
          {filteredSlots.map(slot => {
            const values = getSlotValues(slot.id)
            const isExpanded = expandedSlots[slot.id] !== false
            const displayValues = isExpanded ? values : values.slice(0, 6)
            const hasMore = values.length > 6

            return (
              <div key={slot.id} className="mb-2">
                <button
                  onClick={() => toggleSlot(slot.id)}
                  className="flex w-full items-center justify-between rounded px-2 py-1.5 transition hover:bg-muted"
                  aria-label={`${slot.label} ${isExpanded ? '收起' : '展开'}`}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-xs" aria-hidden="true">{slot.icon}</span>
                    <span className="text-[11px] font-bold text-foreground truncate">{slot.label}</span>
                    <span className="text-[10px] text-muted-foreground shrink-0">({values.length})</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0">{isExpanded ? '▲' : '▼'}</span>
                </button>
                <div className="flex flex-wrap gap-1 px-2">
                  {displayValues.map(v => (
                    <button key={v.id} onClick={() => handleClick(slot.id, v.label)}
                      className="rounded-full border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary active:scale-95"
                      title={`填入到: ${directorFieldLabel(SLOT_TO_DIRECTOR[slot.id] || 'subject')}`}
                      aria-label={`${v.label} 填入到 ${directorFieldLabel(SLOT_TO_DIRECTOR[slot.id] || 'subject')}`}>
                      {v.label}
                    </button>
                  ))}
                  {hasMore && (
                    <button onClick={() => toggleSlot(slot.id)}
                      className="text-[10px] text-primary font-bold px-2 py-0.5">
                      {isExpanded ? '收起' : `+${values.length - 6} 更多`}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="border-t border-border px-3 py-2">
        <p className="text-[10px] text-muted-foreground">点击关键词填入对应模块 · 共 {ALL_FACETS.reduce((acc, f) => acc + f.values.length, 0)} 个词</p>
      </div>
    </div>
  )
}
