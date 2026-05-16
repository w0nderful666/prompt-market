import type { Facet, FacetValue, FacetSlot, TemplatePreset, ConflictRule, SeriesSceneTemplate, ShowcaseEntry, DataPack } from './types'

const STORAGE_KEY = 'prompt_market_user_packs'

type BuiltInData = {
  facets: Facet[]
  templates: TemplatePreset[]
  conflictRules: ConflictRule[]
  showcase: ShowcaseEntry[]
  sceneTemplates: SeriesSceneTemplate[]
  slotMapping: Record<string, string>
}

export class DataRegistry {
  private builtIn: BuiltInData | null = null
  private userPacks: DataPack[] = []

  private merged: BuiltInData = {
    facets: [], templates: [], conflictRules: [],
    showcase: [], sceneTemplates: [], slotMapping: {},
  }
  private mergedFacetMap: Record<string, Facet> = {}
  private mergedValueMap: Record<string, FacetValue> = {}
  private mergedSlotMap: Record<string, FacetSlot> = {}

  private initialized = false
  private listeners: Set<() => void> = new Set()

  subscribe(cb: () => void): () => void {
    this.listeners.add(cb)
    return () => this.listeners.delete(cb)
  }

  private notify() { this.listeners.forEach(cb => cb()) }

  initBuiltIn(data: BuiltInData) {
    this.builtIn = data
    this.loadUserPacks()
    this.merge()
    this.initialized = true
    this.notify()
  }

  private loadUserPacks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) { this.userPacks = JSON.parse(raw); if (!Array.isArray(this.userPacks)) this.userPacks = [] }
    } catch { this.userPacks = [] }
  }

  private saveUserPacks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.userPacks))
  }

  private merge() {
    if (!this.builtIn) return
    const b = this.builtIn
    this.merged = {
      facets: b.facets.map(f => ({ ...f, values: [...f.values], slots: [...f.slots] })),
      templates: [...b.templates],
      conflictRules: [...b.conflictRules],
      showcase: [...b.showcase],
      sceneTemplates: [...b.sceneTemplates],
      slotMapping: { ...b.slotMapping },
    }

    for (const pack of this.userPacks) {
      if (pack.facets) this.applyFacets(pack.facets)
      if (pack.templates) this.applyTemplates(pack.templates)
      if (pack.showcaseEntries) this.applyShowcase(pack.showcaseEntries)
      if (pack.sceneTemplates) this.applySceneTemplates(pack.sceneTemplates)
      if (pack.slotMapping) Object.assign(this.merged.slotMapping, pack.slotMapping)
    }

    this.mergedFacetMap = {}
    this.mergedValueMap = {}
    this.mergedSlotMap = {}
    for (const f of this.merged.facets) {
      this.mergedFacetMap[f.id] = f
      for (const v of f.values) this.mergedValueMap[v.id] = v
      for (const s of f.slots) this.mergedSlotMap[s.id] = s
    }
  }

  private applyFacets(userFacets: Facet[]) {
    for (const uf of userFacets) {
      const idx = this.merged.facets.findIndex(f => f.id === uf.id)
      if (idx >= 0) {
        const existing = this.merged.facets[idx]
        const valueIds = new Set(existing.values.map(v => v.id))
        const slotIds = new Set(existing.slots.map(s => s.id))
        for (const v of uf.values) { if (!valueIds.has(v.id)) existing.values.push(v) }
        for (const s of uf.slots) { if (!slotIds.has(s.id)) existing.slots.push(s) }
      } else {
        this.merged.facets.push(uf)
      }
    }
  }

  private applyTemplates(userTemplates: TemplatePreset[]) {
    for (const ut of userTemplates) {
      const idx = this.merged.templates.findIndex(t => t.id === ut.id)
      if (idx >= 0) this.merged.templates[idx] = ut
      else this.merged.templates.push(ut)
    }
  }

  private applyShowcase(entries: ShowcaseEntry[]) {
    for (const e of entries) {
      const idx = this.merged.showcase.findIndex(s => s.id === e.id)
      if (idx >= 0) this.merged.showcase[idx] = e
      else this.merged.showcase.push(e)
    }
  }

  private applySceneTemplates(templates: SeriesSceneTemplate[]) {
    for (const t of templates) {
      const idx = this.merged.sceneTemplates.findIndex(s => s.id === t.id)
      if (idx >= 0) this.merged.sceneTemplates[idx] = t
      else this.merged.sceneTemplates.push(t)
    }
  }

  importPack(data: string | DataPack): { success: boolean; error?: string } {
    let pack: DataPack
    if (typeof data === 'string') {
      try { pack = JSON.parse(data) } catch { return { success: false, error: '无效 JSON 格式' } }
    } else { pack = data }
    if (!pack.meta || !pack.meta.name) return { success: false, error: '缺少 meta.name' }
    this.userPacks.push(pack)
    this.saveUserPacks()
    this.merge()
    this.notify()
    return { success: true }
  }

  importFromFile(file: File): Promise<{ success: boolean; error?: string }> {
    return new Promise(resolve => {
      const reader = new FileReader()
      reader.onload = () => resolve(this.importPack(reader.result as string))
      reader.onerror = () => resolve({ success: false, error: '文件读取失败' })
      reader.readAsText(file)
    })
  }

  removePack(index: number) {
    if (index >= 0 && index < this.userPacks.length) {
      this.userPacks.splice(index, 1)
      this.saveUserPacks()
      this.merge()
      this.notify()
    }
  }

  exportAllPacks(): string {
    const pack: DataPack = {
      meta: { name: 'prompt-market-all-data', version: '1.0', description: '全部提示词数据导出' },
      facets: this.merged.facets,
      templates: this.merged.templates,
      showcaseEntries: this.merged.showcase,
      sceneTemplates: this.merged.sceneTemplates,
      slotMapping: this.merged.slotMapping,
    }
    return JSON.stringify(pack, null, 2)
  }

  get userPacksList(): DataPack[] { return [...this.userPacks] }
  get facets(): Facet[] { return this.merged.facets }
  get templates(): TemplatePreset[] { return this.merged.templates }
  get conflictRules(): ConflictRule[] { return this.merged.conflictRules }
  get showcase(): ShowcaseEntry[] { return this.merged.showcase }
  get sceneTemplates(): SeriesSceneTemplate[] { return this.merged.sceneTemplates }
  get slotMapping(): Record<string, string> { return this.merged.slotMapping }
  get facetMap(): Record<string, Facet> { return this.mergedFacetMap }
  get valueMap(): Record<string, FacetValue> { return this.mergedValueMap }
  get slotMap(): Record<string, FacetSlot> { return this.mergedSlotMap }
}

export const registry = new DataRegistry()
