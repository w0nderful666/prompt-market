import type { ExternalPromptLibraryEntry, PoseVariant, ComposedOutput, PromptImportMeta } from './types'
import { composePrompt } from './promptComposer'
import { directorToFacetSelections, facetToDirectorUpdate, variantOverlayToFacetSelections } from './bridgeMapper'
import { MASTER_TEMPLATE_MAP } from '../data/masterTemplates'
import { parseImportedPrompt, type FacetSelections, type PromptStyle } from '../utils/facetedBuilder'

export type PromptStateSource = 'director' | 'advanced' | 'variant' | 'mixed'

export interface PromptState {
  source: PromptStateSource

  director: {
    templateId: string | null
    deviceId: string | null
    sceneId: string | null
    lightId: string | null
    stateIds: string[]
    customProps: string[]
    parameterPresetId: string | null
    diffStrength: 'light' | 'normal' | 'strict'
  }

  advanced: {
    facetSelections: FacetSelections
    freeformPositive: string
    freeformNegative: string[]
    importMeta: PromptImportMeta | null
    promptStyle: PromptStyle
  }

  variants: {
    list: PoseVariant[]
    activeVariantId: string | null
    appliedVariantId: string | null
  }

  variantOverlay: {
    shotId: string
    bodyPose: string
    bodyAngle: string
    weightShift: string
    handTask: string
    gaze: string
    expression: string
    sceneInteraction: string
    cameraCrop: string
    cameraAngle: string
    motionCue: string
    autoDiffPacks: string[]
    facetFragment?: FacetSelections
  } | null

  locks: {
    person: boolean
    outfit: boolean
    scene: boolean
    device: boolean
    light: boolean
    style: boolean
  }

  overrides: {
    changedByDirector: string[]
    changedByAdvanced: string[]
    changedByVariant: string[]
  }
}

export const defaultPromptState: PromptState = {
  source: 'director',
  director: {
    templateId: null,
    deviceId: null,
    sceneId: null,
    lightId: null,
    stateIds: [],
    customProps: [],
    parameterPresetId: null,
    diffStrength: 'normal',
  },
  advanced: {
    facetSelections: { outputLang: 'lang_zh' },
    freeformPositive: '',
    freeformNegative: [],
    importMeta: null,
    promptStyle: 'tag',
  },
  variants: {
    list: [],
    activeVariantId: null,
    appliedVariantId: null,
  },
  variantOverlay: null,
  locks: {
    person: false,
    outfit: false,
    scene: false,
    device: false,
    light: false,
    style: false,
  },
  overrides: {
    changedByDirector: [],
    changedByAdvanced: [],
    changedByVariant: [],
  },
}

export type PromptAction =
  | { type: 'APPLY_MASTER_TEMPLATE'; templateId: string }
  | { type: 'UPDATE_DIRECTOR_DEVICE'; deviceId: string | null }
  | { type: 'UPDATE_DIRECTOR_SCENE'; sceneId: string | null }
  | { type: 'UPDATE_DIRECTOR_LIGHT'; lightId: string | null }
  | { type: 'TOGGLE_DIRECTOR_STATE'; stateId: string }
  | { type: 'SET_CUSTOM_PROPS'; props: string[] }
  | { type: 'UPDATE_PARAMETER_PRESET'; id: string | null }
  | { type: 'UPDATE_DIFF_STRENGTH'; strength: 'light' | 'normal' | 'strict' }
  | { type: 'UPDATE_ADVANCED_FACET'; slotId: string; value: string | string[] }
  | { type: 'SET_FACET_SELECTIONS'; selections: FacetSelections }
  | { type: 'SET_FREEFORM_POSITIVE'; value: string }
  | { type: 'SET_FREEFORM_NEGATIVE'; value: string[] }
  | { type: 'SET_PROMPT_STYLE'; value: PromptStyle }
  | { type: 'IMPORT_ADVANCED_PROMPT'; text: string }
  | { type: 'IMPORT_EXTERNAL_LIBRARY_ENTRY'; entry: ExternalPromptLibraryEntry }
  | { type: 'GENERATE_POSE_VARIANTS'; variants: PoseVariant[] }
  | { type: 'APPLY_POSE_VARIANT'; variantId: string }
  | { type: 'LOCK_FIELD'; field: keyof PromptState['locks']; locked: boolean }
  | { type: 'CLEAR_ALL' }
  | { type: 'SET_SOURCE'; source: PromptStateSource }

function toSelection(state: PromptState) {
  return {
    directorTemplate: state.director.templateId,
    devicePreset: state.director.deviceId,
    scenePack: state.director.sceneId,
    lightPack: state.director.lightId,
    statePacks: state.director.stateIds,
    diffStrength: state.director.diffStrength,
    parameterPreset: state.director.parameterPresetId,
    customProps: state.director.customProps,
  }
}

function syncAdvancedFromDirector(state: PromptState): PromptState {
  const selections = directorToFacetSelections(toSelection(state))
  const outputLang = state.advanced.facetSelections.outputLang || 'lang_zh'
  return {
    ...state,
    advanced: {
      ...state.advanced,
      facetSelections: { ...selections, outputLang },
    },
  }
}

function syncDirectorFromAdvanced(state: PromptState, selections: FacetSelections): PromptState {
  const update = facetToDirectorUpdate(selections)
  const next = { ...state }
  next.advanced = { ...next.advanced, facetSelections: selections }
  next.director = {
    ...next.director,
    templateId: update.templateId !== undefined ? update.templateId : next.director.templateId,
    deviceId: update.devicePreset !== undefined ? update.devicePreset : next.director.deviceId,
    sceneId: update.scenePack !== undefined ? update.scenePack : next.director.sceneId,
    lightId: update.lightPack !== undefined ? update.lightPack : next.director.lightId,
    stateIds: update.statePacks !== undefined ? update.statePacks : next.director.stateIds,
    customProps: update.customProps !== undefined ? update.customProps : next.director.customProps,
  }
  return next
}

function withImportMeta(meta: PromptImportMeta, extra: Partial<PromptImportMeta>): PromptImportMeta {
  return {
    ...meta,
    ...extra,
    matchedValues: extra.matchedValues ?? meta.matchedValues,
    unmatchedPositive: extra.unmatchedPositive ?? meta.unmatchedPositive,
    unmatchedNegative: extra.unmatchedNegative ?? meta.unmatchedNegative,
  }
}

export function promptReducer(state: PromptState, action: PromptAction): PromptState {
  switch (action.type) {
    case 'APPLY_MASTER_TEMPLATE': {
      const template = MASTER_TEMPLATE_MAP[action.templateId]
      if (!template) return state

      return {
        ...state,
        source: 'director',
        director: {
          templateId: template.id,
          deviceId: template.lockedCore.device,
          sceneId: template.lockedCore.scene,
          lightId: template.lockedCore.light,
          stateIds: [...template.randomPools.state],
          customProps: [...template.randomPools.props],
          parameterPresetId: template.parameterPreset,
          diffStrength: 'normal',
        },
        advanced: {
          ...state.advanced,
          facetSelections: { ...(template.advancedSelections ?? {}), outputLang: state.advanced.facetSelections.outputLang || 'lang_zh' },
          freeformPositive: '',
          freeformNegative: [],
          importMeta: null,
        },
        variantOverlay: null,
        overrides: {
          changedByDirector: [],
          changedByAdvanced: [],
          changedByVariant: [],
        },
      }
    }

    case 'UPDATE_DIRECTOR_DEVICE': {
      return syncAdvancedFromDirector({
        ...state,
        source: 'director',
        director: { ...state.director, deviceId: action.deviceId },
      })
    }

    case 'UPDATE_DIRECTOR_SCENE': {
      return syncAdvancedFromDirector({
        ...state,
        source: 'director',
        director: { ...state.director, sceneId: action.sceneId },
      })
    }

    case 'UPDATE_DIRECTOR_LIGHT': {
      return syncAdvancedFromDirector({
        ...state,
        source: 'director',
        director: { ...state.director, lightId: action.lightId },
      })
    }

    case 'TOGGLE_DIRECTOR_STATE': {
      const stateIds = state.director.stateIds.includes(action.stateId)
        ? state.director.stateIds.filter(entry => entry !== action.stateId)
        : [...state.director.stateIds, action.stateId]
      return syncAdvancedFromDirector({
        ...state,
        source: 'director',
        director: { ...state.director, stateIds },
      })
    }

    case 'SET_CUSTOM_PROPS': {
      return syncAdvancedFromDirector({
        ...state,
        source: 'director',
        director: { ...state.director, customProps: action.props },
      })
    }

    case 'UPDATE_PARAMETER_PRESET':
      return { ...state, source: 'director', director: { ...state.director, parameterPresetId: action.id } }

    case 'UPDATE_DIFF_STRENGTH':
      return { ...state, source: 'director', director: { ...state.director, diffStrength: action.strength } }

    case 'UPDATE_ADVANCED_FACET': {
      const selections = {
        ...state.advanced.facetSelections,
        [action.slotId]: action.value,
      }
      return {
        ...syncDirectorFromAdvanced({ ...state, source: 'mixed' }, selections),
        source: 'mixed',
      }
    }

    case 'SET_FACET_SELECTIONS':
      return {
        ...syncDirectorFromAdvanced({ ...state, source: 'advanced' }, { ...action.selections }),
        source: 'advanced',
      }

    case 'SET_FREEFORM_POSITIVE':
      return { ...state, advanced: { ...state.advanced, freeformPositive: action.value } }

    case 'SET_FREEFORM_NEGATIVE':
      return { ...state, advanced: { ...state.advanced, freeformNegative: action.value } }

    case 'SET_PROMPT_STYLE':
      return { ...state, advanced: { ...state.advanced, promptStyle: action.value } }

    case 'IMPORT_ADVANCED_PROMPT': {
      const parsed = parseImportedPrompt(action.text, state.advanced.facetSelections)
      const next = syncDirectorFromAdvanced(
        {
          ...state,
          source: 'advanced',
          advanced: {
            ...state.advanced,
            freeformPositive: parsed.freeformPositive,
            freeformNegative: parsed.freeformNegative,
            importMeta: withImportMeta(parsed.importMeta, {
              sourceKind: 'manualPaste',
              sourceLabel: '手动粘贴提示词',
            }),
          },
        },
        parsed.selections,
      )
      return { ...next, source: 'advanced' }
    }

    case 'IMPORT_EXTERNAL_LIBRARY_ENTRY': {
      const baseSelections = {
        ...state.advanced.facetSelections,
        ...action.entry.importHints,
      }
      const parsed = parseImportedPrompt(action.entry.prompt, baseSelections)
      const next = syncDirectorFromAdvanced(
        {
          ...state,
          source: 'advanced',
          advanced: {
            ...state.advanced,
            freeformPositive: parsed.freeformPositive,
            freeformNegative: parsed.freeformNegative,
            importMeta: withImportMeta(parsed.importMeta, {
              sourceKind: 'externalLibraryImport',
              sourceLabel: action.entry.title,
              sourceUrl: action.entry.sourceUrl,
              sourceRepo: action.entry.sourceRepo,
              entryId: action.entry.id,
              qualityTier: action.entry.qualityTier,
              sourceTier: action.entry.sourceTier,
            }),
          },
        },
        parsed.selections,
      )
      return { ...next, source: 'advanced' }
    }

    case 'GENERATE_POSE_VARIANTS':
      return {
        ...state,
        variants: {
          list: action.variants,
          activeVariantId: action.variants[0]?.shot.id ?? null,
          appliedVariantId: null,
        },
      }

    case 'APPLY_POSE_VARIANT': {
      const variant = state.variants.list.find(entry => entry.shot.id === action.variantId)
      if (!variant) return state

      const overlay = {
        shotId: variant.shot.id,
        bodyPose: variant.shot.bodyPose,
        bodyAngle: variant.shot.bodyAngle,
        weightShift: variant.shot.weightShift,
        handTask: variant.shot.handTask,
        gaze: variant.shot.gaze,
        expression: variant.shot.expression,
        sceneInteraction: variant.shot.sceneInteraction,
        cameraCrop: variant.shot.cameraCrop,
        cameraAngle: variant.shot.cameraAngle,
        motionCue: variant.shot.motionCue,
        autoDiffPacks: variant.autoDiffPacks,
        facetFragment: variant.facetFragment,
      }

      const variantSelections = variantOverlayToFacetSelections(overlay)
      const mergedSelections = {
        ...state.advanced.facetSelections,
        ...variantSelections,
      }

      const next = syncDirectorFromAdvanced(
        {
          ...state,
          source: 'variant',
          variantOverlay: overlay,
          variants: { ...state.variants, appliedVariantId: action.variantId },
        },
        mergedSelections,
      )
      return { ...next, source: 'variant' }
    }

    case 'LOCK_FIELD':
      return { ...state, locks: { ...state.locks, [action.field]: action.locked } }

    case 'CLEAR_ALL':
      return { ...defaultPromptState }

    case 'SET_SOURCE':
      return { ...state, source: action.source }

    default:
      return state
  }
}

export function selectOutput(state: PromptState): ComposedOutput {
  return composePrompt(
    toSelection(state),
    state.advanced.facetSelections,
    {
      freeformPositive: state.advanced.freeformPositive,
      freeformNegative: state.advanced.freeformNegative,
      promptStyle: state.advanced.promptStyle,
      importedParameterSuffix: state.advanced.importMeta?.parameterSuffix,
    },
    state.variantOverlay,
  )
}
