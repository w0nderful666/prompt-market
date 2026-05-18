import type { FacetValue, TemplatePreset, PresetPack } from '../data/types'
import { ALL_FACETS, TEMPLATES } from '../data/facetedPresets'

const STORAGE_KEY = 'prompt_market_preset_packs'
const MERGE_KEY = 'prompt_market_merged_pack_ids'

// ---- localStorage CRUD ----

export function loadPacks(): PresetPack[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function savePacks(packs: PresetPack[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(packs)) } catch {}
}

export function deletePackFromStore(packId: string) {
  const packs = loadPacks().filter(p => p.id !== packId)
  savePacks(packs)
  removeAllMergedIds(packId)
  return packs
}

// ---- merged ids tracking ----

function loadMergedIdsMap(): Record<string, string[]> {
  try {
    const raw = localStorage.getItem(MERGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

function saveMergedIdsMap(map: Record<string, string[]>) {
  try { localStorage.setItem(MERGE_KEY, JSON.stringify(map)) } catch {}
}

function removeAllMergedIds(packId: string) {
  const map = loadMergedIdsMap()
  delete map[packId]
  saveMergedIdsMap(map)
}

// ---- export ----

export function exportToJson(selections: Record<string, string | string[]>, values: FacetValue[], templates: TemplatePreset[]) {
  const selectedIds = new Set<string>()
  for (const val of Object.values(selections)) {
    if (!val) continue
    if (typeof val === 'string' && val) selectedIds.add(val)
    else if (Array.isArray(val)) val.forEach(v => { if (v) selectedIds.add(v) })
  }

  const packValues = values.filter(v => selectedIds.has(v.id))
  const usedTemplateIds = new Set<string>()
  for (const t of templates) {
    const vals = Object.values(t.selections).flatMap(v => Array.isArray(v) ? v : [v])
    if (vals.some(v => selectedIds.has(v))) usedTemplateIds.add(t.id)
  }
  const packTemplates = templates.filter(t => usedTemplateIds.has(t.id))

  const pack: PresetPack = {
    id: '',
    meta: {
      name: `预设包 ${new Date().toLocaleDateString('zh-CN')}`,
      version: '1.0',
    },
    values: packValues,
    templates: packTemplates,
  }
  return pack
}

export function downloadJson(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename
  document.body.appendChild(a); a.click()
  a.remove(); URL.revokeObjectURL(url)
}

// ---- import ----

export function validatePack(data: unknown): data is PresetPack {
  if (!data || typeof data !== 'object') return false
  const p = data as Record<string, unknown>
  if (!p.meta || typeof p.meta !== 'object') return false
  if (!Array.isArray(p.values)) return false
  if (!Array.isArray(p.templates)) return false
  for (const v of p.values) {
    if (!v.id || !v.label || !v.slot) return false
  }
  return true
}

export function prepareImportedPack(data: PresetPack): PresetPack {
  return {
    ...data,
    id: `pack_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
  }
}

export function savePack(pack: PresetPack) {
  const packs = loadPacks()
  packs.push(pack)
  savePacks(packs)
  return packs
}

// ---- merge ----

export function mergePackInto(pack: PresetPack) {
  const mergedMap = loadMergedIdsMap()
  if (mergedMap[pack.id]) return // already merged

  const valueIds: string[] = []
  const templateIds: string[] = []

  for (const v of pack.values) {
    const exists = ALL_FACETS.some(f => f.values.some(ex => ex.id === v.id))
    if (!exists) valueIds.push(v.id)
  }

  for (const t of pack.templates) {
    const exists = TEMPLATES.some(ex => ex.id === t.id)
    if (!exists) templateIds.push(t.id)
  }

  mergedMap[pack.id] = [...valueIds, ...templateIds]
  saveMergedIdsMap(mergedMap)
  return { valueIds, templateIds }
}

export function removePackFrom(packId: string) {
  const mergedMap = loadMergedIdsMap()
  const ids = mergedMap[packId] || []
  delete mergedMap[packId]
  saveMergedIdsMap(mergedMap)
  return ids
}

export function getMergedValueIds(): string[] {
  return Object.values(loadMergedIdsMap()).flat()
}

export function buildAugmentedData(packs: PresetPack[]) {
  const mergedIds = getMergedValueIds()

  const extraValues: FacetValue[] = []
  const extraTemplates: TemplatePreset[] = []

  for (const pack of packs) {
    for (const v of pack.values) {
      if (mergedIds.includes(v.id)) {
        extraValues.push(v)
      }
    }
    for (const t of pack.templates) {
      if (mergedIds.includes(t.id)) {
        extraTemplates.push(t)
      }
    }
  }

  return { extraValues, extraTemplates }
}
