/**
 * Prompt quality scoring engine - evaluates completeness and quality
 */

function hasContent(text) {
  return !!(text && text.trim().length > 2)
}

function countWords(text) {
  if (!text) return 0
  return text.trim().split(/[\s，,、；;。.]+/).filter(Boolean).length
}

function hasConflict(text) {
  if (!text) return false
  const lower = text.toLowerCase()
  const conflicts = [
    ['写实', '动漫', '卡通', '插画'],
    ['realistic', 'anime', 'cartoon', 'illustration'],
    ['柔光', '硬光', '直闪'],
    ['soft light', 'hard light', 'direct flash'],
    ['低饱和', '高饱和', '过饱和'],
    ['low saturation', 'oversaturated']
  ]
  return conflicts.some(([a, ...rest]) =>
    lower.includes(a) && rest.some(r => lower.includes(r))
  )
}

export function scorePrompt(director) {
  const checks = [
    { id: 'subject', label: '主体是否明确', weight: 12, check: () => hasContent(director.subject) },
    { id: 'scene', label: '场景是否明确', weight: 10, check: () => hasContent(director.scene) },
    { id: 'composition', label: '构图是否明确', weight: 10, check: () => hasContent(director.composition) },
    { id: 'lighting', label: '光线是否明确', weight: 10, check: () => hasContent(director.lighting) },
    { id: 'camera', label: '风格是否明确', weight: 10, check: () => hasContent(director.camera) },
    { id: 'detail', label: '细节是否具体', weight: 10, check: () => {
      const detailFields = ['face', 'hair', 'body', 'clothing', 'expression']
      const filled = detailFields.filter(f => hasContent(director[f])).length
      return filled >= 2
    }},
    { id: 'mustKeep', label: '是否包含必须保留', weight: 8, check: () => hasContent(director.mustKeep) },
    { id: 'avoid', label: '是否包含避免项', weight: 8, check: () => hasContent(director.avoid) },
    { id: 'ratio', label: '是否指定比例', weight: 6, check: () => hasContent(director.ratio) },
    { id: 'noConflict', label: '是否存在冲突描述', weight: 16, check: () => {
      const all = [director.subject, director.scene, director.camera, director.lighting, director.atmosphere].join(' ')
      return !hasConflict(all)
    }}
  ]

  let totalScore = 0
  const details = []

  for (const check of checks) {
    const passed = check.check()
    if (passed) totalScore += check.weight
    details.push({ ...check, passed })
  }

  const pros = []
  const suggestions = []

  if (hasContent(director.subject)) pros.push('主体描述明确')
  if (hasContent(director.scene)) pros.push('场景设定清晰')
  if (hasContent(director.composition)) pros.push('构图方案完整')
  if (hasContent(director.lighting)) pros.push('光线描述到位')
  if (hasContent(director.camera)) pros.push('风格质感明确')
  if (hasContent(director.mustKeep) && hasContent(director.avoid)) pros.push('包含必须保留和避免项')

  if (!hasContent(director.expression)) suggestions.push('可以补充表情和情绪描述')
  if (!hasContent(director.face)) suggestions.push('可以补充妆容细节')
  if (!hasContent(director.background)) suggestions.push('可以明确背景层次')
  if (!hasContent(director.atmosphere)) suggestions.push('可以描述整体氛围')
  if (!hasContent(director.ratio)) suggestions.push('可以指定画面比例')
  if (countWords(director.subject) < 5) suggestions.push('主体描述可以更具体')
  if (!hasContent(director.mustKeep)) suggestions.push('建议添加必须保留的元素')
  if (!hasContent(director.avoid)) suggestions.push('建议添加需要避免的元素')

  return {
    score: Math.min(100, totalScore),
    details,
    pros,
    suggestions,
    level: totalScore >= 90 ? '优秀' : totalScore >= 70 ? '良好' : totalScore >= 50 ? '一般' : '需要完善'
  }
}
