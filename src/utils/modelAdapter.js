/**
 * Model Adapters - format prompts for different AI models
 * 6 output types: GPT Image, Midjourney, Stable Diffusion, Flux, 通用中文, 通用英文
 */

function val(d, key) { return (d?.[key] || '').trim() }

/**
 * GPT Image - natural language director-style description
 */
export function adaptGPTImage(director) {
  const parts = []
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

  if (s && sc) parts.push(`Create an image set in ${sc}, featuring ${s}.`)
  else if (s) parts.push(`Create an image featuring ${s}.`)

  if (expr) parts.push(`The expression is ${expr}.`)
  if (face) parts.push(`Face and makeup: ${face}.`)
  if (hair) parts.push(`Hair: ${hair}.`)
  if (body) parts.push(`Body and pose: ${body}.`)
  if (cloth) parts.push(`Wearing ${cloth}.`)
  if (comp) parts.push(`Use ${comp} composition.`)
  if (lit) parts.push(`Lighting: ${lit}.`)
  if (cam) parts.push(`Camera feel: ${cam}.`)
  if (dof) parts.push(`Depth of field: ${dof}.`)
  if (bg) parts.push(`Background: ${bg}.`)
  if (atmo) parts.push(`Overall atmosphere: ${atmo}.`)
  if (must) parts.push(`Must preserve: ${must}.`)
  if (avoid) parts.push(`Avoid: ${avoid}.`)

  const ratio = val(director, 'ratio')
  if (ratio) parts.push(`Aspect ratio: ${ratio}.`)

  return parts.join(' ')
}

/**
 * Midjourney - concise English phrases with parameters
 */
export function adaptMidjourney(director) {
  const parts = []
  const s = val(director, 'subject')
  const sc = val(director, 'scene')
  const comp = val(director, 'composition')
  const expr = val(director, 'expression')
  const cloth = val(director, 'clothing')
  const lit = val(director, 'lighting')
  const cam = val(director, 'camera')
  const dof = val(director, 'depthOfField')
  const bg = val(director, 'background')
  const atmo = val(director, 'atmosphere')

  const desc = [s, sc, comp, expr, cloth, lit, cam, dof, bg, atmo].filter(Boolean).join(', ')
  parts.push(desc)

  const face = val(director, 'face')
  const hair = val(director, 'hair')
  if (face) parts.push(face)
  if (hair) parts.push(hair)

  const must = val(director, 'mustKeep')
  if (must) parts.push(must)

  // Parameters
  const ratio = val(director, 'ratio') || '3:4'
  const ar = ratio.replace(/\s/g, '').replace(/×/g, ':')
  parts.push(`--ar ${ar} --style raw`)

  const avoid = val(director, 'avoid')
  if (avoid) parts.push(`--no ${avoid}`)

  return parts.join(', ')
}

/**
 * Stable Diffusion - split positive/negative
 */
export function adaptStableDiffusion(director) {
  const positive = []
  const negative = ['low quality', 'blurry', 'watermark', 'bad hands', 'extra fingers', 'deformed']

  const fields = ['subject', 'scene', 'composition', 'expression', 'face', 'hair', 'body', 'clothing', 'lighting', 'camera', 'depthOfField', 'background', 'atmosphere']
  for (const f of fields) {
    const v = val(director, f)
    if (v) positive.push(v)
  }

  const must = val(director, 'mustKeep')
  if (must) positive.push(must)

  const avoid = val(director, 'avoid')
  if (avoid) negative.push(avoid)

  return {
    positive: positive.join(', '),
    negative: negative.join(', '),
    text: `Positive: ${positive.join(', ')}\n\nNegative: ${negative.join(', ')}`
  }
}

/**
 * Flux - concise high-density English, not over-tagged
 */
export function adaptFlux(director) {
  const parts = []
  const fields = ['subject', 'scene', 'composition', 'expression', 'face', 'hair', 'body', 'clothing', 'lighting', 'camera', 'depthOfField', 'background', 'atmosphere']
  for (const f of fields) {
    const v = val(director, f)
    if (v) parts.push(v)
  }

  const must = val(director, 'mustKeep')
  if (must) parts.push(must)

  return parts.join(', ')
}

/**
 * 通用中文
 */
export function adaptChineseGeneric(director) {
  const parts = []
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

  if (s && sc) parts.push(`这是一张位于${sc}的画面，主体是${s}。`)
  else if (s) parts.push(`这是一张以${s}为主体的画面。`)
  if (expr) parts.push(`表情为${expr}。`)
  if (face) parts.push(`妆容为${face}。`)
  if (hair) parts.push(`发型为${hair}。`)
  if (body) parts.push(`姿态为${body}。`)
  if (cloth) parts.push(`身穿${cloth}。`)
  if (comp) parts.push(`构图采用${comp}。`)
  if (lit) parts.push(`光线来自${lit}。`)
  if (cam) parts.push(`画面质感为${cam}。`)
  if (dof) parts.push(`景深为${dof}。`)
  if (bg) parts.push(`背景为${bg}。`)
  if (atmo) parts.push(`氛围为${atmo}。`)

  const must = val(director, 'mustKeep')
  if (must) parts.push(`必须保留：${must}。`)
  const avoid = val(director, 'avoid')
  if (avoid) parts.push(`避免：${avoid}。`)

  return parts.join('')
}

/**
 * 通用英文
 */
export function adaptEnglishGeneric(director) {
  const parts = []
  const fields = [
    ['subject', 'Subject'], ['scene', 'Scene'], ['composition', 'Composition'],
    ['expression', 'Expression'], ['face', 'Face'], ['hair', 'Hair'],
    ['body', 'Body'], ['clothing', 'Clothing'], ['lighting', 'Lighting'],
    ['camera', 'Camera'], ['depthOfField', 'Depth of field'], ['background', 'Background'], ['atmosphere', 'Atmosphere']
  ]

  for (const [key, label] of fields) {
    const v = val(director, key)
    if (v) parts.push(`${label}: ${v}.`)
  }

  const must = val(director, 'mustKeep')
  if (must) parts.push(`Must keep: ${must}.`)
  const avoid = val(director, 'avoid')
  if (avoid) parts.push(`Avoid: ${avoid}.`)

  return parts.join(' ')
}

/**
 * Build all model-specific outputs
 */
export function buildModelOutputs(director) {
  const gpt = adaptGPTImage(director)
  const mj = adaptMidjourney(director)
  const sd = adaptStableDiffusion(director)
  const flux = adaptFlux(director)
  const zh = adaptChineseGeneric(director)
  const en = adaptEnglishGeneric(director)

  return {
    gptImage: { name: 'GPT Image', text: gpt },
    midjourney: { name: 'Midjourney', text: mj },
    stableDiffusion: { name: 'Stable Diffusion', text: sd.text, positive: sd.positive, negative: sd.negative },
    flux: { name: 'Flux', text: flux },
    chineseGeneric: { name: '通用中文', text: zh },
    englishGeneric: { name: '通用英文', text: en }
  }
}
