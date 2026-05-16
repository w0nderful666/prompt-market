import type { DirectorData } from './storage'

const FIELD_LABELS: Record<string, string> = {
  model: '模型/用途', subject: '主体设定', scene: '场景环境', composition: '构图与镜头',
  expression: '表情与状态', face: '脸部与妆容', hair: '发型与细节', body: '身体与姿势',
  clothing: '服装与配件', lighting: '光线与色彩', camera: '摄影/画面质感',
  background: '背景元素', atmosphere: '整体氛围', caption: 'Caption感',
  mustKeep: '必须保留', avoid: '避免项', ratio: '比例/尺寸'
}

function getFieldLabel(key: string) { return FIELD_LABELS[key] || key }

export function cleanPrompt(director: DirectorData) {
  const cleaned = { ...director } as any
  const issues: any[] = []

  for (const [key, value] of Object.entries(cleaned)) {
    if (typeof value !== 'string' || !value.trim()) continue
    let clean = value as string
    const original = clean
    clean = clean.replace(/[，,]{2,}/g, '，').replace(/[。.]{2,}/g, '。').replace(/[；;]{2,}/g, '；').replace(/[！!]{2,}/g, '！').replace(/[？?]{2,}/g, '？')
    clean = clean.replace(/\s*[，,]\s*/g, '，').replace(/\s*[。.]\s*/g, '。').replace(/\s+/g, ' ')
    clean = clean.replace(/^[，,。.；;\s]+/, '').replace(/[，,。.；;\s]+$/, '')
    const parts = clean.split(/[，,、]/).map(p => p.trim()).filter(Boolean)
    const uniqueParts = [...new Set(parts)]
    if (uniqueParts.length < parts.length) issues.push({ field: key, type: 'duplicate', message: `${getFieldLabel(key)}：移除了 ${parts.length - uniqueParts.length} 个重复词` })
    clean = uniqueParts.join('，')
    const adjPatterns = [/(?:非常|特别|极其|十分|格外|超级|超|很|very|extremely|super|incredibly)\s*(?:非常|特别|极其|十分|格外|超级|超|很|very|extremely|super)/gi, /(?:美丽|漂亮|精致|华丽|优美|beautiful|gorgeous|stunning|exquisite)\s*(?:美丽|漂亮|精致|华丽|优美|beautiful|gorgeous|stunning|exquisite)/gi]
    for (const pat of adjPatterns) {
      if (pat.test(clean)) {
        clean = clean.replace(pat, (match: string) => { const w = match.split(/\s+/); return w.length > 1 ? w[0] : match.slice(0, 2) })
        issues.push({ field: key, type: 'stacked_adj', message: `${getFieldLabel(key)}：清理了堆叠形容词` })
      }
    }
    if (clean !== original) cleaned[key] = clean
  }

  const emptyFields: string[] = []
  for (const f of ['subject', 'scene', 'composition', 'lighting', 'camera', 'clothing', 'body']) {
    if (!cleaned[f] || !cleaned[f].trim()) emptyFields.push(f)
  }
  if (emptyFields.length) issues.push({ field: 'empty', type: 'empty_modules', message: `${emptyFields.length} 个核心模块为空：${emptyFields.map(getFieldLabel).join('、')}` })

  if (cleaned.avoid) {
    const parts = cleaned.avoid.split(/[，,、]/).map((p: string) => p.trim()).filter(Boolean)
    const u = [...new Set(parts)]
    if (u.length < parts.length) { issues.push({ field: 'avoid', type: 'duplicate', message: `避免项：移除了 ${parts.length - u.length} 个重复项` }); cleaned.avoid = u.join('，') }
  }
  if (cleaned.mustKeep) {
    const parts = cleaned.mustKeep.split(/[，,、]/).map((p: string) => p.trim()).filter(Boolean)
    const u = [...new Set(parts)]
    if (u.length < parts.length) { issues.push({ field: 'mustKeep', type: 'duplicate', message: `必须保留：移除了 ${parts.length - u.length} 个重复项` }); cleaned.mustKeep = u.join('，') }
  }

  return { cleaned, issues }
}
