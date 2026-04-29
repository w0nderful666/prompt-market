import { buildNaturalPrompt } from './naturalPromptBuilder.js'
import { buildPromptText } from './promptBuilder.js'

export const QUICK_APPEND_OPTIONS = [
  { id: 'realism', label: '增加真实感', text: '画面应保留真实拍摄中的轻微缺陷，包括自然噪点、微弱模糊和不完全完美的构图。' },
  { id: 'cinematic', label: '增加电影感', text: '整体光影应具有电影剧照般的层次，让画面更有叙事感。' },
  { id: 'film', label: '增加胶片感', text: '色彩可以带有轻微偏移和自然颗粒，呈现柔和的胶片质感。' },
  { id: 'street', label: '增加街拍感', text: '构图应像街头随机捕捉的瞬间，保留自然姿态和环境细节。' },
  { id: 'less_ai', label: '减少 AI 味', text: '避免过度磨皮、塑料质感、过度对称和明显的 AI 生成痕迹。' },
  { id: 'lighting', label: '增加光影细节', text: '光线需要在人物面部、衣物边缘和背景层次上形成细腻变化。' },
  { id: 'background', label: '增加背景细节', text: '背景中应保留可辨认的空间线索和轻微虚化的环境元素。' }
]

export function appendSentence(text, sentence) {
  const base = (text || '').trim()
  if (!base) return sentence
  return `${base}${base.endsWith('。') || base.endsWith('.') ? '' : '。'}${sentence}`
}

export function normalizePromptText(text) {
  return (text || '')
    .replace(/[，,]\s*[，,]+/g, '，')
    .replace(/\s+/g, ' ')
    .replace(/。{2,}/g, '。')
    .replace(/\s*，\s*/g, '，')
    .trim()
}

export function dedupeKeywordText(text) {
  const parts = normalizePromptText(text).split(/[，,]/).map((part) => part.trim()).filter(Boolean)
  return [...new Set(parts)].join('，')
}

export function rewriteToNatural(text, selectedItems, library) {
  const clean = normalizePromptText(text)
  if (clean.includes('。') || clean.length > 80) return clean
  const generated = buildNaturalPrompt({ library, selectedItems, mode: 'natural', language: 'zh', smartDetails: true })
  return generated.positiveText || `画面包含${dedupeKeywordText(clean)}，整体保持自然、清晰且便于 AI 生图理解。`
}

export function compressPrompt(text) {
  const clean = normalizePromptText(text)
  if (!clean) return ''
  return dedupeKeywordText(
    clean
      .replace(/这是一张|画面主体是|场景位于|镜头采用|整体画面具有|整体呈现出|画面像由|拍摄/g, '')
      .replace(/[。；;]/g, '，')
  )
}

export function expandPrompt(text, selectedItems, library) {
  if (selectedItems?.length) {
    return buildNaturalPrompt({ library, selectedItems, mode: 'enhanced', language: 'zh', smartDetails: true }).positiveText
  }
  const keywords = dedupeKeywordText(text)
  return keywords ? `这是一张围绕${keywords}展开的 AI 绘图提示词。画面需要保持主体清晰、场景可信、光影自然，并保留适度的真实细节。` : ''
}
