import { MICRO_PRESETS } from '../data/seriesMicroPresets'
import type { MicroPreset } from '../data/seriesMicroPresets'

export { MICRO_PRESETS }

const PROTECTED_FIELDS = ['scene', 'lighting', 'background', 'hair', 'clothing', 'subject', 'face', 'ratio']
const ALLOWED_FIELDS = ['composition', 'expression', 'body', 'camera', 'caption', 'mustKeep', 'avoid']

export interface AdjustResult {
  director: Record<string, string>
  changedFields: string[]
  summary: string
}

export function applyMicroAdjust(director: Record<string, string>, presetId: string, _options: any = {}): AdjustResult {
  const preset = MICRO_PRESETS.find((p: MicroPreset) => p.id === presetId)
  if (!preset) {
    return { director: { ...director }, changedFields: [], summary: '未知预设' }
  }

  const nextDirector = { ...director }
  const changedFields: string[] = []

  const presetKeys = Object.keys(preset).filter(k =>
    k !== 'id' && k !== 'label' && k !== 'icon' && k !== 'description' && k !== 'allowFields'
  )

  for (const key of presetKeys) {
    if (!ALLOWED_FIELDS.includes(key) && !PROTECTED_FIELDS.includes(key)) continue
    if (PROTECTED_FIELDS.includes(key)) continue
    if (!preset[key]) continue

    const isAppend = key.endsWith('Append')
    const isRemove = key.endsWith('Remove')
    const baseKey = isAppend ? key.replace('Append', '') : isRemove ? key.replace('Remove', '') : key

    if (!ALLOWED_FIELDS.includes(baseKey)) continue

    if (isAppend) {
      const existing = nextDirector[baseKey] || ''
      const value = preset[key]
      if (!existing.includes(value)) {
        nextDirector[baseKey] = [existing, value].filter(Boolean).join('，')
        if (!changedFields.includes(baseKey)) changedFields.push(baseKey)
      }
    } else if (isRemove) {
      const existing = nextDirector[baseKey] || ''
      const toRemove: string | string[] = preset[key]
      if (Array.isArray(toRemove)) {
        for (const term of toRemove) {
          nextDirector[baseKey] = nextDirector[baseKey].replace(new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '').trim()
        }
        if (nextDirector[baseKey] !== existing) {
          if (!changedFields.includes(baseKey)) changedFields.push(baseKey)
        }
      }
    } else {
      const existing = nextDirector[key] || ''
      const value = preset[key]
      if (existing !== value) {
        const items = existing ? existing.split(/[，,]/).map(s => s.trim()).filter(Boolean) : []
        if (!items.some(item => item.includes(value.slice(0, 10)))) {
          nextDirector[key] = [value, existing].filter(Boolean).join('，')
          if (!changedFields.includes(key)) changedFields.push(key)
        }
      }
    }
  }

  for (const field of Object.keys(nextDirector)) {
    if (typeof nextDirector[field] === 'string') {
      nextDirector[field] = nextDirector[field]
        .replace(/，{2,}/g, '，')
        .replace(/,{2,}/g, ',')
        .replace(/，\s*$/g, '')
        .replace(/,\s*$/g, '')
        .replace(/^[，,]\s*/, '')
        .replace(/\s{2,}/g, ' ')
        .trim()
    }
  }

  return {
    director: nextDirector,
    changedFields,
    summary: `已应用：「${preset.label}」— 修改了 ${changedFields.length} 个字段`
  }
}

export function applyMicroAdjustToSeries(series: any[], presetId: string, options: any = {}) {
  return series.map((item: any) => ({
    ...item,
    director: applyMicroAdjust(item.director, presetId, options).director
  }))
}
