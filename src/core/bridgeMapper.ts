import type { DirectorSelection, DirectorTemplate } from './types'
import { DEVICE_PRESETS } from '../data/devicePresets'
import { SCENE_PACKS } from '../data/scenePacks'
import { LIGHT_PACKS } from '../data/lightPacks'
import { STATE_PACKS } from '../data/statePacks'
import { MASTER_TEMPLATE_MAP, masterTemplates } from '../data/masterTemplates'
import { PROP_FACET_FRAGMENTS, mergeFacetSelections, type FacetSelections } from '../data/facetSyncMaps'

function scoreFragment(fragment: FacetSelections | undefined, selections: FacetSelections): number {
  if (!fragment) return 0
  let score = 0

  for (const [slotId, expected] of Object.entries(fragment)) {
    const current = selections[slotId]
    if (!current) continue

    if (Array.isArray(expected)) {
      const currentList = Array.isArray(current) ? current : [current]
      score += expected.filter(value => currentList.includes(value)).length
    } else if (Array.isArray(current)) {
      if (current.includes(expected)) score += 1
    } else if (current === expected) {
      score += 1
    }
  }

  return score
}

function findBestTemplate(selections: FacetSelections): string | null {
  let bestId: string | null = null
  let bestScore = 0

  for (const template of masterTemplates) {
    const fragment = template.advancedSelections
    if (!fragment) continue
    if (typeof selections.scenePrimary === 'string' && typeof fragment.scenePrimary === 'string' && selections.scenePrimary !== fragment.scenePrimary) {
      continue
    }
    if (typeof selections.shootingMedium === 'string' && typeof fragment.shootingMedium === 'string' && selections.shootingMedium !== fragment.shootingMedium) {
      continue
    }
    const score = scoreFragment(fragment, selections)
    if (score > bestScore) {
      bestId = template.id
      bestScore = score
    }
  }

  return bestScore >= 6 ? bestId : null
}

function matchSingle<T extends { id: string; facetFragment?: FacetSelections }>(items: T[], selections: FacetSelections, minScore = 1): string | null {
  let best: string | null = null
  let bestScore = 0
  for (const item of items) {
    const score = scoreFragment(item.facetFragment, selections)
    if (score > bestScore) {
      best = item.id
      bestScore = score
    }
  }
  return bestScore >= minScore ? best : null
}

function matchStates(selections: FacetSelections): string[] {
  const states = STATE_PACKS
    .map(state => ({ id: state.id, score: scoreFragment(state.facetFragment, selections) }))
    .filter(entry => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(entry => entry.id)
  return [...new Set(states)]
}

function matchCustomProps(selections: FacetSelections): string[] {
  const result: string[] = []

  for (const [propLabel, fragment] of Object.entries(PROP_FACET_FRAGMENTS)) {
    if (scoreFragment(fragment, selections) > 0) result.push(propLabel)
  }

  return result.slice(0, 3)
}

function applyDirectorLayer(base: FacetSelections, sel: DirectorSelection): FacetSelections {
  const parts: Array<FacetSelections | undefined> = [base]

  if (sel.devicePreset) {
    const device = DEVICE_PRESETS.find(entry => entry.id === sel.devicePreset)
    parts.push(device?.facetFragment)
  }
  if (sel.scenePack) {
    const scene = SCENE_PACKS.find(entry => entry.id === sel.scenePack)
    parts.push(scene?.facetFragment)
  }
  if (sel.lightPack) {
    const light = LIGHT_PACKS.find(entry => entry.id === sel.lightPack)
    parts.push(light?.facetFragment)
  }
  for (const stateId of sel.statePacks) {
    const state = STATE_PACKS.find(entry => entry.id === stateId)
    parts.push(state?.facetFragment)
  }
  for (const customProp of sel.customProps) {
    parts.push(PROP_FACET_FRAGMENTS[customProp])
  }

  return mergeFacetSelections(...parts)
}

export function directorToFacetSelections(sel: DirectorSelection): FacetSelections {
  const template = sel.directorTemplate ? MASTER_TEMPLATE_MAP[sel.directorTemplate] : null
  const base = template?.advancedSelections ?? {}
  return applyDirectorLayer(base, sel)
}

export interface BridgeSyncUpdate {
  templateId?: string | null
  devicePreset?: string | null
  scenePack?: string | null
  lightPack?: string | null
  statePacks?: string[]
  customProps?: string[]
}

export interface VariantOverlayInput {
  bodyPose: string
  bodyAngle: string
  weightShift: string
  handTask: string
  gaze: string
  expression: string
  cameraCrop: string
  cameraAngle: string
  motionCue: string
  facetFragment?: FacetSelections
}

export function variantOverlayToFacetSelections(overlay: VariantOverlayInput): FacetSelections {
  return overlay.facetFragment ? mergeFacetSelections(overlay.facetFragment) : {}
}

export function facetToDirectorUpdate(facetSel: FacetSelections): BridgeSyncUpdate {
  return {
    templateId: findBestTemplate(facetSel),
    devicePreset: matchSingle(DEVICE_PRESETS, facetSel, 1),
    scenePack: matchSingle(SCENE_PACKS, facetSel, 1),
    lightPack: matchSingle(LIGHT_PACKS, facetSel, 1),
    statePacks: matchStates(facetSel),
    customProps: matchCustomProps(facetSel),
  }
}

export function resolveTemplateFromFacetSelections(selections: FacetSelections): DirectorTemplate | null {
  const templateId = findBestTemplate(selections)
  return templateId ? MASTER_TEMPLATE_MAP[templateId] ?? null : null
}
