import { createContext, useContext, useState, useCallback, useEffect, useMemo, type ReactNode } from 'react'
import type { FacetValue, TemplatePreset, PresetPack } from '../data/types'
import { ALL_FACETS, TEMPLATES } from '../data/facetedPresets'
import {
  loadPacks, savePack, deletePackFromStore,
  mergePackInto, removePackFrom, getMergedValueIds,
} from '../utils/presetPackManager'

interface PresetPackContextType {
  packs: PresetPack[]
  activePackIds: Set<string>
  augmentedValues: FacetValue[]
  augmentedTemplates: TemplatePreset[]
  togglePack: (id: string) => void
  importPack: (pack: PresetPack) => void
  mergePack: (id: string) => void
  removeMergedPack: (id: string) => void
  deletePack: (id: string) => void
}

const PresetPackContext = createContext<PresetPackContextType>(null!)

const BASE_VALUES = ALL_FACETS.flatMap(f => f.values)
const BASE_TEMPLATES = TEMPLATES

export function PresetPackProvider({ children }: { children: ReactNode }) {
  const [packs, setPacks] = useState<PresetPack[]>(loadPacks)
  const [activePackIds, setActivePackIds] = useState<Set<string>>(new Set())
  const [mergedValueIds, setMergedValueIds] = useState<string[]>(getMergedValueIds)

  const baseValueIds = useMemo(() => new Set(BASE_VALUES.map(v => v.id)), [])
  const baseTemplateIds = useMemo(() => new Set(BASE_TEMPLATES.map(t => t.id)), [])

  const augmentedValues = useMemo(() => {
    const result = [...BASE_VALUES]

    const mergedValues = packs
      .flatMap(p => p.values)
      .filter(v => mergedValueIds.includes(v.id) && !baseValueIds.has(v.id))
    result.push(...mergedValues.filter((v, i, a) => a.findIndex(x => x.id === v.id) === i))

    const activeValues = packs
      .filter(p => activePackIds.has(p.id))
      .flatMap(p => p.values)
      .filter(v => !baseValueIds.has(v.id) && !mergedValueIds.includes(v.id))
    result.push(...activeValues.filter((v, i, a) => a.findIndex(x => x.id === v.id) === i))

    return result
  }, [packs, activePackIds, mergedValueIds, baseValueIds])

  const augmentedTemplates = useMemo(() => {
    const result = [...BASE_TEMPLATES]

    const mergedTpls = packs
      .flatMap(p => p.templates)
      .filter(t => mergedValueIds.includes(t.id) && !baseTemplateIds.has(t.id))
    result.push(...mergedTpls.filter((t, i, a) => a.findIndex(x => x.id === t.id) === i))

    const activeTpls = packs
      .filter(p => activePackIds.has(p.id))
      .flatMap(p => p.templates)
      .filter(t => !baseTemplateIds.has(t.id) && !mergedValueIds.includes(t.id))
    result.push(...activeTpls.filter((t, i, a) => a.findIndex(x => x.id === t.id) === i))

    return result
  }, [packs, activePackIds, mergedValueIds, baseTemplateIds])

  const togglePack = useCallback((id: string) => {
    setActivePackIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const importPack = useCallback((pack: PresetPack) => {
    const updated = savePack(pack)
    setPacks(updated)
  }, [])

  const mergePack = useCallback((id: string) => {
    const pack = packs.find(p => p.id === id)
    if (!pack) return
    mergePackInto(pack)
    setMergedValueIds(getMergedValueIds())
  }, [packs])

  const removeMergedPack = useCallback((id: string) => {
    removePackFrom(id)
    setMergedValueIds(getMergedValueIds())
  }, [])

  const deletePack = useCallback((id: string) => {
    removePackFrom(id)
    const updated = deletePackFromStore(id)
    setPacks(updated)
    setActivePackIds(prev => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
    setMergedValueIds(getMergedValueIds())
  }, [])

  return (
    <PresetPackContext.Provider value={{
      packs,
      activePackIds,
      augmentedValues,
      augmentedTemplates,
      togglePack,
      importPack,
      mergePack,
      removeMergedPack,
      deletePack,
    }}>
      {children}
    </PresetPackContext.Provider>
  )
}

export function usePresetPacks() {
  return useContext(PresetPackContext)
}
