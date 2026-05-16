import { EXTENDED_TEMPLATES as SERIES_SCENE_TEMPLATES, type SeriesSceneTemplate } from '../data/seriesExtendedTemplates'
import { EXPRESSION_VARIANTS, BODY_NO_HAND_VARIANTS, FRAMING_VARIANTS, HAND_SAFE_VARIANTS } from '../data/seriesVariationPools'

export interface SeriesPromptResult {
  id: string
  title: string
  summary: string
  templateId: string
  shotIndex: number
  director: Record<string, string>
  meta: {
    cameraLogic: string
    handSafeLevel: string
    variationStrength: string
    generatedAt: string
  }
}

export interface GenerateOptions {
  templateId?: string
  count?: number
  handSafeLevel?: 'normal' | 'conservative' | 'strict'
  realismLevel?: string
  variationStrength?: string
  seed?: number
  characterOverride?: Record<string, string>
  lockedFields?: string[]
}

const THIRD_PERSON_GUARD = '第三人称近景抓拍，不是自拍，不出现手机，不出现镜子反射。摄影者从人物正前方或斜前方用手机随手拍摄。'
const ADULT_SAFETY_MUST = 'clearly adult, 20+'
const ADULT_SAFETY_AVOID = '未成年感，校服，teen，girl，child，裸体，露点，透明衣物，过度性感'
const DEFAULT_AVOID = '手机入镜，自拍手机，镜子反射，手机遮脸，清晰手指，手部特写，畸形手，多余手指，断指，手指扭曲'

const HAND_SAFE_RULES: Record<string, string> = {
  normal: '',
  conservative: '手部不作为画面重点，避免清晰手指和手部特写。',
  strict: '手部不作为画面重点，双手在画面裁切外、被洗手台/被子/抱枕/衣袖/桌沿遮住，避免清晰手指和手部特写。手部完全不在画面中或完全被遮挡，不出现任何清晰手指细节。'
}

function seededRandom(seed: number) {
  let s = seed
  return function () {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

function pickFromPool(pool: string[], index: number, _rand: () => number) {
  if (!pool || pool.length === 0) return ''
  const idx = index % pool.length
  return pool[idx]
}

function deepClone(obj: any): any {
  return JSON.parse(JSON.stringify(obj))
}

export function generateSeriesPrompts(options: GenerateOptions = {}): SeriesPromptResult[] {
  const {
    templateId,
    count = 4,
    handSafeLevel = 'strict',
    realismLevel = 'phone_lowres',
    variationStrength = 'medium',
    seed = Date.now(),
    characterOverride = {},
    lockedFields = ['scene', 'lighting', 'camera', 'clothing', 'hair']
  } = options

  const template = SERIES_SCENE_TEMPLATES.find((t: SeriesSceneTemplate) => t.id === templateId)
  if (!template) return []

  const rand = seededRandom(seed)
  const results: SeriesPromptResult[] = []

  for (let i = 0; i < count; i++) {
    const base = deepClone(template.baseDirector) as Record<string, string>

    for (const [key, value] of Object.entries(characterOverride)) {
      if (value && typeof value === 'string' && value.trim()) {
        if (key === 'subject' || key === 'face' || key === 'hair' || key === 'clothing') {
          base[key] = value.trim()
        }
      }
    }

    const expressionPick = pickFromPool(EXPRESSION_VARIANTS, i, rand)
    const bodyPick = pickFromPool(BODY_NO_HAND_VARIANTS, i, rand)
    const framingPick = pickFromPool(FRAMING_VARIANTS, i, rand)

    base.expression = expressionPick || base.expression
    base.body = bodyPick || base.body
    base.composition = [THIRD_PERSON_GUARD, framingPick || base.composition].filter(Boolean).join('，')

    if (!base.mustKeep!.includes(ADULT_SAFETY_MUST)) {
      base.mustKeep = [ADULT_SAFETY_MUST, base.mustKeep].filter(Boolean).join('，')
    }

    const avoidItems = [DEFAULT_AVOID, ADULT_SAFETY_AVOID, base.avoid].filter(Boolean).join('，')
    base.avoid = avoidItems

    const handRule = HAND_SAFE_RULES[handSafeLevel] || HAND_SAFE_RULES.strict
    if (handRule) {
      base.mustKeep = [handRule, base.mustKeep].filter(Boolean).join('，')
    }

    for (const field of Object.keys(base)) {
      if (typeof base[field] === 'string') {
        base[field] = base[field]
          .replace(/，{2,}/g, '，')
          .replace(/,{2,}/g, ',')
          .replace(/，\s*$/g, '')
          .replace(/,\s*$/g, '')
          .replace(/^[，,]\s*/, '')
          .replace(/\s{2,}/g, ' ')
          .trim()
      }
    }

    results.push({
      id: `series_${templateId}_${String(i + 1).padStart(2, '0')}`,
      title: `${template.name} ${String(i + 1).padStart(2, '0')}`,
      summary: `第三人称 · ${handSafeLevel === 'strict' ? '手部严格规避' : handSafeLevel === 'conservative' ? '手部保守' : '普通'} · ${expressionPick ? expressionPick.slice(0, 20) : '自然表情'}`,
      templateId: template.id,
      shotIndex: i + 1,
      director: base,
      meta: {
        cameraLogic: 'third_person_no_phone',
        handSafeLevel,
        variationStrength,
        generatedAt: new Date().toISOString()
      }
    })
  }

  return results
}
