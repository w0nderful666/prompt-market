import { detectConflicts } from './conflictDetector'
import { detectSafety } from './safety'
import type { DirectorData } from './storage'

function hasContent(text: string) { return !!(text && text.trim().length > 2) }
function charLen(text: string) { return (text || '').trim().length }

interface Dim { id: string; label: string; weight: number; check(d: DirectorData): number; suggestion: string }

const DIMENSIONS: Dim[] = [
  { id: 'subjectClarity', label: '主体明确度', weight: 7, check(d) { return charLen(d.subject) > 10 ? 2 : charLen(d.subject) > 5 ? 1 : 0 }, suggestion: '当前主体描述较弱，建议补充主体的年龄、性别、气质和关键特征' },
  { id: 'sceneClarity', label: '场景明确度', weight: 7, check(d) { return charLen(d.scene) > 10 ? 2 : charLen(d.scene) > 5 ? 1 : 0 }, suggestion: '当前场景描述不足，建议补充具体地点和环境细节' },
  { id: 'compositionClarity', label: '构图明确度', weight: 6, check(d) { return charLen(d.composition) > 8 ? 2 : charLen(d.composition) > 3 ? 1 : 0 }, suggestion: '当前构图描述较弱，建议补充取景范围和视角' },
  { id: 'lightingClarity', label: '光线明确度', weight: 7, check(d) { return charLen(d.lighting) > 10 ? 2 : charLen(d.lighting) > 5 ? 1 : 0 }, suggestion: '当前光线描述较弱，建议补充光源位置和色温' },
  { id: 'textureClarity', label: '质感明确度', weight: 6, check(d) { return charLen(d.camera) > 10 ? 2 : charLen(d.camera) > 5 ? 1 : 0 }, suggestion: '当前画面质感描述不足，建议补充摄影设备和画面特征' },
  { id: 'poseClarity', label: '动作/姿势明确度', weight: 6, check(d) { const b = charLen(d.body) > 5; const e = charLen(d.expression) > 5; return b && e ? 2 : b || e ? 1 : 0 }, suggestion: '当前动作/姿势描述不足，建议同时补充身体姿态和表情' },
  { id: 'outfitClarity', label: '服装/配件明确度', weight: 6, check(d) { return charLen(d.clothing) > 10 ? 2 : charLen(d.clothing) > 5 ? 1 : 0 }, suggestion: '当前服装描述不足，建议补充具体服装款式和配件' },
  { id: 'backgroundCompleteness', label: '背景完整度', weight: 6, check(d) { return charLen(d.background) > 10 ? 2 : charLen(d.background) > 5 ? 1 : 0 }, suggestion: '当前背景描述不足，建议补充背景元素和层次' },
  { id: 'atmosphereConsistency', label: '氛围一致性', weight: 6, check(d) { return charLen(d.atmosphere) > 10 ? 2 : charLen(d.atmosphere) > 5 ? 1 : 0 }, suggestion: '当前氛围描述不足，建议补充整体情绪基调' },
  { id: 'mustKeepCompleteness', label: 'Must Keep 完整度', weight: 6, check(d) { return charLen(d.mustKeep) > 10 ? 2 : charLen(d.mustKeep) > 5 ? 1 : 0 }, suggestion: '当前 Must Keep 描述不足' },
  { id: 'avoidCompleteness', label: 'Avoid 完整度', weight: 6, check(d) { return charLen(d.avoid) > 10 ? 2 : charLen(d.avoid) > 5 ? 1 : 0 }, suggestion: '当前 Avoid 描述不足' },
  { id: 'failureGuard', label: 'Failure Guard 完整度', weight: 6, check(d) { const mk = hasContent(d.mustKeep); const av = hasContent(d.avoid); return mk && av ? 2 : mk || av ? 1 : 0 }, suggestion: 'Must Keep 和 Avoid 只填写了一个，建议两者都填写' },
  { id: 'modelAdaptation', label: '模型适配度', weight: 6, check(d) { return hasContent(d.model) ? 2 : 0 }, suggestion: '未指定推荐模型，建议选择目标模型' },
  { id: 'ratioClarity', label: '比例明确度', weight: 6, check(d) { return hasContent(d.ratio) ? 2 : 0 }, suggestion: '未指定画面比例，建议选择合适的比例' },
  { id: 'conflictRisk', label: '冲突风险', weight: 7, check(d) { const c = detectConflicts(d); return c.length === 0 ? 2 : c.length <= 2 ? 1 : 0 }, suggestion: '检测到提示词冲突，建议检查并移除矛盾的描述词' },
  { id: 'contentRisk', label: '内容风险', weight: 7, check(d) { const s = detectSafety(d); return s.level === 'Safe' ? 2 : s.level === 'Caution' ? 1 : 0 }, suggestion: '检测到内容风险，建议使用更安全的描述方式' },
]

export function scorePrompt(director: DirectorData) {
  if (!director) return { score: 0, level: 'Incomplete', details: [], pros: [], suggestions: [] }
  let totalScore = 0
  const details: any[] = []
  for (const dim of DIMENSIONS) {
    const result = dim.check(director)
    const dimScore = result === 2 ? dim.weight : result === 1 ? dim.weight / 2 : 0
    totalScore += dimScore
    details.push({ id: dim.id, label: dim.label, score: dimScore, maxScore: dim.weight, passed: result === 2, partial: result === 1, suggestion: result < 2 ? dim.suggestion : '' })
  }
  totalScore = Math.min(100, Math.round(totalScore))
  const pros: string[] = []
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
  const suggestions = details.filter(d => !d.passed && d.suggestion).map(d => d.suggestion)
  const level = totalScore >= 90 ? 'Excellent' : totalScore >= 70 ? 'Good' : totalScore >= 50 ? 'Needs Work' : 'Incomplete'
  return { score: totalScore, level, details, pros, suggestions }
}

export { DIMENSIONS }
