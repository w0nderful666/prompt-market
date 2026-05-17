import { createContext, useContext, useCallback, useMemo, type ReactNode } from 'react'
import type { DirectorSelection, ComposedOutput } from '../core/types'
import { usePromptState, usePromptDispatch, usePromptOutput } from './PromptStateContext'
import type { PromptState } from '../core/promptState'
import { directorToFacetSelections, facetToDirectorUpdate } from '../core/bridgeMapper'

type FacetSelections = Record<string, string | string[]>

interface DirectorContextType {
  selection: DirectorSelection
  output: ComposedOutput
  sharedFacetSelections: FacetSelections
  setSharedFacetSelections: (selections: FacetSelections | ((prev: FacetSelections) => FacetSelections)) => void
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

const DirectorContext = createContext<DirectorContextType>(null!)

export function DirectorProvider({ children }: { children: ReactNode }) {
  const { state, dispatch } = usePromptState()
  const output = usePromptOutput()

  const selection: DirectorSelection = {
    directorTemplate: state.director.templateId,
    devicePreset: state.director.deviceId,
    scenePack: state.director.sceneId,
    lightPack: state.director.lightId,
    statePacks: state.director.stateIds,
    diffStrength: state.director.diffStrength,
    parameterPreset: state.director.parameterPresetId,
    customProps: state.director.customProps,
  }

  const syncToPresets = useCallback(() => {
    const fwd = directorToFacetSelections(selection)
    dispatch({ type: 'SET_FACET_SELECTIONS', selections: fwd })
  }, [selection, dispatch])

  const syncFromPresets = useCallback(() => {
    dispatch({ type: 'SET_SOURCE', source: 'mixed' })
  }, [dispatch])

  const setSharedFacetSelections = useCallback((action: FacetSelections | ((prev: FacetSelections) => FacetSelections)) => {
    if (typeof action === 'function') {
      const next = action(state.advanced.facetSelections)
      dispatch({ type: 'SET_FACET_SELECTIONS', selections: next })
    } else {
      dispatch({ type: 'SET_FACET_SELECTIONS', selections: action })
    }
  }, [dispatch, state.advanced.facetSelections])

  const applyMasterTemplate = useCallback((id: string) => {
    dispatch({ type: 'APPLY_MASTER_TEMPLATE', templateId: id })
  }, [dispatch])

  const setDevice = useCallback((id: string | null) => {
    dispatch({ type: 'UPDATE_DIRECTOR_DEVICE', deviceId: id })
  }, [dispatch])

  const setScene = useCallback((id: string | null) => {
    dispatch({ type: 'UPDATE_DIRECTOR_SCENE', sceneId: id })
  }, [dispatch])

  const setLight = useCallback((id: string | null) => {
    dispatch({ type: 'UPDATE_DIRECTOR_LIGHT', lightId: id })
  }, [dispatch])

  const toggleState = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_DIRECTOR_STATE', stateId: id })
  }, [dispatch])

  const setParamPreset = useCallback((id: string | null) => {
    dispatch({ type: 'UPDATE_PARAMETER_PRESET', id })
  }, [dispatch])

  const setDiffStrength = useCallback((s: 'light' | 'normal' | 'strict') => {
    dispatch({ type: 'UPDATE_DIFF_STRENGTH', strength: s })
  }, [dispatch])

  const addCustomProp = useCallback((prop: string) => {
    const next = state.director.customProps.includes(prop)
      ? state.director.customProps
      : [...state.director.customProps, prop]
    dispatch({ type: 'SET_CUSTOM_PROPS', props: next })
  }, [dispatch, state.director.customProps])

  const removeCustomProp = useCallback((prop: string) => {
    dispatch({
      type: 'SET_CUSTOM_PROPS',
      props: state.director.customProps.filter(p => p !== prop),
    })
  }, [dispatch, state.director.customProps])

  const clearAll = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' })
  }, [dispatch])

  return (
    <DirectorContext.Provider value={{
      selection, output,
      sharedFacetSelections: state.advanced.facetSelections,
      setSharedFacetSelections,
      syncToPresets, syncFromPresets,
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
