import type { DirectorData } from './storage'

function val(d: DirectorData, key: keyof DirectorData) { return (d?.[key] || '').trim() }

export function adaptGPTImage(director: DirectorData) {
  const parts: string[] = []
  const s = val(director, 'subject'); const sc = val(director, 'scene')
  if (s && sc) parts.push(`Create an image set in ${sc}, featuring ${s}.`)
  else if (s) parts.push(`Create an image featuring ${s}.`)
  const f: (keyof DirectorData)[] = ['expression', 'face', 'makeup', 'hair', 'body', 'action', 'clothing', 'accessories', 'composition', 'lighting', 'camera', 'depthOfField', 'background', 'atmosphere', 'mustKeep', 'avoid', 'negative']
  for (const k of f) { const v = val(director, k); if (v) parts.push(`${k}: ${v}.`) }
  const ratio = val(director, 'ratio'); if (ratio) parts.push(`Aspect ratio: ${ratio}.`)
  return parts.join(' ')
}

export function adaptMidjourney(director: DirectorData) {
  const desc = ['subject', 'scene', 'composition', 'expression', 'clothing', 'lighting', 'camera', 'depthOfField', 'background', 'atmosphere'].map(k => val(director, k as keyof DirectorData)).filter(Boolean).join(', ')
  const extra = ['face', 'makeup', 'hair', 'body', 'action', 'accessories'].map(k => val(director, k as keyof DirectorData)).filter(Boolean)
  const must = val(director, 'mustKeep')
  const ratio = (val(director, 'ratio') || '3:4').replace(/\s/g, '').replace(/×/g, ':')
  const avoid = val(director, 'avoid')
  return [desc, ...extra, must, `--ar ${ratio} --style raw`, avoid ? `--no ${avoid}` : ''].filter(Boolean).join(', ')
}

export function adaptStableDiffusion(director: DirectorData) {
  const fields: (keyof DirectorData)[] = ['subject', 'scene', 'composition', 'expression', 'face', 'makeup', 'hair', 'body', 'action', 'clothing', 'accessories', 'lighting', 'camera', 'depthOfField', 'background', 'atmosphere']
  const positive = fields.map(k => val(director, k)).filter(Boolean)
  const must = val(director, 'mustKeep'); if (must) positive.push(must)
  const negative = ['low quality', 'blurry', 'watermark', 'bad hands', 'extra fingers', 'deformed']
  const avoid = val(director, 'avoid'); if (avoid) negative.push(avoid)
  return { positive: positive.join(', '), negative: negative.join(', '), text: `Positive: ${positive.join(', ')}\n\nNegative: ${negative.join(', ')}` }
}

export function adaptFlux(director: DirectorData) {
  const fields: (keyof DirectorData)[] = ['subject', 'scene', 'composition', 'expression', 'face', 'makeup', 'hair', 'body', 'action', 'clothing', 'accessories', 'lighting', 'camera', 'depthOfField', 'background', 'atmosphere']
  const parts = fields.map(k => val(director, k)).filter(Boolean)
  const must = val(director, 'mustKeep'); if (must) parts.push(must)
  return parts.join(', ')
}

export function adaptChineseGeneric(director: DirectorData) {
  const parts: string[] = []; const s = val(director, 'subject'); const sc = val(director, 'scene')
  if (s && sc) parts.push(`这是一张位于${sc}的画面，主体是${s}。`)
  else if (s) parts.push(`这是一张以${s}为主体的画面。`)
  const f: (keyof DirectorData)[] = ['expression', 'face', 'makeup', 'hair', 'body', 'action', 'clothing', 'accessories', 'composition', 'lighting', 'camera', 'depthOfField', 'background', 'atmosphere']
  for (const k of f) { const v = val(director, k); if (v) parts.push(`${k}: ${v}。`) }
  const must = val(director, 'mustKeep'); if (must) parts.push(`必须保留：${must}。`)
  const avoid = val(director, 'avoid'); if (avoid) parts.push(`避免：${avoid}。`)
  const neg = val(director, 'negative'); if (neg) parts.push(`负面词：${neg}。`)
  return parts.join('')
}

export function adaptEnglishGeneric(director: DirectorData) {
  const fields: [keyof DirectorData, string][] = [['subject', 'Subject'], ['scene', 'Scene'], ['composition', 'Composition'], ['expression', 'Expression'], ['face', 'Face'], ['makeup', 'Makeup'], ['hair', 'Hair'], ['body', 'Body'], ['action', 'Action'], ['clothing', 'Clothing'], ['accessories', 'Accessories'], ['lighting', 'Lighting'], ['camera', 'Camera'], ['depthOfField', 'Depth of field'], ['background', 'Background'], ['atmosphere', 'Atmosphere']]
  const parts = fields.map(([k, label]) => { const v = val(director, k); return v ? `${label}: ${v}.` : '' }).filter(Boolean)
  const must = val(director, 'mustKeep'); if (must) parts.push(`Must keep: ${must}.`)
  const avoid = val(director, 'avoid'); if (avoid) parts.push(`Avoid: ${avoid}.`)
  const neg = val(director, 'negative'); if (neg) parts.push(`Negative: ${neg}.`)
  return parts.join(' ')
}

export function buildModelOutputs(director: DirectorData) {
  const gpt = adaptGPTImage(director); const mj = adaptMidjourney(director); const sd = adaptStableDiffusion(director); const flux = adaptFlux(director); const zh = adaptChineseGeneric(director); const en = adaptEnglishGeneric(director)
  return { gptImage: { name: 'GPT Image', text: gpt }, midjourney: { name: 'Midjourney', text: mj }, stableDiffusion: { name: 'Stable Diffusion', text: sd.text, positive: sd.positive, negative: sd.negative }, flux: { name: 'Flux', text: flux }, chineseGeneric: { name: '通用中文', text: zh }, englishGeneric: { name: '通用英文', text: en } }
}
