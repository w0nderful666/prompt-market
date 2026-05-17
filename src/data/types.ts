export type SelectionMode = 'single' | 'multi' | 'primary+modifier'

export interface FacetSlot {
  id: string
  label: string
  icon: string
  mode: SelectionMode
  maxSelect?: number
  parentFacet: string
}

export interface FacetValue {
  id: string
  label: string
  aliases?: string[]
  slot: string
  exportPrompt?: string
  conflicts?: string[]
}

export interface Facet {
  id: string
  label: string
  icon: string
  description: string
  slots: FacetSlot[]
  values: FacetValue[]
}

export interface TemplatePreset {
  id: string
  name: string
  description: string
  selections: Record<string, string | string[]>
}

export interface ConflictRule {
  type: 'hard' | 'soft'
  description: string
  check: (selections: Record<string, string | string[]>) => string | null
}

export interface PresetPackMeta {
  name: string
  author?: string
  version?: string
  description?: string
}

export interface PresetPack {
  id: string
  meta: PresetPackMeta
  values: FacetValue[]
  templates: TemplatePreset[]
}
