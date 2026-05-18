import type { DirectorSelection, ComposedOutput, AutoEnabledPack } from './types'
import { DEVICE_MAP } from '../data/devicePresets'
import { SCENE_MAP } from '../data/scenePacks'
import { LIGHT_MAP } from '../data/lightPacks'
import { DIFF_MAP } from '../data/diffPacks'
import { MASTER_TEMPLATE_MAP } from '../data/masterTemplates'
import { PARAMETER_MAP } from '../data/parameterPresets'
import { buildSegmentedPrompt, type FacetSelections, type OutputLanguage, type PromptStyle } from '../utils/facetedBuilder'

function triggerMatchesPack(packTriggerSlots: string[], selectionSlotKeys: string[], selectedValueIds: string[]): boolean {
  if (packTriggerSlots.includes('*')) return true
  for (const trigger of packTriggerSlots) {
    if (selectionSlotKeys.includes(trigger)) return true
    if (selectedValueIds.includes(trigger)) return true
  }
  return false
}

function resolveOutputLanguage(selections: FacetSelections): OutputLanguage {
  if (selections.outputLang === 'lang_en') return 'en'
  if (selections.outputLang === 'lang_mix') return 'mix'
  return 'zh'
}

export function composePrompt(
  sel: DirectorSelection,
  advancedSelections: FacetSelections,
  options?: {
    freeformPositive?: string
    freeformNegative?: string[]
    promptStyle?: PromptStyle
    importedParameterSuffix?: string
  },
  variantOverlay?: {
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
  } | null,
): ComposedOutput {
  const device = sel.devicePreset ? DEVICE_MAP[sel.devicePreset] : null
  const scene = sel.scenePack ? SCENE_MAP[sel.scenePack] : null
  const light = sel.lightPack ? LIGHT_MAP[sel.lightPack] : null
  const paramPreset = sel.parameterPreset ? PARAMETER_MAP[sel.parameterPreset] : null
  const template = sel.directorTemplate ? MASTER_TEMPLATE_MAP[sel.directorTemplate] ?? null : null

  const aspectRatio = template
    ? `--ar ${template.lockedCore.aspectRatio}`
    : device
      ? `--ar ${device.defaultAspectRatios[0]}`
      : '--ar 4:5'

  const enabledPacks: AutoEnabledPack[] = []
  const negativeParts: string[] = [...(options?.freeformNegative ?? [])]

  const forcedPackIds: string[] = variantOverlay?.autoDiffPacks ?? []
  const selectionSlotKeys: string[] = []
  const selectedValueIds: string[] = []

  if (device) selectionSlotKeys.push('devicePreset')
  if (scene) selectionSlotKeys.push('scenePack')
  if (light) selectionSlotKeys.push('lightPack')

  for (const stateId of sel.statePacks) {
    selectionSlotKeys.push('statePack')
    selectedValueIds.push(stateId)
  }

  for (const customProp of sel.customProps) {
    selectedValueIds.push(`prop_${customProp}`)
    selectionSlotKeys.push('handheld')
  }

  for (const [slotId, value] of Object.entries(advancedSelections)) {
    selectionSlotKeys.push(slotId)
    if (Array.isArray(value)) selectedValueIds.push(...value)
    else selectedValueIds.push(value)
  }

  for (const pack of Object.values(DIFF_MAP)) {
    if (forcedPackIds.includes(pack.id) || triggerMatchesPack(pack.triggerSlots, selectionSlotKeys, selectedValueIds)) {
      let reason = 'Automatic quality protection'
      if (pack.id === 'real-photo-base') reason = 'Base realism pack'
      else if (pack.id === 'device-specific-fix' && device) reason = `${device.labelZh} specific protection`
      else if (pack.id === 'hand-fix') reason = 'Hand pose or handheld object detected'
      else if (pack.id === 'face-fix') reason = 'Face-sensitive prompt detected'
      else if (pack.id === 'skin-realism') reason = 'Skin realism protection'
      else if (pack.id === 'motion-fix') reason = 'Motion scene protection'
      else if (pack.id === 'object-product-fix') reason = 'Object holding protection'

      enabledPacks.push({ id: pack.id, label: pack.labelZh, reason })
      negativeParts.push(...pack.negativePrompt)

      if (pack.id === 'device-specific-fix' && device) {
        negativeParts.push(...device.negativePrompt)
      }
    }
  }

  const outputLang = resolveOutputLanguage(advancedSelections)
  const promptStyle = options?.promptStyle ?? 'tag'
  const segmented = buildSegmentedPrompt(advancedSelections, {
    outputLang,
    promptStyle,
    freeformPositive: options?.freeformPositive,
  })

  const importedParameterSuffix = options?.importedParameterSuffix?.trim()
  const parameterSuffix = importedParameterSuffix
    ? [importedParameterSuffix, aspectRatio].filter(Boolean).join('\n')
    : paramPreset
      ? `${paramPreset.midjourney}\n${aspectRatio}`
      : `${aspectRatio}\n--style raw --s 50 --c 5`

  return {
    positivePrompt: segmented.positivePrompt,
    flatPrompt: segmented.flatPrompt,
    naturalPrompt: segmented.naturalPrompt,
    sections: segmented.sections,
    negativePrompt: [...new Set(negativeParts.filter(Boolean))],
    parameterSuffix,
    autoEnabledPacks: enabledPacks,
  }
}
