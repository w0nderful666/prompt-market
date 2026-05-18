import type { DirectorSelection, PoseVariant } from './types'
import { DEVICE_MAP } from '../data/devicePresets'
import { LIGHT_MAP } from '../data/lightPacks'
import { SCENE_MAP } from '../data/scenePacks'
import { STATE_MAP } from '../data/statePacks'
import { DIFF_MAP } from '../data/diffPacks'
import { VARIANT_SHOT_TEMPLATES } from '../data/variantShotTemplates'
import { mergeFacetSelections } from '../data/facetSyncMaps'
import { buildSegmentedPrompt } from '../utils/facetedBuilder'

export interface GenerateVariantsOptions {
  variantCount: 3 | 5 | 9
  intensity: 'subtle' | 'standard' | 'dynamic'
}

function baseSelections(sel: DirectorSelection): Record<string, string | string[]> {
  const selections: Record<string, string | string[]> = { outputLang: 'lang_zh' }
  if (sel.statePacks.length > 0) {
    for (const stateId of sel.statePacks) {
      const state = STATE_MAP[stateId]
      if (!state?.facetFragment) continue
      Object.assign(selections, mergeFacetSelections(selections, state.facetFragment))
    }
  }
  return selections
}

function buildBasePrompt(sel: DirectorSelection): string {
  const parts: string[] = []
  const scene = sel.scenePack ? SCENE_MAP[sel.scenePack] : null
  const device = sel.devicePreset ? DEVICE_MAP[sel.devicePreset] : null
  const light = sel.lightPack ? LIGHT_MAP[sel.lightPack] : null

  if (scene) parts.push(scene.positivePromptZh)
  for (const stateId of sel.statePacks) {
    const state = STATE_MAP[stateId]
    if (state) parts.push(state.positivePromptZh)
  }
  if (device) parts.push(device.positivePromptZh)
  if (light) parts.push(light.positivePromptZh)

  return parts.filter(Boolean).join('，')
}

function buildVariantNegative(packIds: string[]): string[] {
  const items: string[] = []
  for (const id of packIds) {
    const pack = DIFF_MAP[id]
    if (pack) items.push(...pack.negativePrompt)
  }
  return [...new Set(items)]
}

function resolveTemplates(sceneId: string | null, intensity: 'subtle' | 'standard' | 'dynamic') {
  const exact = VARIANT_SHOT_TEMPLATES.filter(template =>
    template.intensity === intensity &&
    (!sceneId || template.sceneTypes.includes(sceneId)),
  )
  if (exact.length > 0) return exact

  const sameIntensity = VARIANT_SHOT_TEMPLATES.filter(template => template.intensity === intensity)
  if (sameIntensity.length > 0) return sameIntensity

  return VARIANT_SHOT_TEMPLATES
}

function scoreDiversity(template: typeof VARIANT_SHOT_TEMPLATES[number], picked: typeof VARIANT_SHOT_TEMPLATES) {
  if (picked.length === 0) return 100

  let score = 0
  for (const current of picked) {
    if (current.facetFragment.posePrimary !== template.facetFragment.posePrimary) score += 2
    if (current.facetFragment.expressionPrimary !== template.facetFragment.expressionPrimary) score += 2
    if (current.facetFragment.shotSize !== template.facetFragment.shotSize) score += 1
    if (current.facetFragment.cameraAngle !== template.facetFragment.cameraAngle) score += 1
  }
  return score
}

function pickVariantTemplates(sceneId: string | null, options: GenerateVariantsOptions) {
  const candidates = resolveTemplates(sceneId, options.intensity)
  const picked: typeof VARIANT_SHOT_TEMPLATES = []
  const used = new Set<string>()

  while (picked.length < options.variantCount && used.size < candidates.length) {
    const remaining = candidates.filter(template => !used.has(template.id))
    remaining.sort((a, b) => scoreDiversity(b, picked) - scoreDiversity(a, picked))
    const next = remaining[0]
    if (!next) break
    picked.push(next)
    used.add(next.id)
  }

  if (picked.length < options.variantCount) {
    for (const template of VARIANT_SHOT_TEMPLATES) {
      if (picked.length >= options.variantCount) break
      if (used.has(template.id)) continue
      picked.push(template)
      used.add(template.id)
    }
  }

  return picked.slice(0, options.variantCount)
}

export function generatePoseVariants(sel: DirectorSelection, options: GenerateVariantsOptions): PoseVariant[] {
  const templates = pickVariantTemplates(sel.scenePack, options)
  const basePrompt = buildBasePrompt(sel)
  const baseFacetSelections = baseSelections(sel)

  return templates.map(template => {
    const mergedSelections = mergeFacetSelections(baseFacetSelections, template.facetFragment)
    const segmented = buildSegmentedPrompt(mergedSelections, {
      outputLang: 'zh',
      promptStyle: 'tag',
    })
    const autoDiffPacks = [...new Set(['real-photo-base', ...template.requiredDiffPacks])]

    return {
      shot: {
        id: template.id,
        title: template.title,
        purpose: template.purpose,
        bodyPose: template.bodyPose,
        bodyAngle: template.bodyAngle,
        weightShift: template.weightShift,
        handTask: template.handTask,
        gaze: template.gaze,
        expression: template.expression,
        sceneInteraction: template.sceneInteraction,
        cameraCrop: template.cameraCrop,
        cameraAngle: template.cameraAngle,
        motionCue: template.motionCue,
        requiredDiffPacks: template.requiredDiffPacks,
        avoid: template.avoid,
      },
      pipelineId: `${sel.scenePack ?? 'generic'}-${options.intensity}-${options.variantCount}`,
      positivePrompt: [basePrompt, segmented.flatPrompt].filter(Boolean).join('，'),
      negativePrompt: buildVariantNegative(autoDiffPacks),
      autoDiffPacks,
      facetFragment: template.facetFragment,
    }
  })
}
