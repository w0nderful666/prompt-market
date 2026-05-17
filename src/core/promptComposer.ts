import type { DirectorSelection, ComposedOutput, AutoEnabledPack } from './types'
import { DEVICE_MAP } from '../data/devicePresets'
import { SCENE_MAP } from '../data/scenePacks'
import { LIGHT_MAP } from '../data/lightPacks'
import { STATE_MAP } from '../data/statePacks'
import { DIFF_MAP } from '../data/diffPacks'
import { MASTER_TEMPLATE_MAP } from '../data/masterTemplates'
import { PARAMETER_MAP } from '../data/parameterPresets'
import type { DirectorTemplate } from './types'

function triggerMatchesPack(packTriggerSlots: string[], selectionSlotKeys: string[], selectedValueIds: string[]): boolean {
  if (packTriggerSlots.includes('*')) return true
  for (const trigger of packTriggerSlots) {
    if (selectionSlotKeys.includes(trigger)) return true
    if (selectedValueIds.includes(trigger)) return true
  }
  return false
}

export function composePrompt(sel: DirectorSelection): ComposedOutput {
  const device = sel.devicePreset ? DEVICE_MAP[sel.devicePreset] : null
  const scene = sel.scenePack ? SCENE_MAP[sel.scenePack] : null
  const light = sel.lightPack ? LIGHT_MAP[sel.lightPack] : null
  const states = sel.statePacks.map(id => STATE_MAP[id]).filter(Boolean)
  const paramPreset = sel.parameterPreset ? PARAMETER_MAP[sel.parameterPreset] : null
  const tpl: DirectorTemplate | null = sel.directorTemplate ? MASTER_TEMPLATE_MAP[sel.directorTemplate] ?? null : null

  let aspectRatio = '--ar 4:5'
  if (tpl) {
    aspectRatio = `--ar ${tpl.lockedCore.aspectRatio}`
  } else if (device) {
    aspectRatio = `--ar ${device.defaultAspectRatios[0]}`
  }

  const positiveParts: string[] = []

  if (scene) {
    positiveParts.push(scene.positivePromptZh)
  }

  for (const st of states) {
    positiveParts.push(st.positivePromptZh)
  }

  if (sel.customProps.length > 0) {
    positiveParts.push(`手里自然${sel.customProps.length > 1 ? '分别' : ''}拿着${sel.customProps.join('和')}`)
  }

  if (device) {
    positiveParts.push(device.positivePromptZh)
  }

  if (light) {
    positiveParts.push(light.positivePromptZh)
  }

  const positivePrompt = positiveParts.join('，')

  const enabledPacks: AutoEnabledPack[] = []
  const negativeParts: string[] = []
  const positiveRepairParts: string[] = []

  const selectionSlotKeys: string[] = []
  const selectedValueIds: string[] = []

  if (device) selectionSlotKeys.push('devicePreset')
  if (scene) selectionSlotKeys.push('scenePack')
  if (light) selectionSlotKeys.push('lightPack')
  for (const sid of sel.statePacks) {
    selectionSlotKeys.push('statePack')
    selectedValueIds.push(sid)
  }
  for (const prop of sel.customProps) {
    selectedValueIds.push(`prop_${prop}`)
    selectionSlotKeys.push('handheld')
  }

  for (const pack of Object.values(DIFF_MAP)) {
    if (triggerMatchesPack(pack.triggerSlots, selectionSlotKeys, selectedValueIds)) {
      let reason = ''
      if (pack.id === 'real-photo-base') reason = '所有写实人像默认启用'
      else if (pack.id === 'no-random-text') reason = '默认防文字乱码'
      else if (pack.id === 'device-specific-fix' && device) reason = `已选择「${device.labelZh}」，自动启用设备专属修复`
      else if (pack.id === 'hand-fix') reason = sel.statePacks.length > 0 ? '已选择手部动作或手持物品，自动启用手部修复' : '已选择手持物品，自动启用手部修复'
      else if (pack.id === 'face-fix') reason = '已选择面部相关状态，自动启用面部修复'
      else if (pack.id === 'skin-realism') reason = '已选择写真人像，自动启用皮肤真实纹理修复'
      else if (pack.id === 'motion-fix') reason = '已选择动态状态，自动启用动态动作防扭曲'
      else if (pack.id === 'object-product-fix') reason = '已选择手持物品，自动启用产品/道具修复'
      else reason = `自动启用「${pack.labelZh}」`

      enabledPacks.push({ id: pack.id, label: pack.labelZh, reason })
      negativeParts.push(...pack.negativePrompt)
      positiveRepairParts.push(...pack.positiveRepair)

      if (pack.id === 'device-specific-fix' && device) {
        negativeParts.push(...device.negativePrompt)
      }
    }
  }

  const negativePrompt = [...new Set(negativeParts)]

  const paramSuffix = paramPreset
    ? `\n${paramPreset.midjourney}\n${aspectRatio}`
    : `\n${aspectRatio}\n--style raw --s 50 --c 5`

  return {
    positivePrompt,
    negativePrompt,
    parameterSuffix: paramSuffix,
    autoEnabledPacks: enabledPacks,
  }
}
