/**
 * Director prompt builder - generates 5 output formats from structured modules
 */

const MODULE_TITLES_ZH = {
  model: '模型/用途', subject: '主体设定', scene: '场景环境', composition: '构图与镜头',
  expression: '表情与状态', face: '脸部与妆容', hair: '发型与细节', body: '身体与姿势',
  clothing: '服装与配件', lighting: '光线与色彩', camera: '摄影/画面质感',
  depthOfField: '景深效果', background: '背景元素', atmosphere: '整体氛围',
  caption: 'Caption 感', mustKeep: '必须保留', avoid: '避免项', ratio: '比例/尺寸'
}

const MODULE_TITLES_EN = {
  model: 'Model / Purpose', subject: 'Subject', scene: 'Scene / Environment',
  composition: 'Composition / Framing', expression: 'Expression / State',
  face: 'Face / Makeup', hair: 'Hair / Details', body: 'Body / Pose',
  clothing: 'Clothing / Outfit', lighting: 'Lighting / Color', camera: 'Camera / Texture',
  depthOfField: 'Depth of Field', background: 'Background', atmosphere: 'Atmosphere',
  caption: 'Caption Feel', mustKeep: 'Must Keep', avoid: 'Avoid', ratio: 'Ratio / Size'
}

function val(director, key) {
  return (director?.[key] || '').trim()
}

/**
 * 中文简短版 - 精简关键词拼接
 */
export function buildChineseShort(director) {
  const parts = []
  const s = val(director, 'subject')
  const sc = val(director, 'scene')
  const comp = val(director, 'composition')
  const cam = val(director, 'camera')
  const lit = val(director, 'lighting')
  const atmo = val(director, 'atmosphere')
  const dof = val(director, 'depthOfField')

  if (s) parts.push(s)
  if (sc) parts.push(sc)
  if (comp) parts.push(comp)
  if (cam) parts.push(cam)
  if (lit) parts.push(lit)
  if (dof) parts.push(dof)
  if (atmo) parts.push(atmo)

  const avoid = val(director, 'avoid')
  if (avoid) parts.push(`避免${avoid}`)

  return parts.join('，')
}

/**
 * 中文标准版 - 自然语言段落
 */
export function buildChineseStandard(director) {
  const sections = []
  const s = val(director, 'subject')
  const sc = val(director, 'scene')
  const comp = val(director, 'composition')
  const expr = val(director, 'expression')
  const face = val(director, 'face')
  const hair = val(director, 'hair')
  const body = val(director, 'body')
  const cloth = val(director, 'clothing')
  const lit = val(director, 'lighting')
  const cam = val(director, 'camera')
  const dof = val(director, 'depthOfField')
  const bg = val(director, 'background')
  const atmo = val(director, 'atmosphere')
  const must = val(director, 'mustKeep')
  const avoid = val(director, 'avoid')

  if (s && sc) sections.push(`这是一张位于${sc}的画面，主体是${s}。`)
  else if (s) sections.push(`这是一张以${s}为主体的画面。`)

  if (expr) sections.push(`表情和状态为${expr}。`)
  if (face) sections.push(`脸部妆容为${face}。`)
  if (hair) sections.push(`发型为${hair}。`)
  if (body) sections.push(`身体姿态为${body}。`)
  if (cloth) sections.push(`身穿${cloth}。`)
  if (comp) sections.push(`构图采用${comp}。`)
  if (lit) sections.push(`光线来自${lit}。`)
  if (cam) sections.push(`画面质感为${cam}。`)
  if (dof) sections.push(`景深效果为${dof}。`)
  if (bg) sections.push(`背景元素包括${bg}。`)
  if (atmo) sections.push(`整体氛围为${atmo}。`)
  if (must) sections.push(`必须保留：${must}。`)

  const negative = avoid ? `避免项：${avoid}。` : ''
  const ratio = val(director, 'ratio')
  const ratioText = ratio ? `比例：${ratio}。` : ''

  return sections.join('') + ratioText + negative
}

/**
 * 中文导演版 - 结构化标题输出
 */
export function buildChineseDirector(director) {
  const lines = []
  const entries = [
    ['标题/模型', val(director, 'model')],
    ['主体与场景', [val(director, 'subject'), val(director, 'scene')].filter(Boolean).join('，')],
    ['表情与状态', val(director, 'expression')],
    ['脸部与妆容', val(director, 'face')],
    ['头发', val(director, 'hair')],
    ['身体与构图', [val(director, 'body'), val(director, 'composition')].filter(Boolean).join('，')],
    ['服装', val(director, 'clothing')],
    ['摄影风格', val(director, 'camera')],
    ['景深效果', val(director, 'depthOfField')],
    ['背景环境', val(director, 'background')],
    ['整体氛围', val(director, 'atmosphere')],
    ['必须保留', val(director, 'mustKeep')],
    ['避免', val(director, 'avoid')]
  ]

  for (const [label, value] of entries) {
    if (value) lines.push(`${label}：${value}`)
  }

  const ratio = val(director, 'ratio')
  if (ratio) lines.push(`比例：${ratio}`)

  return lines.join('\n')
}

/**
 * 英文标准版
 */
export function buildEnglishStandard(director) {
  const sections = []
  const s = val(director, 'subject')
  const sc = val(director, 'scene')
  const comp = val(director, 'composition')
  const expr = val(director, 'expression')
  const face = val(director, 'face')
  const hair = val(director, 'hair')
  const body = val(director, 'body')
  const cloth = val(director, 'clothing')
  const lit = val(director, 'lighting')
  const cam = val(director, 'camera')
  const dof = val(director, 'depthOfField')
  const bg = val(director, 'background')
  const atmo = val(director, 'atmosphere')
  const must = val(director, 'mustKeep')
  const avoid = val(director, 'avoid')

  if (s && sc) sections.push(`This is an image set in ${sc}, featuring ${s}.`)
  else if (s) sections.push(`This is an image featuring ${s}.`)

  if (expr) sections.push(`Expression: ${expr}.`)
  if (face) sections.push(`Face and makeup: ${face}.`)
  if (hair) sections.push(`Hair: ${hair}.`)
  if (body) sections.push(`Body and pose: ${body}.`)
  if (cloth) sections.push(`Wearing ${cloth}.`)
  if (comp) sections.push(`Composition: ${comp}.`)
  if (lit) sections.push(`Lighting: ${lit}.`)
  if (cam) sections.push(`Camera/texture: ${cam}.`)
  if (dof) sections.push(`Depth of field: ${dof}.`)
  if (bg) sections.push(`Background: ${bg}.`)
  if (atmo) sections.push(`Atmosphere: ${atmo}.`)
  if (must) sections.push(`Must keep: ${must}.`)

  const negative = avoid ? `Avoid: ${avoid}.` : ''
  const ratio = val(director, 'ratio')
  const ratioText = ratio ? `Ratio: ${ratio}.` : ''

  return sections.join(' ') + ratioText + negative
}

/**
 * 负面提示词 / Avoid Prompt
 */
export function buildAvoidPrompt(director) {
  const avoid = val(director, 'avoid')
  if (!avoid) return ''
  const baseAvoid = 'low quality, blurry, watermark, over-smoothed skin, plastic skin, AI-generated look, bad hands, extra fingers, deformed limbs'
  return `${baseAvoid}, ${avoid}`
}

/**
 * 生成全部 5 种输出
 */
export function buildAllOutputs(director) {
  return {
    chineseShort: buildChineseShort(director),
    chineseStandard: buildChineseStandard(director),
    chineseDirector: buildChineseDirector(director),
    englishStandard: buildEnglishStandard(director),
    avoidPrompt: buildAvoidPrompt(director)
  }
}
