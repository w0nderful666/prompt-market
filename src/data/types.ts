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

export interface SeriesSceneTemplate {
  id: string
  name: string
  categoryGroup: string
  category: string
  tags: string[]
  description: string
  baseDirector: Record<string, string>
}

export type ShowcaseCategory = 'daily' | 'outdoor' | 'travel' | 'portrait' | 'street' | 'seasonal' | 'fashion' | 'indoor' | 'product' | 'concept' | 'extra'

export interface ShowcaseEntry {
  id: string
  name: string
  subtitle: string
  tags: string[]
  category: ShowcaseCategory
  model: 'GPT Image' | 'Midjourney' | 'Stable Diffusion'
  score: number
  director: {
    model: string
    subject: string
    scene: string
    composition: string
    expression: string
    face: string
    hair: string
    body: string
    clothing: string
    lighting: string
    camera: string
    depthOfField: string
    background: string
    atmosphere: string
    caption: string
    mustKeep: string
    avoid: string
    ratio: string
  }
}

export interface DataPackMeta {
  name: string
  version: string
  author?: string
  description?: string
}

export interface DataPack {
  meta: DataPackMeta
  facets?: Facet[]
  templates?: TemplatePreset[]
  showcaseEntries?: ShowcaseEntry[]
  sceneTemplates?: SeriesSceneTemplate[]
  slotMapping?: Record<string, string>
}
