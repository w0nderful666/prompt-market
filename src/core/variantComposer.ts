import type { DirectorSelection, PoseVariant, PosePipeline, PoseShot, ScenePoseRule } from './types'
import { selectPipeline } from '../data/posePipelines'
import { getScenePoseRule } from '../data/scenePoseRules'
import { DEVICE_MAP } from '../data/devicePresets'
import { SCENE_MAP } from '../data/scenePacks'
import { LIGHT_MAP } from '../data/lightPacks'
import { STATE_MAP } from '../data/statePacks'
import { DIFF_MAP } from '../data/diffPacks'

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function resolveGenericChoice(text: string, choices: string[]): string {
  if (!text) return text
  const match = text.match(/从[^]*?([\u4e00-\u9fff\w]+)[^]*?选一个/)
  if (match) {
    if (choices.length > 0) return pickRandom(choices)
    return match[1]
  }
  return text
}

function resolveShotWithSceneRule(shot: PoseShot, rule: ScenePoseRule | null, intensity: string): PoseShot {
  if (!rule) return shot

  let bodyPose = shot.bodyPose
  let handTask = shot.handTask
  let gaze = shot.gaze
  let expression = shot.expression
  let cameraCrop = shot.cameraCrop
  let motionCue = shot.motionCue
  const avoid = [...shot.avoid, ...rule.forbiddenActions]

  if (bodyPose.includes('自然站立或坐姿') || bodyPose.includes('选一个')) {
    const filtered = rule.allowedBasePoses.filter(p => !rule.forbiddenActions.some(f => p.includes(f)))
    if (filtered.length > 0) bodyPose = pickRandom(filtered)
  }

  if (handTask.includes('选一个')) {
    const filtered = rule.allowedHandTasks.filter(h => !rule.forbiddenActions.some(f => h.includes(f)))
    if (filtered.length > 0) handTask = pickRandom(filtered)
  }

  if (gaze.includes('选一个') || gaze === '看向画面外') {
    const filtered = rule.allowedGazes.filter(g => !rule.forbiddenActions.some(f => g.includes(f)))
    if (filtered.length > 0) gaze = pickRandom(filtered)
  }

  if (expression.includes('选一个')) {
    const filtered = rule.allowedExpressions.filter(e => !rule.forbiddenActions.some(f => e.includes(f)))
    if (filtered.length > 0) expression = pickRandom(filtered)
  }

  if (rule.preferredCrops.length > 0 && !rule.preferredCrops.includes(cameraCrop)) {
    cameraCrop = pickRandom(rule.preferredCrops)
  }

  if (rule.preferredMotion.length > 0) {
    motionCue = pickRandom(rule.preferredMotion)
  }

  bodyPose = resolveGenericChoice(bodyPose, rule.allowedBasePoses)
  handTask = resolveGenericChoice(handTask, rule.allowedHandTasks)
  gaze = resolveGenericChoice(gaze, rule.allowedGazes)
  expression = resolveGenericChoice(expression, rule.allowedExpressions)

  return { ...shot, bodyPose, handTask, gaze, expression, cameraCrop, motionCue, avoid }
}

function autoDetectDiffPacks(shot: PoseShot): string[] {
  const packs: string[] = [...shot.requiredDiffPacks]
  const hand = shot.handTask || ''
  const body = shot.bodyPose || ''
  const crop = shot.cameraCrop || ''
  const motion = shot.motionCue || ''
  const gaze = shot.gaze || ''

  if (hand.includes('手') || hand.includes('拿') || hand.includes('扶') || hand.includes('拨') || hand.includes('撑') || hand.includes('伞') || hand.includes('手机') || hand.includes('咖啡') || hand.includes('花') || hand.includes('袋') || hand.includes('帽')) {
    if (!packs.includes('hand-fix')) packs.push('hand-fix')
  }
  if (hand.includes('咖啡') || hand.includes('杯') || hand.includes('手机') || hand.includes('书') || hand.includes('伞') || hand.includes('袋') || hand.includes('花') || hand.includes('饮料') || hand.includes('道具') || hand.includes('耳机') || hand.includes('帽子')) {
    if (!packs.includes('object-product-fix')) packs.push('object-product-fix')
  }
  if (body.includes('行走') || body.includes('转身') || body.includes('回眸') || body.includes('跳跃') || body.includes('走动') || motion.includes('模糊') || motion.includes('动态') || motion.includes('运动') || motion.includes('风吹') || motion.includes('转身') || motion.includes('走动')) {
    if (!packs.includes('motion-fix')) packs.push('motion-fix')
  }
  if (crop.includes('特写') || crop.includes('近景') || crop.includes('头像') || gaze.includes('看镜头')) {
    if (!packs.includes('face-fix')) packs.push('face-fix')
  }
  if (body.includes('坐') || body.includes('蹲') || body.includes('躺') || body.includes('卧')) {
    if (!packs.includes('real-photo-base')) packs.unshift('real-photo-base')
  }

  return [...new Set(packs)]
}

function buildVariantPositivePrompt(basePrompt: string, shot: PoseShot): string {
  const parts: string[] = []

  if (basePrompt) parts.push(basePrompt)

  const poseParts: string[] = []
  if (shot.bodyPose && !shot.bodyPose.includes('选一个')) poseParts.push(shot.bodyPose)
  if (shot.bodyAngle) poseParts.push(shot.bodyAngle)
  if (shot.weightShift) poseParts.push(shot.weightShift)
  if (shot.handTask && !shot.handTask.includes('选一个')) poseParts.push(shot.handTask)
  if (shot.gaze && !shot.gaze.includes('选一个')) poseParts.push(shot.gaze)
  if (shot.expression && !shot.expression.includes('选一个')) poseParts.push(shot.expression)
  if (shot.sceneInteraction) poseParts.push(shot.sceneInteraction)
  if (shot.cameraCrop && !shot.cameraCrop.includes('选一个')) poseParts.push(shot.cameraCrop)
  if (shot.cameraAngle) poseParts.push(shot.cameraAngle)
  if (shot.motionCue && !shot.motionCue.includes('选一个')) poseParts.push(shot.motionCue)

  if (poseParts.length > 0) {
    parts.push(poseParts.join('，'))
  }

  return parts.join('，')
}

function buildVariantNegative(packIds: string[], shot: PoseShot): string[] {
  const negs: string[] = []
  for (const packId of packIds) {
    const pack = DIFF_MAP[packId]
    if (pack) {
      negs.push(...pack.negativePrompt)
    }
  }
  if (shot.avoid.length > 0) {
    negs.push(...shot.avoid)
  }
  return [...new Set(negs)]
}

export interface GenerateVariantsOptions {
  variantCount: 3 | 5 | 9
  intensity: 'subtle' | 'standard' | 'dynamic'
}

export function generatePoseVariants(
  sel: DirectorSelection,
  options: GenerateVariantsOptions
): PoseVariant[] {
  const pipeline = selectPipeline(sel.scenePack || '', options.variantCount, options.intensity)
  if (!pipeline) return []

  const device = sel.devicePreset ? DEVICE_MAP[sel.devicePreset] : null
  const scene = sel.scenePack ? SCENE_MAP[sel.scenePack] : null
  const light = sel.lightPack ? LIGHT_MAP[sel.lightPack] : null
  const states = sel.statePacks.map(id => STATE_MAP[id]).filter(Boolean)

  const sceneRule = sel.scenePack ? getScenePoseRule(sel.scenePack) : null

  const baseParts: string[] = []
  if (scene) baseParts.push(scene.positivePromptZh)
  for (const st of states) baseParts.push(st.positivePromptZh)
  if (device) baseParts.push(device.positivePromptZh)
  if (light) baseParts.push(light.positivePromptZh)
  const basePrompt = baseParts.join('，')

  const variants: PoseVariant[] = []
  for (const rawShot of pipeline.sequence) {
    const resolvedShot = resolveShotWithSceneRule(rawShot, sceneRule, options.intensity)

    const autoPacks = autoDetectDiffPacks(resolvedShot)
    const positive = buildVariantPositivePrompt(basePrompt, resolvedShot)
    const negative = buildVariantNegative(autoPacks, resolvedShot)

    variants.push({
      shot: { ...resolvedShot, requiredDiffPacks: autoPacks },
      pipelineId: pipeline.id,
      positivePrompt: positive,
      negativePrompt: negative,
      autoDiffPacks: autoPacks,
    })
  }

  return variants
}

export { resolveShotWithSceneRule }
