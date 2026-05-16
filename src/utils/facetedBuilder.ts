import { FACET_MAP, VALUE_MAP, SLOT_MAP, CONFLICT_RULES, ALL_FACETS } from '../data/facetedPresets'
import type { ConflictRule } from '../data/facetedPresets'

export interface FacetConflict {
  type: 'hard' | 'soft'
  rule: ConflictRule
  message: string
  slot: string
}

export function detectFacetConflicts(selections: Record<string, string | string[]>): FacetConflict[] {
  const results: FacetConflict[] = []

  for (const rule of CONFLICT_RULES) {
    const msg = rule.check(selections)
    if (msg) {
      results.push({ type: rule.type, rule, message: msg, slot: '' })
    }
  }

  for (const facet of ALL_FACETS) {
    for (const slot of facet.slots) {
      const val = selections[slot.id]
      if (!val) continue
      if (slot.mode === 'single' && val as string) {
        const valueObj = VALUE_MAP[val as string]
        if (valueObj?.conflicts) {
          for (const conflictId of valueObj.conflicts) {
            const conflictVal = VALUE_MAP[conflictId]
            if (!conflictVal) continue
            const conflictSlotSelections = selections[conflictVal.slot]
            if (!conflictSlotSelections) continue
            if (typeof conflictSlotSelections === 'string') {
              if (conflictSlotSelections === conflictId) {
                results.push({ type: 'hard', rule: { type: 'hard', description: `"${valueObj.label}" 与 "${conflictVal.label}" 冲突`, check: () => null }, message: `"${valueObj.label}" 与 "${conflictVal.label}" 冲突`, slot: slot.id })
              }
            } else if (Array.isArray(conflictSlotSelections)) {
              if (conflictSlotSelections.includes(conflictId)) {
                results.push({ type: 'hard', rule: { type: 'hard', description: `"${valueObj.label}" 与 "${conflictVal.label}" 冲突`, check: () => null }, message: `"${valueObj.label}" 与 "${conflictVal.label}" 冲突`, slot: slot.id })
              }
            }
          }
        }
      }
      if (slot.mode === 'multi' && Array.isArray(val)) {
        if (slot.maxSelect && val.length > slot.maxSelect) {
          results.push({ type: 'soft', rule: { type: 'soft', description: `${slot.label} 最多选 ${slot.maxSelect} 项`, check: () => null }, message: `${slot.label} 已选 ${val.length} 项，上限 ${slot.maxSelect}`, slot: slot.id })
        }
      }
    }
  }

  return results
}

export function buildFacetedPrompt(selections: Record<string, string | string[]>): string {
  const parts: string[] = []

  const slotOrder = ALL_FACETS.flatMap(f => f.slots.map(s => s.id))

  const seen = new Set<string>()

  for (const slotId of slotOrder) {
    const val = selections[slotId]
    if (!val) continue
    const slot = SLOT_MAP[slotId]
    if (!slot) continue
    const facet = ALL_FACETS.find(f => f.id === slot.parentFacet)
    if (!facet) continue

    if (slot.mode === 'single') {
      const valueObj = VALUE_MAP[val as string]
      if (valueObj) {
        const promptText = valueObj.exportPrompt || valueObj.label
        if (!seen.has(promptText)) {
          parts.push(promptText)
          seen.add(promptText)
        }
      }
    } else if (slot.mode === 'multi' && Array.isArray(val)) {
      for (const v of val) {
        const valueObj = VALUE_MAP[v]
        if (valueObj) {
          const promptText = valueObj.exportPrompt || valueObj.label
          if (!seen.has(promptText)) {
            parts.push(promptText)
            seen.add(promptText)
          }
        }
      }
    }
  }

  return parts.join(', ')
}

export function buildFacetedMetadata(selections: Record<string, string | string[]>): Record<string, unknown> {
  const metadata: Record<string, unknown> = {}

  for (const facet of ALL_FACETS) {
    const slotData: Record<string, unknown> = {}
    for (const slot of facet.slots) {
      const val = selections[slot.id]
      if (!val) continue
      if (slot.mode === 'single') {
        const valueObj = VALUE_MAP[val as string]
        slotData[slot.id] = valueObj ? { id: valueObj.id, label: valueObj.label } : val
      } else if (Array.isArray(val)) {
        slotData[slot.id] = val.map(v => {
          const vo = VALUE_MAP[v]
          return vo ? { id: vo.id, label: vo.label } : v
        })
      }
    }
    if (Object.keys(slotData).length > 0) {
      metadata[facet.id] = { facet: facet.label, slots: slotData }
    }
  }

  return metadata
}

export function getSelectionSummary(selections: Record<string, string | string[]>): string {
  const labels: string[] = []
  for (const facet of ALL_FACETS) {
    for (const slot of facet.slots) {
      const val = selections[slot.id]
      if (!val) continue
      if (slot.mode === 'single') {
        const vo = VALUE_MAP[val as string]
        if (vo) labels.push(vo.label)
      } else if (Array.isArray(val)) {
        for (const v of val) {
          const vo = VALUE_MAP[v]
          if (vo) labels.push(vo.label)
        }
      }
    }
  }
  return labels.join(' · ')
}

export function getSelectedCount(selections: Record<string, string | string[]>): { filled: number; total: number } {
  let filled = 0
  let total = 0
  for (const facet of ALL_FACETS) {
    for (const slot of facet.slots) {
      total++
      const val = selections[slot.id]
      if (val && (typeof val === 'string' || (Array.isArray(val) && val.length > 0))) {
        filled++
      }
    }
  }
  return { filled, total }
}
