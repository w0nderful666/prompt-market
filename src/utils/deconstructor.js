/**
 * Prompt deconstructor - parses raw prompt text into structured director modules
 * Uses keyword/regex rules, no API calls
 */

const FIELD_PATTERNS = [
  { id: 'model', patterns: [/模型[：:]\s*/i, /model[：:]\s*/i, /purpose[：:]\s*/i, /用途[：:]\s*/i] },
  { id: 'subject', patterns: [/主体[：:]\s*/i, /subject[：:]\s*/i, /人物[：:]\s*/i, /featuring\s+/i, /画面主体是\s*/] },
  { id: 'scene', patterns: [/场景[：:]\s*/i, /scene[：:]\s*/i, /环境[：:]\s*/i, /位于\s*/, /set in\s+/i, /地点[：:]\s*/i] },
  { id: 'composition', patterns: [/构图[：:]\s*/i, /composition[：:]\s*/i, /镜头[：:]\s*/i, /framing[：:]\s*/i] },
  { id: 'expression', patterns: [/表情[：:]\s*/i, /expression[：:]\s*/i, /情绪[：:]\s*/i, /眼神[：:]\s*/i] },
  { id: 'face', patterns: [/妆[：:]\s*/i, /makeup[：:]\s*/i, /脸部[：:]\s*/i, /face[：:]\s*/i, /妆容[：:]\s*/i] },
  { id: 'hair', patterns: [/发型[：:]\s*/i, /hair[：:]\s*/i, /头发[：:]\s*/i, /发色[：:]\s*/i] },
  { id: 'body', patterns: [/身体[：:]\s*/i, /body[：:]\s*/i, /姿势[：:]\s*/i, /pose[：:]\s*/i, /姿态[：:]\s*/i] },
  { id: 'clothing', patterns: [/服装[：:]\s*/i, /clothing[：:]\s*/i, /穿着[：:]\s*/i, /outfit[：:]\s*/i, /身穿\s*/, /wearing\s+/i] },
  { id: 'lighting', patterns: [/光[：:]\s*/i, /lighting[：:]\s*/i, /光线[：:]\s*/i, /光源[：:]\s*/i, /lit by\s+/i] },
  { id: 'camera', patterns: [/摄影[：:]\s*/i, /camera[：:]\s*/i, /镜头质感[：:]\s*/i, /texture[：:]\s*/i, /画面质感[：:]\s*/i] },
  { id: 'background', patterns: [/背景[：:]\s*/i, /background[：:]\s*/i, /背景元素[：:]\s*/i] },
  { id: 'atmosphere', patterns: [/氛围[：:]\s*/i, /atmosphere[：:]\s*/i, /mood[：:]\s*/i, /整体[：:]\s*/i] },
  { id: 'caption', patterns: [/caption[：:]\s*/i, /风格感[：:]\s*/i] },
  { id: 'mustKeep', patterns: [/必须保留[：:]\s*/i, /must.?keep[：:]\s*/i, /保留[：:]\s*/i] },
  { id: 'avoid', patterns: [/避免[：:]\s*/i, /avoid[：:]\s*/i, /负面[：:]\s*/i, /negative[：:]\s*/i, /不要[：:]\s*/i] },
  { id: 'ratio', patterns: [/比例[：:]\s*/i, /ratio[：:]\s*/i, /尺寸[：:]\s*/i, /size[：:]\s*/i, /\d+:\d+/] }
]

const KEYWORD_MAP = {
  subject: ['女性', '男性', '人物', '主体', 'portrait', 'female', 'male', 'woman', 'man', 'girl', 'boy', '模特', 'model'],
  scene: ['街头', '地铁', '浴室', '卧室', '咖啡馆', '校园', '天台', '雨夜', 'street', 'subway', 'bathroom', 'bedroom', 'cafe', 'rooftop'],
  composition: ['半身', '全身', '特写', '近景', '中景', '远景', '俯拍', '仰拍', '三分法', 'half body', 'full body', 'close-up', 'medium shot'],
  expression: ['微笑', '冷淡', '柔和', '自信', '自然', '微笑', 'smile', 'neutral', 'soft', 'confident'],
  face: ['妆容', '底妆', '唇彩', '腮红', '眼妆', 'makeup', 'foundation', 'lips', 'blush'],
  hair: ['长发', '短发', '马尾', '卷发', '直发', '刘海', 'hair', 'ponytail', 'bob', 'bangs'],
  body: ['站姿', '坐姿', '蹲姿', '行走', '倚靠', 'standing', 'sitting', 'walking', 'leaning'],
  clothing: ['穿', '服装', '上衣', '裙', '裤', '外套', 'wearing', 'dress', 'jacket', 'skirt', 'jeans'],
  lighting: ['光', '灯', '闪', '逆光', '柔光', '硬光', '霓虹', 'light', 'flash', 'neon', 'backlight'],
  camera: ['胶片', '数码', '手机', 'CCD', '35mm', '50mm', 'film', 'digital', 'phone', 'camera', 'lens'],
  background: ['背景', '墙面', '街道', '招牌', '路人', 'background', 'wall', 'street', 'signs'],
  atmosphere: ['氛围', '情绪', '感觉', '慵懒', '迷离', '深夜', 'mood', 'atmosphere', 'lazy', 'dreamy']
}

function extractByPatterns(text, fieldId) {
  const field = FIELD_PATTERNS.find(f => f.id === fieldId)
  if (!field) return ''

  for (const pattern of field.patterns) {
    const match = text.match(pattern)
    if (match) {
      const after = text.slice(match.index + match[0].length)
      // Take text until next field marker or end
      const nextField = after.match(/\n|[，。；;]|(?=[\u4e00-\u9fff][：:])/)
      const end = nextField ? nextField.index : Math.min(after.length, 200)
      return after.slice(0, end).trim()
    }
  }
  return ''
}

function extractByKeywords(text, fieldId) {
  const keywords = KEYWORD_MAP[fieldId]
  if (!keywords) return ''

  const sentences = text.split(/[。.；;\n]+/).filter(Boolean)
  for (const sentence of sentences) {
    if (keywords.some(kw => sentence.toLowerCase().includes(kw.toLowerCase()))) {
      return sentence.trim()
    }
  }
  return ''
}

export function deconstructPrompt(text) {
  if (!text || !text.trim()) return {}

  const clean = text.trim()
  const result = {}

  // Try structured extraction first (field markers like "主体：xxx")
  const fieldIds = FIELD_PATTERNS.map(f => f.id)
  for (const fieldId of fieldIds) {
    result[fieldId] = extractByPatterns(clean, fieldId)
  }

  // For empty fields, try keyword-based extraction
  for (const fieldId of fieldIds) {
    if (!result[fieldId]) {
      result[fieldId] = extractByKeywords(clean, fieldId)
    }
  }

  // Special: extract ratio from pattern like "3:4" or "16:9"
  if (!result.ratio) {
    const ratioMatch = clean.match(/(\d{1,2}:\d{1,2})/)
    if (ratioMatch) result.ratio = ratioMatch[1]
  }

  // Special: extract negative/avoid from common patterns
  if (!result.avoid) {
    const negPatterns = [
      /negative\s*prompt[：:]\s*(.+?)(?:\n|$)/i,
      /负面提示词[：:]\s*(.+?)(?:\n|$)/i,
      /避免[：:]\s*(.+?)(?:\n|$)/i
    ]
    for (const p of negPatterns) {
      const m = clean.match(p)
      if (m) { result.avoid = m[1].trim(); break }
    }
  }

  // Clean up empty values
  for (const key of Object.keys(result)) {
    if (!result[key]) delete result[key]
  }

  return result
}
