import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react'
import type { DirectorSelection, ComposedOutput } from '../core/types'
import { MASTER_TEMPLATE_MAP } from '../data/masterTemplates'
import { composePrompt } from '../core/promptComposer'
import { directorToFacetSelections, facetToDirectorUpdate } from '../core/bridgeMapper'

type FacetSelections = Record<string, string | string[]>

interface DirectorContextType {
  selection: DirectorSelection
  output: ComposedOutput
  sharedFacetSelections: FacetSelections
  setSharedFacetSelections: React.Dispatch<React.SetStateAction<FacetSelections>>
  syncToPresets: () => void
  syncFromPresets: () => void
  applyMasterTemplate: (id: string) => void
  setDevice: (id: string | null) => void
  setScene: (id: string | null) => void
  setLight: (id: string | null) => void
  toggleState: (id: string) => void
  setParamPreset: (id: string | null) => void
  setDiffStrength: (s: 'light' | 'normal' | 'strict') => void
  addCustomProp: (prop: string) => void
  removeCustomProp: (prop: string) => void
  clearAll: () => void
}

const defaultSelection: DirectorSelection = {
  directorTemplate: null,
  devicePreset: null,
  scenePack: null,
  lightPack: null,
  statePacks: [],
  diffStrength: 'normal',
  parameterPreset: null,
  customProps: [],
}

const DirectorContext = createContext<DirectorContextType>(null!)

export function DirectorProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<DirectorSelection>(defaultSelection)
  const [sharedFacetSelections, setSharedFacetSelections] = useState<FacetSelections>({})

  const output = useMemo(() => composePrompt(selection), [selection])

  const syncToPresets = useCallback(() => {
    const mapped = directorToFacetSelections(selection)
    setSharedFacetSelections(mapped)
  }, [selection])

  const syncFromPresets = useCallback(() => {
    setSharedFacetSelections(prev => {
      const update = facetToDirectorUpdate(prev)
      setSelection(s => ({
        ...s,
        ...update,
      }))
      return prev
    })
  }, [])

  const applyMasterTemplate = useCallback((id: string) => {
    const tpl = MASTER_TEMPLATE_MAP[id]
    if (!tpl) return
    setSelection({
      directorTemplate: tpl.id,
      devicePreset: tpl.lockedCore.device,
      scenePack: tpl.lockedCore.scene,
      lightPack: tpl.lockedCore.light,
      statePacks: [...tpl.randomPools.state],
      diffStrength: 'normal',
      parameterPreset: tpl.parameterPreset,
      customProps: [...tpl.randomPools.props],
    })
  }, [])

  const setDevice = useCallback((id: string | null) => {
    setSelection(prev => ({ ...prev, devicePreset: id }))
  }, [])

  const setScene = useCallback((id: string | null) => {
    setSelection(prev => ({ ...prev, scenePack: id }))
  }, [])

  const setLight = useCallback((id: string | null) => {
    setSelection(prev => ({ ...prev, lightPack: id }))
  }, [])

  const toggleState = useCallback((id: string) => {
    setSelection(prev => {
      const has = prev.statePacks.includes(id)
      return {
        ...prev,
        statePacks: has ? prev.statePacks.filter(s => s !== id) : [...prev.statePacks, id],
      }
    })
  }, [])

  const setParamPreset = useCallback((id: string | null) => {
    setSelection(prev => ({ ...prev, parameterPreset: id }))
  }, [])

  const setDiffStrength = useCallback((s: 'light' | 'normal' | 'strict') => {
    setSelection(prev => ({ ...prev, diffStrength: s }))
  }, [])

  const addCustomProp = useCallback((prop: string) => {
    setSelection(prev => ({
      ...prev,
      customProps: prev.customProps.includes(prop) ? prev.customProps : [...prev.customProps, prop],
    }))
  }, [])

  const removeCustomProp = useCallback((prop: string) => {
    setSelection(prev => ({
      ...prev,
      customProps: prev.customProps.filter(p => p !== prop),
    }))
  }, [])

  const clearAll = useCallback(() => {
    setSelection(defaultSelection)
    setSharedFacetSelections({})
  }, [])

  return (
    <DirectorContext.Provider value={{
      selection, output,
      sharedFacetSelections, setSharedFacetSelections, syncToPresets, syncFromPresets,
      applyMasterTemplate, setDevice, setScene, setLight, toggleState,
      setParamPreset, setDiffStrength, addCustomProp, removeCustomProp, clearAll,
    }}>
      {children}
    </DirectorContext.Provider>
  )
}

export function useDirector() {
  return useContext(DirectorContext)
}
