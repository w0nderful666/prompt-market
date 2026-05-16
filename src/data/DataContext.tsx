import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { registry } from './DataRegistry'
import { ALL_FACETS, TEMPLATES, CONFLICT_RULES } from './facetedPresets'
import { SHOWCASE_ENTRIES } from './showcaseData'
import { EXTENDED_TEMPLATES } from './seriesExtendedTemplates'
import { SLOT_TO_DIRECTOR } from './slotToDirectorMapping'
import type { Facet, FacetValue, FacetSlot, TemplatePreset, ConflictRule, SeriesSceneTemplate, ShowcaseEntry, DataPack } from './types'

export type { DataPack }

interface DataContextValue {
  facets: Facet[]
  facetMap: Record<string, Facet>
  valueMap: Record<string, FacetValue>
  slotMap: Record<string, FacetSlot>
  templates: TemplatePreset[]
  conflictRules: ConflictRule[]
  showcase: ShowcaseEntry[]
  sceneTemplates: SeriesSceneTemplate[]
  slotMapping: Record<string, string>
  userPacks: DataPack[]
  importPack: (data: string | DataPack) => { success: boolean; error?: string }
  importFromFile: (file: File) => Promise<{ success: boolean; error?: string }>
  removePack: (index: number) => void
  exportAll: () => string
}

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const [version, setVersion] = useState(0)

  useEffect(() => {
    registry.initBuiltIn({
      facets: ALL_FACETS,
      templates: TEMPLATES,
      conflictRules: CONFLICT_RULES,
      showcase: SHOWCASE_ENTRIES,
      sceneTemplates: EXTENDED_TEMPLATES,
      slotMapping: SLOT_TO_DIRECTOR,
    })
    return registry.subscribe(() => setVersion(v => v + 1))
  }, [])

  const importPack = useCallback((data: string | DataPack) => registry.importPack(data), [])
  const importFromFile = useCallback((file: File) => registry.importFromFile(file), [])
  const removePack = useCallback((i: number) => registry.removePack(i), [])
  const exportAll = useCallback(() => registry.exportAllPacks(), [])

  const value: DataContextValue = {
    facets: registry.facets,
    facetMap: registry.facetMap,
    valueMap: registry.valueMap,
    slotMap: registry.slotMap,
    templates: registry.templates,
    conflictRules: registry.conflictRules,
    showcase: registry.showcase,
    sceneTemplates: registry.sceneTemplates,
    slotMapping: registry.slotMapping,
    userPacks: registry.userPacksList,
    importPack,
    importFromFile,
    removePack,
    exportAll,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}

export function useFacets() {
  const { facets, facetMap, valueMap, slotMap } = useData()
  return { facets, facetMap, valueMap, slotMap }
}

export function useTemplates() {
  const { templates } = useData()
  return templates
}

export function useShowcase() {
  const { showcase } = useData()
  return showcase
}

export function useSceneTemplates() {
  const { sceneTemplates } = useData()
  return sceneTemplates
}

export function useDataManager() {
  const { userPacks, importPack, importFromFile, removePack, exportAll } = useData()
  return { userPacks, importPack, importFromFile, removePack, exportAll }
}
