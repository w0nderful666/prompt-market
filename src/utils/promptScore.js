/**
 * Prompt quality scoring engine - 16 dimensions, 0-100 total
 */

import { detectConflicts } from './conflictDetector.js'
import { detectSafety } from './safety.js'

function hasContent(text) {
  return !!(text && text.trim().length > 2)
}

function charLen(text) {
  return (text || '').trim().length
}

const DIMENSIONS = [
  {
    id: 'subjectClarity',
    label: '主体明确度',
    weight: 7,
    check(d) { return charLen(d.subject) > 10 ? 2 : charLen(d.subject) > 5 ? 1 : 0 },
    suggestion: '当前主体描述较弱，建议补充主体的年龄、性别、气质和关键特征，例如："一位二十出头的年轻女性，头戴白色兔耳发箍，自然站姿"'
  },
  {
    id: 'sceneClarity',
    label: '场景明确度',
    weight: 7,
    check(d) { return charLen(d.scene) > 10 ? 2 : charLen(d.scene) > 5 ? 1 : 0 },
    suggestion: '当前场景描述不足，建议补充具体地点和环境细节，例如："夜晚便利店门口，自动门半开，冷白色灯光从店内透出"'
  },
  {
    id: 'compositionClarity',
    label: '构图明确度',
    weight: 6,
    check(d) { return charLen(d.composition) > 8 ? 2 : charLen(d.composition) > 3 ? 1 : 0 },
    suggestion: '当前构图描述较弱，建议补充取景范围和视角，例如："近景半身，三分法构图，主体略偏离中心"'
  },
  {
    id: 'lightingClarity',
    label: '光线明确度',
    weight: 7,
    check(d) { return charLen(d.lighting) > 10 ? 2 : charLen(d.lighting) > 5 ? 1 : 0 },
    suggestion: '当前光线描述较弱，建议补充光源位置和色温，例如：浴室顶灯、便利店冷光、窗边自然光或黄昏逆光'
  },
  {
    id: 'textureClarity',
    label: '质感明确度',
    weight: 6,
    check(d) { return charLen(d.camera) > 10 ? 2 : charLen(d.camera) > 5 ? 1 : 0 },
    suggestion: '当前画面质感描述不足，建议补充摄影设备和画面特征，例如："35mm 胶片摄影，胶片颗粒，轻微色偏偏青，自然暗角"'
  },
  {
    id: 'poseClarity',
    label: '动作/姿势明确度',
    weight: 6,
    check(d) {
      const hasBody = charLen(d.body) > 5
      const hasExpr = charLen(d.expression) > 5
      return hasBody && hasExpr ? 2 : hasBody || hasExpr ? 1 : 0
    },
    suggestion: '当前动作/姿势描述不足，建议同时补充身体姿态和表情，例如："自然站立，肩膀微耸" + "看向镜头，嘴角微扬"'
  },
  {
    id: 'outfitClarity',
    label: '服装/配件明确度',
    weight: 6,
    check(d) { return charLen(d.clothing) > 10 ? 2 : charLen(d.clothing) > 5 ? 1 : 0 },
    suggestion: '当前服装描述不足，建议补充具体服装款式和配件，例如："白色棉质吊带背心，灰色居家短裤，领口微皱"'
  },
  {
    id: 'backgroundCompleteness',
    label: '背景完整度',
    weight: 6,
    check(d) { return charLen(d.background) > 10 ? 2 : charLen(d.background) > 5 ? 1 : 0 },
    suggestion: '当前背景描述不足，建议补充背景元素和层次，例如："白色瓷砖墙面，洗手台边缘，牙刷杯，镜面反光"'
  },
  {
    id: 'atmosphereConsistency',
    label: '氛围一致性',
    weight: 6,
    check(d) { return charLen(d.atmosphere) > 10 ? 2 : charLen(d.atmosphere) > 5 ? 1 : 0 },
    suggestion: '当前氛围描述不足，建议补充整体情绪基调，例如："私密但不过度性感，真实生活气息，像朋友圈发的随手拍"'
  },
  {
    id: 'mustKeepCompleteness',
    label: 'Must Keep 完整度',
    weight: 6,
    check(d) { return charLen(d.mustKeep) > 10 ? 2 : charLen(d.mustKeep) > 5 ? 1 : 0 },
    suggestion: '当前 Must Keep 描述不足，建议列出必须保留的元素，例如："自然皮肤纹理，毛孔可见，不过度磨皮，真实生活感"'
  },
  {
    id: 'avoidCompleteness',
    label: 'Avoid 完整度',
    weight: 6,
    check(d) { return charLen(d.avoid) > 10 ? 2 : charLen(d.avoid) > 5 ? 1 : 0 },
    suggestion: '当前 Avoid 描述不足，建议列出需要避免的元素，例如："过度精修，塑料皮肤，网红脸，商业棚拍感"'
  },
  {
    id: 'failureGuard',
    label: 'Failure Guard 完整度',
    weight: 6,
    check(d) {
      const hasMK = hasContent(d.mustKeep)
      const hasAv = hasContent(d.avoid)
      return hasMK && hasAv ? 2 : hasMK || hasAv ? 1 : 0
    },
    suggestion: 'Must Keep 和 Avoid 只填写了一个，建议两者都填写以形成双向约束，提高生成成功率'
  },
  {
    id: 'modelAdaptation',
    label: '模型适配度',
    weight: 6,
    check(d) { return hasContent(d.model) ? 2 : 0 },
    suggestion: '未指定推荐模型，建议选择目标模型（如 GPT Image / Midjourney / Stable Diffusion / Flux）以获得更好的适配效果'
  },
  {
    id: 'ratioClarity',
    label: '比例明确度',
    weight: 6,
    check(d) { return hasContent(d.ratio) ? 2 : 0 },
    suggestion: '未指定画面比例，建议选择合适的比例（如 1:1 正方形、3:4 竖版、16:9 宽屏、9:16 手机竖屏）'
  },
  {
    id: 'conflictRisk',
    label: '冲突风险',
    weight: 7,
    check(d) {
      const conflicts = detectConflicts(d)
      return conflicts.length === 0 ? 2 : conflicts.length <= 2 ? 1 : 0
    },
    suggestion: '检测到提示词冲突，建议检查并移除矛盾的描述词，避免模型困惑导致生成质量下降'
  },
  {
    id: 'contentRisk',
    label: '内容风险',
    weight: 7,
    check(d) {
      const safety = detectSafety(d)
      return safety.level === 'Safe' ? 2 : safety.level === 'Caution' ? 1 : 0
    },
    suggestion: '检测到内容风险，建议使用更安全的描述方式，或在 Must Keep 中添加约束条件'
  }
]

/**
 * Score a director configuration across 16 dimensions
 */
export function scorePrompt(director) {
  if (!director) {
    return { score: 0, level: 'Incomplete', details: [], pros: [], suggestions: [] }
  }

  let totalScore = 0
  const details = []

  for (const dim of DIMENSIONS) {
    const result = dim.check(director)
    const dimScore = result === 2 ? dim.weight : result === 1 ? dim.weight / 2 : 0
    totalScore += dimScore
    details.push({
      id: dim.id,
      label: dim.label,
      score: dimScore,
      maxScore: dim.weight,
      passed: result === 2,
      partial: result === 1,
      suggestion: result < 2 ? dim.suggestion : ''
    })
  }

  totalScore = Math.min(100, Math.round(totalScore))

  const pros = []
  const suggestions = []

  // Collect pros
  if (charLen(director.subject) > 10) pros.push('主体描述明确')
  if (charLen(director.scene) > 10) pros.push('场景设定清晰')
  if (charLen(director.composition) > 8) pros.push('构图方案完整')
  if (charLen(director.lighting) > 10) pros.push('光线描述到位')
  if (charLen(director.camera) > 10) pros.push('风格质感明确')
  if (charLen(director.body) > 5 && charLen(director.expression) > 5) pros.push('动作和表情都有描述')
  if (charLen(director.clothing) > 10) pros.push('服装描述详细')
  if (hasContent(director.mustKeep) && hasContent(director.avoid)) pros.push('Must Keep 和 Avoid 双向约束')
  if (hasContent(director.model)) pros.push('指定了目标模型')
  if (hasContent(director.ratio)) pros.push('指定了画面比例')

  // Collect suggestions from failed dimensions
  for (const detail of details) {
    if (!detail.passed && detail.suggestion) {
      suggestions.push(detail.suggestion)
    }
  }

  const level = totalScore >= 90 ? 'Excellent' : totalScore >= 70 ? 'Good' : totalScore >= 50 ? 'Needs Work' : 'Incomplete'

  return { score: totalScore, level, details, pros, suggestions }
}

export { DIMENSIONS }
