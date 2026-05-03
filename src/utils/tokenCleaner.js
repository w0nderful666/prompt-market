/**
 * Token Cleaner - cleans and deduplicates prompt text
 */

export function cleanPrompt(director) {
  const cleaned = { ...director }
  const issues = []

  // Clean each field
  for (const [key, value] of Object.entries(cleaned)) {
    if (typeof value !== 'string' || !value.trim()) continue

    let clean = value
    const original = clean

    // Remove duplicate punctuation
    clean = clean.replace(/[，,]{2,}/g, '，')
    clean = clean.replace(/[。.]{2,}/g, '。')
    clean = clean.replace(/[；;]{2,}/g, '；')
    clean = clean.replace(/[！!]{2,}/g, '！')
    clean = clean.replace(/[？?]{2,}/g, '？')

    // Fix mixed spacing
    clean = clean.replace(/\s*[，,]\s*/g, '，')
    clean = clean.replace(/\s*[。.]\s*/g, '。')
    clean = clean.replace(/\s+/g, ' ')

    // Remove leading/trailing punctuation and spaces
    clean = clean.replace(/^[，,。.；;\s]+/, '').replace(/[，,。.；;\s]+$/, '')

    // Deduplicate phrases within a field
    const parts = clean.split(/[，,、]/).map(p => p.trim()).filter(Boolean)
    const uniqueParts = [...new Set(parts)]
    if (uniqueParts.length < parts.length) {
      const removed = parts.length - uniqueParts.length
      issues.push({ field: key, type: 'duplicate', message: `${getFieldLabel(key)}：移除了 ${removed} 个重复词` })
    }
    clean = uniqueParts.join('，')

    // Detect stacked adjectives (3+ consecutive adjectives without noun)
    const adjPatterns = [
      /(?:非常|特别|极其|十分|格外|超级|超|很|very|extremely|super|incredibly)\s*(?:非常|特别|极其|十分|格外|超级|超|很|very|extremely|super)/gi,
      /(?:美丽|漂亮|精致|华丽|优美|beautiful|gorgeous|stunning|exquisite)\s*(?:美丽|漂亮|精致|华丽|优美|beautiful|gorgeous|stunning|exquisite)/gi
    ]
    for (const pattern of adjPatterns) {
      if (pattern.test(clean)) {
        clean = clean.replace(pattern, (match) => match.split(/\s+/)[0])
        issues.push({ field: key, type: 'stacked_adj', message: `${getFieldLabel(key)}：清理了堆叠形容词` })
      }
    }

    if (clean !== original) {
      cleaned[key] = clean
    }
  }

  // Detect empty modules
  const emptyFields = []
  const importantFields = ['subject', 'scene', 'composition', 'lighting', 'camera']
  for (const field of importantFields) {
    if (!cleaned[field] || !cleaned[field].trim()) {
      emptyFields.push(field)
    }
  }
  if (emptyFields.length) {
    issues.push({
      field: 'empty',
      type: 'empty_modules',
      message: `${emptyFields.length} 个核心模块为空：${emptyFields.map(getFieldLabel).join('、')}`
    })
  }

  // Detect duplicate avoid items
  if (cleaned.avoid) {
    const avoidParts = cleaned.avoid.split(/[，,、]/).map(p => p.trim()).filter(Boolean)
    const uniqueAvoid = [...new Set(avoidParts)]
    if (uniqueAvoid.length < avoidParts.length) {
      issues.push({ field: 'avoid', type: 'duplicate', message: `避免项：移除了 ${avoidParts.length - uniqueAvoid.length} 个重复项` })
      cleaned.avoid = uniqueAvoid.join('，')
    }
  }

  // Detect duplicate must-keep items
  if (cleaned.mustKeep) {
    const keepParts = cleaned.mustKeep.split(/[，,、]/).map(p => p.trim()).filter(Boolean)
    const uniqueKeep = [...new Set(keepParts)]
    if (uniqueKeep.length < keepParts.length) {
      issues.push({ field: 'mustKeep', type: 'duplicate', message: `必须保留：移除了 ${keepParts.length - uniqueKeep.length} 个重复项` })
      cleaned.mustKeep = uniqueKeep.join('，')
    }
  }

  return { cleaned, issues }
}

function getFieldLabel(key) {
  const labels = {
    model: '模型/用途', subject: '主体设定', scene: '场景环境', composition: '构图与镜头',
    expression: '表情与状态', face: '脸部与妆容', hair: '发型与细节', body: '身体与姿势',
    clothing: '服装与配件', lighting: '光线与色彩', camera: '摄影/画面质感',
    background: '背景元素', atmosphere: '整体氛围', caption: 'Caption感',
    mustKeep: '必须保留', avoid: '避免项', ratio: '比例/尺寸'
  }
  return labels[key] || key
}
