import type { DirectorData } from './storage'

function val(d: DirectorData, key: keyof DirectorData) { return (d?.[key] || '').trim() }

export function buildChineseShort(director: DirectorData) {
  const parts: string[] = []
  const push = (k: keyof DirectorData) => { const v = val(director, k); if (v) parts.push(v) }
  push('subject'); push('scene'); push('composition'); push('camera'); push('lighting'); push('depthOfField'); push('atmosphere')
  const avoid = val(director, 'avoid')
  if (avoid) parts.push(`避免${avoid}`)
  return parts.join('，')
}

export function buildChineseStandard(director: DirectorData) {
  const s: string[] = []; const sc = val(director, 'scene'); const sub = val(director, 'subject')
  if (sub && sc) s.push(`这是一张位于${sc}的画面，主体是${sub}。`)
  else if (sub) s.push(`这是一张以${sub}为主体的画面。`)
  const expr = val(director, 'expression'); if (expr) s.push(`表情和状态为${expr}。`)
  const face = val(director, 'face'); if (face) s.push(`脸部妆容为${face}。`)
  const hair = val(director, 'hair'); if (hair) s.push(`发型为${hair}。`)
  const body = val(director, 'body'); if (body) s.push(`身体姿态为${body}。`)
  const cloth = val(director, 'clothing'); if (cloth) s.push(`身穿${cloth}。`)
  const comp = val(director, 'composition'); if (comp) s.push(`构图采用${comp}。`)
  const lit = val(director, 'lighting'); if (lit) s.push(`光线来自${lit}。`)
  const cam = val(director, 'camera'); if (cam) s.push(`画面质感为${cam}。`)
  const dof = val(director, 'depthOfField'); if (dof) s.push(`景深效果为${dof}。`)
  const bg = val(director, 'background'); if (bg) s.push(`背景元素包括${bg}。`)
  const atmo = val(director, 'atmosphere'); if (atmo) s.push(`整体氛围为${atmo}。`)
  const must = val(director, 'mustKeep'); if (must) s.push(`必须保留：${must}。`)
  const ratio = val(director, 'ratio')
  return s.join('') + (ratio ? `比例：${ratio}。` : '') + (val(director, 'avoid') ? `避免项：${val(director, 'avoid')}。` : '')
}

export function buildChineseDirector(director: DirectorData) {
  const lines: string[] = []
  const entries: [string, string][] = [
    ['标题/模型', val(director, 'model')],
    ['主体与场景', [val(director, 'subject'), val(director, 'scene')].filter(Boolean).join('，')],
    ['表情与状态', val(director, 'expression')], ['脸部与妆容', val(director, 'face')],
    ['头发', val(director, 'hair')], ['身体与构图', [val(director, 'body'), val(director, 'composition')].filter(Boolean).join('，')],
    ['服装', val(director, 'clothing')], ['摄影风格', val(director, 'camera')], ['景深效果', val(director, 'depthOfField')],
    ['背景环境', val(director, 'background')], ['整体氛围', val(director, 'atmosphere')],
    ['必须保留', val(director, 'mustKeep')], ['避免', val(director, 'avoid')],
  ]
  for (const [label, value] of entries) { if (value) lines.push(`${label}：${value}`) }
  const ratio = val(director, 'ratio'); if (ratio) lines.push(`比例：${ratio}`)
  return lines.join('\n')
}

export function buildEnglishStandard(director: DirectorData) {
  const s: string[] = []; const sc = val(director, 'scene'); const sub = val(director, 'subject')
  if (sub && sc) s.push(`This is an image set in ${sc}, featuring ${sub}.`)
  else if (sub) s.push(`This is an image featuring ${sub}.`)
  const expr = val(director, 'expression'); if (expr) s.push(`Expression: ${expr}.`)
  const face = val(director, 'face'); if (face) s.push(`Face and makeup: ${face}.`)
  const hair = val(director, 'hair'); if (hair) s.push(`Hair: ${hair}.`)
  const body = val(director, 'body'); if (body) s.push(`Body and pose: ${body}.`)
  const cloth = val(director, 'clothing'); if (cloth) s.push(`Wearing ${cloth}.`)
  const comp = val(director, 'composition'); if (comp) s.push(`Composition: ${comp}.`)
  const lit = val(director, 'lighting'); if (lit) s.push(`Lighting: ${lit}.`)
  const cam = val(director, 'camera'); if (cam) s.push(`Camera/texture: ${cam}.`)
  const dof = val(director, 'depthOfField'); if (dof) s.push(`Depth of field: ${dof}.`)
  const bg = val(director, 'background'); if (bg) s.push(`Background: ${bg}.`)
  const atmo = val(director, 'atmosphere'); if (atmo) s.push(`Atmosphere: ${atmo}.`)
  const must = val(director, 'mustKeep'); if (must) s.push(`Must keep: ${must}.`)
  const ratio = val(director, 'ratio')
  return s.join(' ') + (ratio ? `Ratio: ${ratio}.` : '') + (val(director, 'avoid') ? `Avoid: ${val(director, 'avoid')}.` : '')
}

export function buildAvoidPrompt(director: DirectorData) {
  const avoid = val(director, 'avoid')
  if (!avoid) return ''
  return `low quality, blurry, watermark, over-smoothed skin, plastic skin, AI-generated look, bad hands, extra fingers, deformed limbs, ${avoid}`
}

export function buildAllOutputs(director: DirectorData) {
  return {
    chineseShort: buildChineseShort(director),
    chineseStandard: buildChineseStandard(director),
    chineseDirector: buildChineseDirector(director),
    englishStandard: buildEnglishStandard(director),
    avoidPrompt: buildAvoidPrompt(director),
  }
}
