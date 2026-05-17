import type { PoseVariant, ComposedOutput } from './types'
import { composePrompt } from './promptComposer'
import { directorToFacetSelections, facetToDirectorUpdate } from './bridgeMapper'
import { MASTER_TEMPLATE_MAP } from '../data/masterTemplates'

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
    facetSelections: Record<string, string | string[]>
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

const defaultOverlay = {
  shotId: '',
  bodyPose: '',
  bodyAngle: '',
  weightShift: '',
  handTask: '',
  gaze: '',
  expression: '',
  sceneInteraction: '',
  cameraCrop: '',
  cameraAngle: '',
  motionCue: '',
  autoDiffPacks: [],
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
    facetSelections: {},
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
  | { type: 'SET_FACET_SELECTIONS'; selections: Record<string, string | string[]> }
  | { type: 'GENERATE_POSE_VARIANTS'; variants: PoseVariant[] }
  | { type: 'APPLY_POSE_VARIANT'; variantId: string }
  | { type: 'LOCK_FIELD'; field: keyof PromptState['locks']; locked: boolean }
  | { type: 'CLEAR_ALL' }
  | { type: 'SET_SOURCE'; source: PromptStateSource }

export function promptReducer(state: PromptState, action: PromptAction): PromptState {
  switch (action.type) {
    case 'APPLY_MASTER_TEMPLATE': {
      const tpl = MASTER_TEMPLATE_MAP[action.templateId]
      if (!tpl) return state
      const fwd = directorToFacetSelections({
        directorTemplate: tpl.id,
        devicePreset: tpl.lockedCore.device,
        scenePack: tpl.lockedCore.scene,
        lightPack: tpl.lockedCore.light,
        statePacks: [...tpl.randomPools.state],
        diffStrength: 'normal',
        parameterPreset: tpl.parameterPreset,
        customProps: [...tpl.randomPools.props],
      })
      return {
        ...state,
        source: 'director',
        director: {
          templateId: tpl.id,
          deviceId: tpl.lockedCore.device,
          sceneId: tpl.lockedCore.scene,
          lightId: tpl.lockedCore.light,
          stateIds: [...tpl.randomPools.state],
          customProps: [...tpl.randomPools.props],
          parameterPresetId: tpl.parameterPreset,
          diffStrength: 'normal',
        },
        advanced: { facetSelections: fwd },
        variantOverlay: null,
        overrides: {
          changedByDirector: [],
          changedByAdvanced: [],
          changedByVariant: [],
        },
      }
    }

    case 'UPDATE_DIRECTOR_DEVICE': {
      const next = { ...state, source: 'director' as PromptStateSource }
      next.director = { ...next.director, deviceId: action.deviceId }
      const fwd = directorToFacetSelections(toSelection(next))
      next.advanced = { facetSelections: { ...next.advanced.facetSelections, ...fwd } }
      return next
    }

    case 'UPDATE_DIRECTOR_SCENE': {
      const next = { ...state, source: 'director' as PromptStateSource }
      next.director = { ...next.director, sceneId: action.sceneId }
      const fwd = directorToFacetSelections(toSelection(next))
      next.advanced = { facetSelections: { ...next.advanced.facetSelections, ...fwd } }
      return next
    }

    case 'UPDATE_DIRECTOR_LIGHT': {
      const next = { ...state, source: 'director' as PromptStateSource }
      next.director = { ...next.director, lightId: action.lightId }
      const fwd = directorToFacetSelections(toSelection(next))
      next.advanced = { facetSelections: { ...next.advanced.facetSelections, ...fwd } }
      return next
    }

    case 'TOGGLE_DIRECTOR_STATE': {
      const next = { ...state, source: 'director' as PromptStateSource }
      const ids = next.director.stateIds
      next.director = {
        ...next.director,
        stateIds: ids.includes(action.stateId) ? ids.filter(i => i !== action.stateId) : [...ids, action.stateId],
      }
      const fwd = directorToFacetSelections(toSelection(next))
      next.advanced = { facetSelections: { ...next.advanced.facetSelections, ...fwd } }
      return next
    }

    case 'SET_CUSTOM_PROPS': {
      const next = { ...state, source: 'director' as PromptStateSource }
      next.director = { ...next.director, customProps: action.props }
      const fwd = directorToFacetSelections(toSelection(next))
      next.advanced = { facetSelections: { ...next.advanced.facetSelections, ...fwd } }
      return next
    }

    case 'UPDATE_PARAMETER_PRESET': {
      return { ...state, source: 'director', director: { ...state.director, parameterPresetId: action.id } }
    }

    case 'UPDATE_DIFF_STRENGTH': {
      return { ...state, source: 'director', director: { ...state.director, diffStrength: action.strength } }
    }

    case 'UPDATE_ADVANCED_FACET': {
      const next = { ...state, source: 'mixed' as PromptStateSource }
      next.advanced = {
        facetSelections: {
          ...next.advanced.facetSelections,
          [action.slotId]: action.value,
        },
      }
      const update = facetToDirectorUpdate(next.advanced.facetSelections)
      if (update.devicePreset !== undefined) next.director = { ...next.director, deviceId: update.devicePreset }
      if (update.scenePack !== undefined) next.director = { ...next.director, sceneId: update.scenePack }
      if (update.lightPack !== undefined) next.director = { ...next.director, lightId: update.lightPack }
      if (update.statePacks !== undefined) next.director = { ...next.director, stateIds: update.statePacks }
      if (update.customProps !== undefined) next.director = { ...next.director, customProps: update.customProps }
      return next
    }

    case 'SET_FACET_SELECTIONS': {
      const next = { ...state, source: 'advanced' as PromptStateSource }
      next.advanced = { facetSelections: { ...action.selections } }
      const update = facetToDirectorUpdate(action.selections)
      if (update.devicePreset !== undefined) next.director = { ...next.director, deviceId: update.devicePreset }
      if (update.scenePack !== undefined) next.director = { ...next.director, sceneId: update.scenePack }
      if (update.lightPack !== undefined) next.director = { ...next.director, lightId: update.lightPack }
      if (update.statePacks !== undefined) next.director = { ...next.director, stateIds: update.statePacks }
      if (update.customProps !== undefined) next.director = { ...next.director, customProps: update.customProps }
      return next
    }

    case 'GENERATE_POSE_VARIANTS': {
      return {
        ...state,
        variants: {
          list: action.variants,
          activeVariantId: action.variants[0]?.shot.id ?? null,
          appliedVariantId: null,
        },
      }
    }

    case 'APPLY_POSE_VARIANT': {
      const v = state.variants.list.find(x => x.shot.id === action.variantId)
      if (!v) return state
      const next = { ...state, source: 'variant' as PromptStateSource }
      next.variants = { ...next.variants, appliedVariantId: action.variantId }
      next.variantOverlay = {
        shotId: v.shot.id,
        bodyPose: v.shot.bodyPose,
        bodyAngle: v.shot.bodyAngle,
        weightShift: v.shot.weightShift,
        handTask: v.shot.handTask,
        gaze: v.shot.gaze,
        expression: v.shot.expression,
        sceneInteraction: v.shot.sceneInteraction,
        cameraCrop: v.shot.cameraCrop,
        cameraAngle: v.shot.cameraAngle,
        motionCue: v.shot.motionCue,
        autoDiffPacks: v.autoDiffPacks,
      }
      return next
    }

    case 'LOCK_FIELD': {
      return { ...state, locks: { ...state.locks, [action.field]: action.locked } }
    }

    case 'CLEAR_ALL': {
      return { ...defaultPromptState }
    }

    case 'SET_SOURCE': {
      return { ...state, source: action.source }
    }

    default:
      return state
  }
}

function toSelection(s: PromptState) {
  return {
    directorTemplate: s.director.templateId,
    devicePreset: s.director.deviceId,
    scenePack: s.director.sceneId,
    lightPack: s.director.lightId,
    statePacks: s.director.stateIds,
    diffStrength: s.director.diffStrength,
    parameterPreset: s.director.parameterPresetId,
    customProps: s.director.customProps,
  }
}

export function selectOutput(state: PromptState): ComposedOutput {
  return composePrompt(toSelection(state), state.variantOverlay)
}
