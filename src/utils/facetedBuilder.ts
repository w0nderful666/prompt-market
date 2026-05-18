import { ALL_FACETS, CONFLICT_RULES, SLOT_MAP, VALUE_MAP } from '../data/facetedPresets'
import type { ConflictRule } from '../data/facetedPresets'
import type { PromptImportMatch, PromptImportMeta, PromptSection } from '../core/types'

export interface FacetConflict {
  type: 'hard' | 'soft'
  rule: ConflictRule
  message: string
  slot: string
}

export type FacetSelections = Record<string, string | string[]>
export type OutputLanguage = 'zh' | 'en' | 'mix'
export type PromptStyle = 'tag' | 'natural'

interface PromptTextBundle {
  zhTag: string
  enTag: string
  zhNatural: string
  enNatural: string
}

interface SectionDefinition {
  id: string
  labelZh: string
  labelEn: string
  slots: string[]
}

interface BuiltSection {
  id: string
  labelZh: string
  labelEn: string
  zhTagText: string
  enTagText: string
  zhNaturalText: string
  enNaturalText: string
}

interface ValueIndexEntry {
  key: string
  rawKey: string
  slotId: string
  valueId: string
  label: string
  isAlias: boolean
  isCustom: boolean
}

const SECTION_ORDER: SectionDefinition[] = [
  {
    id: 'subject',
    labelZh: '主体',
    labelEn: 'Subject',
    slots: ['shotType', 'subjectCount', 'subjectRelationship', 'ageBand', 'genderPresentation', 'ethnicity', 'bodyType'],
  },
  {
    id: 'scene',
    labelZh: '场景',
    labelEn: 'Scene',
    slots: ['scenePrimary', 'sceneModifiers', 'environmental', 'homeDetail', 'urbanDetail', 'natureDetail'],
  },
  {
    id: 'light',
    labelZh: '光线',
    labelEn: 'Lighting',
    slots: ['lightFamily', 'lightingPrimary', 'lightingModifiers'],
  },
  {
    id: 'camera',
    labelZh: '镜头/构图',
    labelEn: 'Camera & Composition',
    slots: ['cameraAngle', 'orientation', 'specialAngles', 'shotSize', 'lensClass', 'focalLength', 'depthOfField', 'bokehModifiers', 'compositionPrimary', 'compositionModifiers'],
  },
  {
    id: 'style',
    labelZh: '穿搭妆发/风格',
    labelEn: 'Style',
    slots: ['style', 'styleStrength', 'trendAesthetic', 'colorTrend', 'colorPrimary', 'colorAccent', 'colorGradePrimary', 'colorModifiers', 'garmentColorModifiers', 'makeupIntensity', 'makeupRegions', 'hairColor', 'hairColorSecondary', 'hairLength', 'hairStyle', 'hairTexture', 'material', 'pattern', 'accessories', 'footwear'],
  },
  {
    id: 'pose',
    labelZh: '动作表情',
    labelEn: 'Pose & Expression',
    slots: ['posePrimary', 'poseModifiers', 'expressionPrimary', 'expressionModifiers', 'microPose', 'microExpr', 'activities', 'handheld', 'product'],
  },
  {
    id: 'mood',
    labelZh: '氛围细节',
    labelEn: 'Mood & Detail',
    slots: ['mood', 'shootingMedium', 'imageTexture', 'detailDensity', 'realismLevel', 'genTarget', 'randomnessLevel'],
  },
]

const SECTION_LABELS: Record<string, string> = {
  subject: '主体',
  scene: '场景',
  light: '光线',
  camera: '镜头/构图',
  style: '穿搭妆发/风格',
  pose: '动作表情',
  mood: '氛围细节',
  freeform: '自由补充',
}

const CUSTOM_IMPORT_ALIASES: Array<{ key: string; valueIds: string[] }> = [
  { key: '咖啡馆', valueIds: ['scene_cafe'] },
  { key: '咖啡店', valueIds: ['scene_cafe'] },
  { key: '书店', valueIds: ['scene_bookstore'] },
  { key: '图书馆', valueIds: ['scene_library'] },
  { key: '窗边', valueIds: ['scmod_window_side'] },
  { key: '窗边光', valueIds: ['lf_window', 'light_natural_window', 'scmod_window_side'] },
  { key: '窗边自然光', valueIds: ['lf_window', 'light_natural_window', 'scmod_window_side'] },
  { key: '自然光', valueIds: ['lf_natural'] },
  { key: 'natural light', valueIds: ['lf_natural'] },
  { key: 'window light', valueIds: ['lf_window', 'light_natural_window'] },
  { key: 'window-side light', valueIds: ['lf_window', 'light_natural_window', 'scmod_window_side'] },
  { key: '逆光', valueIds: ['light_backlight'] },
  { key: '逆光日落', valueIds: ['lf_sunset_backlight', 'light_backlight'] },
  { key: '回头看', valueIds: ['pose_looking_back'] },
  { key: '回眸', valueIds: ['pose_looking_back'] },
  { key: '看镜头', valueIds: ['emod_looking_at_camera'] },
  { key: 'look at camera', valueIds: ['emod_looking_at_camera'] },
  { key: 'looking at camera', valueIds: ['emod_looking_at_camera'] },
  { key: '不看镜头', valueIds: ['emod_looking_away'] },
  { key: '望向远方', valueIds: ['emod_looking_away'] },
  { key: '侧脸', valueIds: ['ori_profile'] },
  { key: '三分之二侧脸', valueIds: ['ori_three_quarter'] },
  { key: '胶片感', valueIds: ['color_film', 'med_film'] },
  { key: '电影感', valueIds: ['mood_cinematic'] },
  { key: '氛围感', valueIds: ['mood_cinematic'] },
  { key: '松弛感', valueIds: ['mood_relaxed'] },
  { key: '干净证件照', valueIds: ['shot_headshot', 'scene_studio_white', 'mood_clean'] },
  { key: '通勤街拍', valueIds: ['scene_street', 'pose_walking', 'mood_daily', 'trend_quiet_luxury'] },
  { key: '咖啡杯', valueIds: ['prop_coffee_cup'] },
  { key: '茶杯', valueIds: ['prop_tea_cup'] },
  { key: '书本', valueIds: ['prop_book'] },
  { key: '手机', valueIds: ['prop_phone'] },
  { key: '雨伞', valueIds: ['prop_umbrella'] },
  { key: '老ccd', valueIds: ['med_ccd'] },
  { key: 'analog imperfection', valueIds: ['trend_analog_imperfection'] },
  { key: 'throwback moodboard', valueIds: ['trend_throwback_moodboard'] },
  { key: 'color walking', valueIds: ['trend_color_walking'] },
  { key: 'story-driven documentary', valueIds: ['trend_story_documentary'] },
]

function containsCjk(text: string): boolean {
  return /[\u3400-\u9fff]/.test(text)
}

function prettifyIdentifier(valueId: string): string {
  return valueId
    .replace(/^[a-z]+_/, '')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function normalizeToken(input: string): string {
  return input
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[“”"']/g, '')
    .replace(/[（）()]/g, ' ')
    .replace(/[_·]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function normalizeSeparatorText(input: string): string {
  return input
    .replace(/\r/g, '\n')
    .replace(/[，、；|]/g, ',')
    .replace(/[。！？]/g, '\n')
    .replace(/\t/g, ' ')
}

function getFallbackEnglish(valueId: string, label: string, aliases: string[]): string {
  const alias = aliases.find(entry => /[a-z]/i.test(entry))
  if (alias) return alias
  if (/[a-z]/i.test(label) && !containsCjk(label)) return label
  return prettifyIdentifier(valueId)
}

function getValuePrompts(valueId: string): PromptTextBundle {
  const value = VALUE_MAP[valueId]
  if (!value) {
    const fallback = prettifyIdentifier(valueId)
    return {
      zhTag: fallback,
      enTag: fallback,
      zhNatural: fallback,
      enNatural: fallback,
    }
  }

  const aliases = value.aliases ?? []
  const zhBase = value.exportPromptZh || value.exportPrompt || value.label
  const enBase = value.exportPromptEn || getFallbackEnglish(value.id, value.label, aliases)

  return {
    zhTag: zhBase,
    enTag: enBase,
    zhNatural: value.naturalPromptZh || zhBase,
    enNatural: value.naturalPromptEn || enBase,
  }
}

function buildSections(selections: FacetSelections): BuiltSection[] {
  const sections: BuiltSection[] = []

  for (const section of SECTION_ORDER) {
    const seen = new Set<string>()
    const zhTags: string[] = []
    const enTags: string[] = []
    const zhNatural: string[] = []
    const enNatural: string[] = []

    for (const slotId of section.slots) {
      const selected = selections[slotId]
      if (!selected) continue

      const values = Array.isArray(selected) ? selected : [selected]
      for (const valueId of values) {
        if (!valueId || seen.has(valueId)) continue
        seen.add(valueId)
        const prompt = getValuePrompts(valueId)
        zhTags.push(prompt.zhTag)
        enTags.push(prompt.enTag)
        zhNatural.push(prompt.zhNatural)
        enNatural.push(prompt.enNatural)
      }
    }

    if (zhTags.length === 0 && enTags.length === 0) continue

    sections.push({
      id: section.id,
      labelZh: section.labelZh,
      labelEn: section.labelEn,
      zhTagText: zhTags.join('，'),
      enTagText: enTags.join(', '),
      zhNaturalText: zhNatural.join('，'),
      enNaturalText: enNatural.join(', '),
    })
  }

  return sections
}

function toPromptSection(section: BuiltSection, outputLang: OutputLanguage): PromptSection {
  if (outputLang === 'en') {
    return { id: section.id, label: section.labelEn, text: section.enTagText }
  }
  if (outputLang === 'mix') {
    return {
      id: section.id,
      label: section.labelZh,
      text: `${section.zhTagText}${section.enTagText ? ` / ${section.enTagText}` : ''}`,
    }
  }
  return { id: section.id, label: section.labelZh, text: section.zhTagText }
}

function buildNaturalPrompt(sections: BuiltSection[], outputLang: OutputLanguage, freeformPositive?: string): string {
  const trimmedFreeform = freeformPositive?.trim()

  if (outputLang === 'en') {
    const sentences = sections.map(section => `${section.labelEn}: ${section.enNaturalText}`)
    if (trimmedFreeform) sentences.push(`Additional notes: ${trimmedFreeform}`)
    return sentences.join('. ')
  }

  if (outputLang === 'mix') {
    const zhSentences = sections.map(section => `${section.labelZh}：${section.zhNaturalText}`)
    if (trimmedFreeform) zhSentences.push(`自由补充：${trimmedFreeform}`)
    const englishTags = sections.map(section => section.enTagText).filter(Boolean).join(', ')
    return `${zhSentences.join('；')}。${englishTags ? ` English tags: ${englishTags}.` : ''}`
  }

  const zhSentences = sections.map(section => `${section.labelZh}：${section.zhNaturalText}`)
  if (trimmedFreeform) zhSentences.push(`自由补充：${trimmedFreeform}`)
  return `${zhSentences.join('；')}。`
}

function buildFlatPrompt(sections: BuiltSection[], outputLang: OutputLanguage, freeformPositive?: string): string {
  const trimmedFreeform = freeformPositive?.trim()

  if (outputLang === 'en') {
    const base = sections.map(section => section.enTagText).filter(Boolean)
    if (trimmedFreeform) base.push(trimmedFreeform)
    return base.join(', ')
  }

  if (outputLang === 'mix') {
    const zhPart = sections.map(section => section.zhTagText).filter(Boolean).join('，')
    const enPart = sections.map(section => section.enTagText).filter(Boolean).join(', ')
    const extra = trimmedFreeform ? `，${trimmedFreeform}` : ''
    return [zhPart ? `${zhPart}${extra}` : trimmedFreeform, enPart].filter(Boolean).join(' | ')
  }

  const base = sections.map(section => section.zhTagText).filter(Boolean)
  if (trimmedFreeform) base.push(trimmedFreeform)
  return base.join('，')
}

function buildValueIndex(): ValueIndexEntry[] {
  const entries: ValueIndexEntry[] = []
  const seen = new Set<string>()

  for (const value of Object.values(VALUE_MAP)) {
    const aliases = [value.id, value.label, value.exportPrompt, value.exportPromptZh, value.exportPromptEn, ...(value.aliases ?? [])]
      .filter(Boolean) as string[]

    for (const alias of aliases) {
      const key = normalizeToken(alias)
      if (!key) continue
      const fingerprint = `${key}::${value.id}`
      if (seen.has(fingerprint)) continue
      seen.add(fingerprint)
      entries.push({
        key,
        rawKey: alias,
        slotId: value.slot,
        valueId: value.id,
        label: value.label,
        isAlias: alias !== value.id && alias !== value.label,
        isCustom: false,
      })
    }
  }

  for (const alias of CUSTOM_IMPORT_ALIASES) {
    for (const valueId of alias.valueIds) {
      const value = VALUE_MAP[valueId]
      if (!value) continue
      const key = normalizeToken(alias.key)
      const fingerprint = `${key}::${valueId}`
      if (seen.has(fingerprint)) continue
      seen.add(fingerprint)
      entries.push({
        key,
        rawKey: alias.key,
        slotId: value.slot,
        valueId,
        label: value.label,
        isAlias: true,
        isCustom: true,
      })
    }
  }

  return entries
}

const VALUE_INDEX = buildValueIndex()
const VALUE_INDEX_BY_KEY = new Map<string, ValueIndexEntry[]>()
for (const entry of VALUE_INDEX) {
  const group = VALUE_INDEX_BY_KEY.get(entry.key) ?? []
  group.push(entry)
  VALUE_INDEX_BY_KEY.set(entry.key, group)
}

const SORTED_KEYS = [...VALUE_INDEX_BY_KEY.keys()].sort((a, b) => b.length - a.length)

function assignSelection(next: FacetSelections, slotId: string, valueId: string) {
  const slot = SLOT_MAP[slotId]
  if (!slot) return

  if (slot.mode === 'single') {
    if (!next[slotId]) next[slotId] = valueId
    else next[slotId] = valueId
    return
  }

  const current = Array.isArray(next[slotId]) ? [...(next[slotId] as string[])] : []
  if (!current.includes(valueId)) current.push(valueId)
  next[slotId] = current
}

function tokenizePrompt(text: string): string[] {
  return normalizeSeparatorText(text)
    .split(/[\n,]+/)
    .map(token => token.trim())
    .filter(Boolean)
}

function extractParameterSuffix(text: string): { content: string; parameterSuffix: string } {
  const parameterTokens = [...(text.match(/--[a-z0-9:_-]+(?:\s+[^\s,，、；;\n]+)*/gi) ?? [])]
  let content = text

  for (const token of parameterTokens) {
    content = content.replace(token, ' ')
  }

  const ratioMatch = content.match(/(?:aspect ratio|ratio|画幅比例|比例)\s*[:：]\s*(\d+:\d+)/i)
  if (ratioMatch) {
    parameterTokens.push(`--ar ${ratioMatch[1]}`)
    content = content.replace(ratioMatch[0], ' ')
  }

  return {
    content: content.replace(/\s+/g, ' ').trim(),
    parameterSuffix: [...new Set(parameterTokens.map(token => token.trim()).filter(Boolean))].join(' ').trim(),
  }
}

function parseNegativeBlock(text: string): { positiveText: string; negativeTokens: string[] } {
  const normalized = normalizeSeparatorText(text)
  const marker = /(负面提示词|负面词|负向提示词|negative prompts?|negative prompt|negative)\s*[:：]/i
  const match = marker.exec(normalized)

  if (!match || match.index === undefined) {
    return { positiveText: normalized.trim(), negativeTokens: [] }
  }

  const before = normalized.slice(0, match.index).trim()
  const after = normalized.slice(match.index + match[0].length).trim()
  return {
    positiveText: before,
    negativeTokens: tokenizePrompt(after),
  }
}

function stripMatchedFragments(token: string, matches: ValueIndexEntry[]): string {
  let remaining = token
  for (const match of matches) {
    const escaped = match.rawKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    remaining = remaining.replace(new RegExp(escaped, 'ig'), ' ')
  }
  return remaining
    .replace(/[，、；:：/|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function scoreEntry(entry: ValueIndexEntry, tokenKey: string, exact: boolean): number {
  let score = entry.key.length
  if (exact) score += 100
  if (entry.isAlias) score += 10
  if (entry.isCustom) score += 20
  if (tokenKey === entry.key) score += 30
  return score
}

function pickMatchesForToken(token: string): ValueIndexEntry[] {
  const tokenKey = normalizeToken(token)
  if (!tokenKey) return []

  const exactEntries = VALUE_INDEX_BY_KEY.get(tokenKey)
  if (exactEntries?.length) {
    return [...exactEntries]
      .sort((a, b) => scoreEntry(b, tokenKey, true) - scoreEntry(a, tokenKey, true))
      .reduce<ValueIndexEntry[]>((result, entry) => {
        if (!result.some(existing => existing.slotId === entry.slotId && existing.valueId === entry.valueId)) {
          result.push(entry)
        }
        return result
      }, [])
  }

  const matched: ValueIndexEntry[] = []
  for (const key of SORTED_KEYS) {
    if (key.length < 2 || !tokenKey.includes(key)) continue
    const entries = VALUE_INDEX_BY_KEY.get(key) ?? []
    for (const entry of entries) {
      if (!matched.some(existing => existing.slotId === entry.slotId && existing.valueId === entry.valueId)) {
        matched.push(entry)
      }
    }
  }

  if (matched.length > 0) {
    return matched.sort((a, b) => scoreEntry(b, tokenKey, false) - scoreEntry(a, tokenKey, false))
  }

  if (!containsCjk(tokenKey) && tokenKey.length >= 4) {
    const fuzzy = VALUE_INDEX
      .filter(entry => entry.key.includes(tokenKey) || tokenKey.includes(entry.key))
      .sort((a, b) => scoreEntry(b, tokenKey, false) - scoreEntry(a, tokenKey, false))
    return fuzzy.slice(0, 4)
  }

  return []
}

export function buildSegmentedPrompt(
  selections: FacetSelections,
  options?: {
    outputLang?: OutputLanguage
    promptStyle?: PromptStyle
    freeformPositive?: string
  },
) {
  const outputLang = options?.outputLang ?? 'zh'
  const promptStyle = options?.promptStyle ?? 'tag'
  const builtSections = buildSections(selections)
  const sections = builtSections.map(section => toPromptSection(section, outputLang))
  const trimmedFreeform = options?.freeformPositive?.trim()

  if (trimmedFreeform) {
    sections.push({
      id: 'freeform',
      label: outputLang === 'en' ? 'Additional Notes' : SECTION_LABELS.freeform,
      text: trimmedFreeform,
    })
  }

  const flatPrompt = buildFlatPrompt(builtSections, outputLang, trimmedFreeform)
  const naturalPrompt = buildNaturalPrompt(builtSections, outputLang, trimmedFreeform)
  const positivePrompt = promptStyle === 'natural' ? naturalPrompt : flatPrompt

  return { sections, flatPrompt, naturalPrompt, positivePrompt }
}

export function buildFacetedPrompt(selections: FacetSelections): string {
  return buildSegmentedPrompt(selections).flatPrompt
}

export function parseImportedPrompt(
  rawText: string,
  currentSelections: FacetSelections = {},
): {
  selections: FacetSelections
  freeformPositive: string
  freeformNegative: string[]
  importMeta: PromptImportMeta
} {
  const { content, parameterSuffix } = extractParameterSuffix(rawText)
  const { positiveText, negativeTokens } = parseNegativeBlock(content)
  const tokens = tokenizePrompt(positiveText)
  const next: FacetSelections = { ...currentSelections }
  const unmatchedPositive: string[] = []
  const matchedValues: PromptImportMatch[] = []
  const seenMatches = new Set<string>()

  for (const token of tokens) {
    const matches = pickMatchesForToken(token)
    if (matches.length === 0) {
      unmatchedPositive.push(token)
      continue
    }

    for (const match of matches) {
      assignSelection(next, match.slotId, match.valueId)
      const fingerprint = `${match.slotId}:${match.valueId}`
      if (seenMatches.has(fingerprint)) continue
      seenMatches.add(fingerprint)
      matchedValues.push({
        slotId: match.slotId,
        valueId: match.valueId,
        label: match.label,
        matchedText: match.rawKey,
      })
    }

    const remaining = stripMatchedFragments(token, matches)
    if (remaining) unmatchedPositive.push(remaining)
  }

  return {
    selections: next,
    freeformPositive: unmatchedPositive.join('，'),
    freeformNegative: negativeTokens,
    importMeta: {
      sourceText: rawText,
      matchedCount: matchedValues.length,
      matchedValues,
      unmatchedPositive,
      unmatchedNegative: negativeTokens,
      parameterSuffix,
    },
  }
}

export function detectFacetConflicts(selections: FacetSelections): FacetConflict[] {
  const results: FacetConflict[] = []

  for (const rule of CONFLICT_RULES) {
    const message = rule.check(selections)
    if (message) {
      results.push({ type: rule.type, rule, message, slot: '' })
    }
  }

  for (const facet of ALL_FACETS) {
    for (const slot of facet.slots) {
      const value = selections[slot.id]
      if (!value) continue

      if (slot.mode === 'single' && typeof value === 'string') {
        const valueObj = VALUE_MAP[value]
        if (valueObj?.conflicts) {
          for (const conflictId of valueObj.conflicts) {
            const conflictValue = VALUE_MAP[conflictId]
            if (!conflictValue) continue

            const selectedConflict = selections[conflictValue.slot]
            const hasConflict = typeof selectedConflict === 'string'
              ? selectedConflict === conflictId
              : Array.isArray(selectedConflict) && selectedConflict.includes(conflictId)

            if (hasConflict) {
              const message = `"${valueObj.label}" 与 "${conflictValue.label}" 冲突`
              results.push({
                type: 'hard',
                rule: { type: 'hard', description: message, check: () => null },
                message,
                slot: slot.id,
              })
            }
          }
        }
      }

      if (slot.mode !== 'single' && Array.isArray(value) && slot.maxSelect && value.length > slot.maxSelect) {
        const message = `${slot.label} 已选 ${value.length} 项，最多 ${slot.maxSelect} 项`
        results.push({
          type: 'soft',
          rule: { type: 'soft', description: message, check: () => null },
          message,
          slot: slot.id,
        })
      }
    }
  }

  return results
}

export function buildFacetedMetadata(selections: FacetSelections): Record<string, unknown> {
  const metadata: Record<string, unknown> = {}

  for (const facet of ALL_FACETS) {
    const slotData: Record<string, unknown> = {}

    for (const slot of facet.slots) {
      const selected = selections[slot.id]
      if (!selected) continue

      if (typeof selected === 'string') {
        const value = VALUE_MAP[selected]
        slotData[slot.id] = value ? { id: value.id, label: value.label } : selected
        continue
      }

      if (Array.isArray(selected)) {
        slotData[slot.id] = selected.map(valueId => {
          const value = VALUE_MAP[valueId]
          return value ? { id: value.id, label: value.label } : valueId
        })
      }
    }

    if (Object.keys(slotData).length > 0) {
      metadata[facet.id] = { facet: facet.label, slots: slotData }
    }
  }

  return metadata
}

export function getSelectionSummary(selections: FacetSelections): string {
  const labels: string[] = []
  for (const facet of ALL_FACETS) {
    for (const slot of facet.slots) {
      const selected = selections[slot.id]
      if (!selected) continue

      if (typeof selected === 'string') {
        const value = VALUE_MAP[selected]
        if (value) labels.push(value.label)
        continue
      }

      for (const valueId of selected) {
        const value = VALUE_MAP[valueId]
        if (value) labels.push(value.label)
      }
    }
  }

  return labels.join(' · ')
}

export function getSelectedCount(selections: FacetSelections): { filled: number; total: number } {
  let filled = 0
  let total = 0

  for (const facet of ALL_FACETS) {
    for (const slot of facet.slots) {
      total += 1
      const selected = selections[slot.id]
      if (typeof selected === 'string' && selected) {
        filled += 1
      } else if (Array.isArray(selected) && selected.length > 0) {
        filled += 1
      }
    }
  }

  return { filled, total }
}
