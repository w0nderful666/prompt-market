#!/usr/bin/env node

import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

type ExternalPromptLanguage = 'zh' | 'en' | 'mixed'
type ExternalPromptEntryKind = 'template' | 'case'
type ExternalPromptLibrarySourceTier = 'structured-primary' | 'large-gallery-secondary'
type ExternalPromptLibraryQualityTier = 'curated' | 'usable' | 'noisy'
type ExternalPromptLibraryNormalizedCategory =
  | 'portrait'
  | 'photography'
  | 'cinematic'
  | 'street'
  | 'fashion'
  | 'lifestyle'
  | 'realism'
  | 'character-consistency'
  | 'phone-camera'
  | 'film-texture'
  | 'social-snapshot'
  | 'beauty'
  | 'commercial'
  | 'ui-graphic'
  | 'poster'
  | 'other'

type ImportHints = Record<string, string | string[]>

type ExternalPromptLibrarySource = {
  id: string
  label: string
  labelEn?: string
  repo: string
  sourceUrl: string
  license: string
  kind: 'structured' | 'curated'
  sourceTier: ExternalPromptLibrarySourceTier
  description: string
}

type ExternalPromptLibraryEntry = {
  id: string
  sourceId: string
  sourceRepo: string
  sourceUrl: string
  title: string
  author: string
  license: string
  category: string
  styleTags: string[]
  sceneTags: string[]
  prompt: string
  description?: string
  displayTitleZh?: string
  displaySummaryZh?: string
  displayCategoryZh: string
  previewImage?: string
  language: ExternalPromptLanguage
  importHints: ImportHints
  sourceTier: ExternalPromptLibrarySourceTier
  qualityTier: ExternalPromptLibraryQualityTier
  recommendedForCurrentProduct: boolean
  chunkId: string
  searchText: string
  originalCategory: string
  normalizedCategory: ExternalPromptLibraryNormalizedCategory
  importConfidence: number
  portraitFocused: boolean
  entryKind: ExternalPromptEntryKind
}

type ExternalPromptLibraryCategorySummary = {
  id: ExternalPromptLibraryNormalizedCategory
  label: string
  recommended: boolean
  entryCount: number
  recommendedOrder: number | null
}

type ExternalPromptLibraryChunkMeta = {
  id: string
  sourceId: string
  normalizedCategory: ExternalPromptLibraryNormalizedCategory
  label: string
  path: string
  entryCount: number
}

type ExternalPromptLibraryEntrySummary = Omit<ExternalPromptLibraryEntry, 'prompt' | 'promptZh'>

type ExternalPromptLibraryChunk = {
  meta: ExternalPromptLibraryChunkMeta
  entries: ExternalPromptLibraryEntry[]
}

type ExternalPromptLibraryIndex = {
  sources: ExternalPromptLibrarySource[]
  categories: ExternalPromptLibraryCategorySummary[]
  chunks: ExternalPromptLibraryChunkMeta[]
  entryIndex: ExternalPromptLibraryEntrySummary[]
}

type FreestyleflyLibrary = {
  templates: Array<{
    id: string
    title?: { en?: string; zh?: string }
    description?: { en?: string; zh?: string }
    category?: string
    styles?: string[]
    scenes?: string[]
    tags?: string[]
    useWhen?: { en?: string; zh?: string }
    guidance?: { en?: string[]; zh?: string[] }
    pitfalls?: { en?: string[]; zh?: string[] }
  }>
}

type YouMindManifest = {
  categories: Array<{
    slug: string
    title: string
    file: string
    count: number
  }>
}

type YouMindEntry = {
  id: number
  content: string
  title?: string
  description?: string
  sourceMedia?: string[]
  needReferenceImages?: boolean
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const externalRoot = path.join(root, '.tmp', 'external-src')
const manifestPublicPath = '/external-library-manifest-v2.json'
const manifestOutputPath = path.join(root, 'public', manifestPublicPath.replace(/^\//, ''))
const chunkPublicRoot = 'external-library-chunks-v2'
const chunkRoot = path.join(root, 'public', chunkPublicRoot)
const legacyGeneratedTsPath = path.join(root, 'src', 'data', 'externalPromptLibrary.generated.ts')

const CATEGORY_LABELS: Record<ExternalPromptLibraryNormalizedCategory, string> = {
  portrait: '人像',
  photography: '摄影',
  cinematic: '电影感',
  street: '街拍',
  fashion: '时尚',
  lifestyle: '生活方式',
  realism: '写实',
  'character-consistency': '角色一致性',
  'phone-camera': '手机感',
  'film-texture': '胶片感',
  'social-snapshot': '社交快照',
  beauty: '美妆',
  commercial: '商业',
  'ui-graphic': 'UI / 设计',
  poster: '海报',
  other: '其他',
}

const CATEGORY_ORDER: ExternalPromptLibraryNormalizedCategory[] = [
  'portrait',
  'street',
  'cinematic',
  'fashion',
  'lifestyle',
  'phone-camera',
  'film-texture',
  'photography',
  'realism',
  'beauty',
  'commercial',
  'poster',
  'ui-graphic',
  'character-consistency',
  'social-snapshot',
  'other',
]

const RECOMMENDED_CATEGORIES = new Set<ExternalPromptLibraryNormalizedCategory>([
  'portrait',
  'street',
  'cinematic',
  'fashion',
  'lifestyle',
  'phone-camera',
  'film-texture',
  'photography',
  'realism',
  'beauty',
])

const SOURCES: ExternalPromptLibrarySource[] = [
  {
    id: 'freestylefly',
    label: 'FreestyleFly 结构化词库',
    labelEn: 'FreestyleFly Structured Library',
    repo: 'freestylefly/awesome-gpt-image-2',
    sourceUrl: 'https://github.com/freestylefly/awesome-gpt-image-2',
    license: 'See source repository',
    kind: 'structured',
    sourceTier: 'structured-primary',
    description: '结构化模板源，适合做稳定的外挂词库骨架。',
  },
  {
    id: 'evolink',
    label: 'EvoLinkAI 大型案例库',
    labelEn: 'EvoLinkAI Prompt Gallery',
    repo: 'EvoLinkAI/awesome-gpt-image-2-API-and-Prompts',
    sourceUrl: 'https://github.com/EvoLinkAI/awesome-gpt-image-2-API-and-Prompts',
    license: 'See source repository',
    kind: 'curated',
    sourceTier: 'large-gallery-secondary',
    description: '案例密度很高的英文图库，适合拿来做场景灵感和微调参考。',
  },
  {
    id: 'youmind',
    label: 'YouMind 全量搜索库',
    labelEn: 'YouMind Prompt Search',
    repo: 'YouMind-OpenLab/gpt-image-2-prompts-search',
    sourceUrl: 'https://github.com/YouMind-OpenLab/gpt-image-2-prompts-search',
    license: 'See source repository',
    kind: 'curated',
    sourceTier: 'large-gallery-secondary',
    description: '条目量最大的搜索库，适合作为全量外挂提示词索引。',
  },
]

const TITLE_TRANSLATIONS: Array<[RegExp, string]> = [
  [/\bportraits?\b/gi, '人像'],
  [/\bheadshot\b/gi, '证件人像'],
  [/\bselfie\b/gi, '自拍'],
  [/\bstreet\b/gi, '街拍'],
  [/\bcinematic\b/gi, '电影感'],
  [/\bfashion\b/gi, '时尚'],
  [/\beditorial\b/gi, '编辑感'],
  [/\bfilm\b/gi, '胶片'],
  [/\banalog\b/gi, '模拟胶片'],
  [/\bbeauty\b/gi, '美妆'],
  [/\bluxury\b/gi, '轻奢'],
  [/\bglam\b/gi, '华丽'],
  [/\bstudio\b/gi, '棚拍'],
  [/\bcafe\b/gi, '咖啡馆'],
  [/\bcaf茅\b/gi, '咖啡馆'],
  [/\bcoffee\b/gi, '咖啡'],
  [/\bmirror\b/gi, '镜前'],
  [/\bsummer\b/gi, '夏日'],
  [/\bgolden hour\b/gi, '黄金时刻'],
  [/\bbalcony\b/gi, '阳台'],
  [/\bseaside\b/gi, '海边'],
  [/\bbeach\b/gi, '海滩'],
  [/\bgraduation\b/gi, '毕业'],
  [/\bmagic academy\b/gi, '魔法学院'],
  [/\bphone camera\b/gi, '手机感'],
  [/\bsnapshot\b/gi, '抓拍'],
  [/\bposter\b/gi, '海报'],
  [/\bui\b/gi, '界面'],
  [/\bcommercial\b/gi, '商业'],
  [/\bproduct\b/gi, '产品'],
  [/\bavatar\b/gi, '头像'],
]

const CATEGORY_KEYWORDS: Record<ExternalPromptLibraryNormalizedCategory, string[]> = {
  portrait: ['portrait', 'headshot', 'avatar', 'selfie', 'idol', 'model', 'face', 'girl', 'woman', 'man', 'person'],
  photography: ['photography', 'photo', 'camera', 'dslr', 'lens', 'shot', 'composition'],
  cinematic: ['cinematic', 'movie', 'film still', 'trailer', 'dramatic', 'story-driven', 'scene'],
  street: ['street', 'urban', 'sidewalk', 'crosswalk', 'alley', 'subway', 'commute', 'city walk'],
  fashion: ['fashion', 'editorial', 'lookbook', 'runway', 'styling', 'outfit', 'haute couture'],
  lifestyle: ['lifestyle', 'candid', 'everyday', 'cozy', 'cafe', 'balcony', 'travel photo', 'daily life'],
  realism: ['realistic', 'photoreal', 'photorealistic', 'ultra realistic', 'real-life'],
  'character-consistency': ['same face', 'identity reference', 'preserve identity', 'same subject', 'character consistency'],
  'phone-camera': ['phone camera', 'iphone', 'smartphone', 'mirror selfie', 'front camera'],
  'film-texture': ['film grain', '35mm', 'fujifilm', 'kodak', 'analog', 'halation', 'vintage camera'],
  'social-snapshot': ['social post', 'instagram', 'xiaohongshu', 'tiktok', 'ugc', 'feed', 'screenshot'],
  beauty: ['beauty', 'makeup', 'cosmetics', 'skincare', 'lipstick', 'glam'],
  commercial: ['ad', 'campaign', 'commerce', 'e-commerce', 'product marketing', 'brand', 'packaging'],
  'ui-graphic': ['ui', 'interface', 'app', 'web design', 'dashboard', 'infographic', 'wireframe', 'thumbnail layout'],
  poster: ['poster', 'flyer', 'cover', 'thumbnail', 'typography', 'billboard'],
  other: [],
}

const YOU_MIND_CATEGORY_SEEDS: Record<string, Partial<Record<ExternalPromptLibraryNormalizedCategory, number>>> = {
  'profile-avatar': { portrait: 5, beauty: 2, 'character-consistency': 1 },
  'social-media-post': { 'social-snapshot': 4, poster: 1 },
  'infographic-edu-visual': { 'ui-graphic': 5 },
  'youtube-thumbnail': { poster: 4, 'social-snapshot': 2 },
  'comic-storyboard': { other: 4, cinematic: 1 },
  'product-marketing': { commercial: 5 },
  'ecommerce-main-image': { commercial: 5 },
  'game-asset': { other: 4, 'character-consistency': 1 },
  'poster-flyer': { poster: 5 },
  'app-web-design': { 'ui-graphic': 5 },
  others: { other: 2 },
}

const FREESTYLE_CATEGORY_SEEDS: Record<string, Partial<Record<ExternalPromptLibraryNormalizedCategory, number>>> = {
  'UI & Interfaces': { 'ui-graphic': 5 },
  'Charts & Infographics': { 'ui-graphic': 5 },
  'Posters & Typography': { poster: 5 },
  'Products & E-commerce': { commercial: 5 },
  'Brand & Logos': { commercial: 4, poster: 1 },
  'Architecture & Spaces': { other: 3 },
  'Photography & Realism': { portrait: 3, photography: 3, realism: 2 },
  'Illustration & Art': { other: 4 },
  'Characters & People': { portrait: 4, 'character-consistency': 2 },
  'Scenes & Storytelling': { cinematic: 3, lifestyle: 2 },
  'History & Classical Themes': { other: 3 },
  'Documents & Publishing': { 'ui-graphic': 3, poster: 1 },
  'Other Use Cases': { other: 2 },
}

const EVOLINK_FILENAME_SEEDS: Array<[RegExp, Partial<Record<ExternalPromptLibraryNormalizedCategory, number>>]> = [
  [/portrait/i, { portrait: 6, realism: 2 }],
  [/beauty/i, { beauty: 6, portrait: 2 }],
  [/fashion/i, { fashion: 6, portrait: 2 }],
  [/street/i, { street: 6, portrait: 2 }],
  [/photo/i, { photography: 5, realism: 2 }],
  [/cinematic/i, { cinematic: 6, portrait: 1 }],
  [/product|ecommerce|commerce|ad-creative/i, { commercial: 6 }],
  [/poster|flyer|thumbnail/i, { poster: 6 }],
  [/ui|app|dashboard|web/i, { 'ui-graphic': 6 }],
  [/character/i, { 'character-consistency': 5, portrait: 1 }],
]

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

function safeReadJson<T>(filePath: string): T {
  return JSON.parse(readFileSync(filePath, 'utf8')) as T
}

function uniq(values: string[]) {
  return [...new Set(values.filter(Boolean))]
}

function stripMarkdown(text: string) {
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]+\]\(([^)]+)\)/g, '$1')
    .replace(/[*_>#|`~-]/g, ' ')
}

function cleanText(text: string | undefined | null) {
  if (!text) return ''
  return text
    .normalize('NFKC')
    .replace(/\r/g, '\n')
    .replace(/\u00a0/g, ' ')
    .replace(/\u200b/g, '')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[—–]/g, '-')
    .replace(/鈥檚/g, "'s")
    .replace(/鈥檛/g, "n't")
    .replace(/鈥檒/g, "'l")
    .replace(/鈥檓/g, "'m")
    .replace(/鈥檙e/g, "'re")
    .replace(/鈥淢|鈥淧|鈥淐|鈥淭|鈥淔|鈥淥|鈥淪|鈥淎|鈥淓|鈥淲/g, '"')
    .replace(/鈥�/g, "'")
    .replace(/鈥攊|鈥攍|鈥攖|鈥攑|鈥攂|鈥攕|鈥攏/g, '-')
    .replace(/caf茅/gi, match => (match[0] === 'C' ? 'Cafe' : 'cafe'))
    .replace(/AI fake faces?/gi, 'AI fake faces')
    .replace(/\{argument[^}]*default="([^"]+)"[^}]*\}/g, '$1')
    .replace(/\{argument[^}]*\}/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim()
}

function lower(text: string) {
  return cleanText(text).toLowerCase()
}

function containsChinese(text: string) {
  return /[\u3400-\u9fff]/.test(text)
}

function hasLatin(text: string) {
  return /[A-Za-z]/.test(text)
}

function detectLanguage(text: string): ExternalPromptLanguage {
  const zh = containsChinese(text)
  const en = hasLatin(text)
  if (zh && en) return 'mixed'
  if (zh) return 'zh'
  return 'en'
}

function looksMojibake(text: string) {
  const markers = ['锛', '銆', '鈥', '馃', '鈥', '鍥', '涓', '€']
  const hits = markers.reduce((count, marker) => count + (text.includes(marker) ? 1 : 0), 0)
  return hits >= 2
}

function pickPreview(entry: { sourceMedia?: string[] }) {
  return entry.sourceMedia?.[0]
}

function scoreKeywords(text: string, keywords: string[]) {
  let score = 0
  for (const keyword of keywords) {
    if (text.includes(keyword)) score += 1
  }
  return score
}

function seedScores(target: Map<ExternalPromptLibraryNormalizedCategory, number>, seed?: Partial<Record<ExternalPromptLibraryNormalizedCategory, number>>) {
  if (!seed) return
  for (const [category, score] of Object.entries(seed) as Array<[ExternalPromptLibraryNormalizedCategory, number]>) {
    target.set(category, (target.get(category) ?? 0) + score)
  }
}

function inferCategory(text: string, sourceId: string, originalCategory: string, seedKey?: string): ExternalPromptLibraryNormalizedCategory {
  const haystack = lower(text)
  const phoneScore = scoreKeywords(haystack, CATEGORY_KEYWORDS['phone-camera'])
  const filmScore = scoreKeywords(haystack, CATEGORY_KEYWORDS['film-texture'])
  const streetScore = scoreKeywords(haystack, CATEGORY_KEYWORDS.street)
  const fashionScore = scoreKeywords(haystack, CATEGORY_KEYWORDS.fashion)
  const cinematicScore = scoreKeywords(haystack, CATEGORY_KEYWORDS.cinematic)
  const lifestyleScore = scoreKeywords(haystack, CATEGORY_KEYWORDS.lifestyle)

  if (phoneScore >= 2) return 'phone-camera'
  if (filmScore >= 2) return 'film-texture'
  if (streetScore >= 2 && !haystack.includes('poster')) return 'street'
  if (fashionScore >= 2 && !haystack.includes('poster')) return 'fashion'
  if (cinematicScore >= 2 && !haystack.includes('poster')) return 'cinematic'
  if (lifestyleScore >= 2 && !haystack.includes('poster')) return 'lifestyle'

  const scores = new Map<ExternalPromptLibraryNormalizedCategory, number>()
  if (sourceId === 'youmind') seedScores(scores, YOU_MIND_CATEGORY_SEEDS[seedKey ?? ''])
  if (sourceId === 'freestylefly') seedScores(scores, FREESTYLE_CATEGORY_SEEDS[originalCategory])
  if (sourceId === 'evolink') {
    for (const [pattern, seed] of EVOLINK_FILENAME_SEEDS) {
      if (pattern.test(seedKey ?? '')) seedScores(scores, seed)
    }
  }

  for (const category of CATEGORY_ORDER) {
    const keywords = CATEGORY_KEYWORDS[category]
    const keywordScore = scoreKeywords(haystack, keywords)
    if (keywordScore > 0) scores.set(category, (scores.get(category) ?? 0) + keywordScore)
  }

  if (!scores.size) {
    if (haystack.includes('portrait') || haystack.includes('photo')) return 'portrait'
    return 'other'
  }

  return [...scores.entries()].sort((a, b) => b[1] - a[1])[0][0]
}

function inferPortraitFocused(category: ExternalPromptLibraryNormalizedCategory, text: string) {
  if (RECOMMENDED_CATEGORIES.has(category)) return true
  return scoreKeywords(lower(text), CATEGORY_KEYWORDS.portrait) > 0
}

function buildImportHints(category: ExternalPromptLibraryNormalizedCategory, styleTags: string[], sceneTags: string[]): ImportHints {
  const styleText = lower(styleTags.join(' '))
  const sceneText = lower(sceneTags.join(' '))
  const hints: ImportHints = {}

  if (category === 'portrait' || category === 'beauty') hints.shotType = 'shot_studio_portrait'
  if (category === 'street') hints.scenePrimary = 'scene_street'
  if (category === 'lifestyle' && sceneText.includes('cafe')) hints.scenePrimary = 'scene_cafe'
  if (category === 'phone-camera') hints.shootingMedium = 'med_phone'
  if (category === 'film-texture') hints.colorGradePrimary = 'color_film'
  if (styleText.includes('cinematic') || category === 'cinematic') hints.trendAesthetic = ['trend_story_documentary']
  if (styleText.includes('beauty') || category === 'beauty') hints.shotType = 'shot_beauty_closeup'

  return hints
}

function buildLocalizedTitle(title: string) {
  let localized = cleanText(title)
  let replaced = false
  for (const [pattern, replacement] of TITLE_TRANSLATIONS) {
    if (pattern.test(localized)) {
      localized = localized.replace(pattern, replacement)
      replaced = true
    }
  }
  localized = localized.replace(/\s{2,}/g, ' ').trim()
  return replaced ? localized : undefined
}

function buildSummaryZh(
  source: ExternalPromptLibrarySource,
  category: ExternalPromptLibraryNormalizedCategory,
  quality: ExternalPromptLibraryQualityTier,
  title: string,
  styleTags: string[],
  sceneTags: string[],
) {
  const tags = [...styleTags.slice(0, 2), ...sceneTags.slice(0, 2)].filter(Boolean)
  const tagText = tags.length > 0 ? ` 关键词：${tags.join('、')}。` : ' '
  const qualityText = quality === 'curated'
    ? '结构更完整，适合直接导入高级编辑。'
    : quality === 'usable'
      ? '可直接作为灵感底稿，再去高级编辑细调。'
      : '原始文本噪音偏多，导入后建议顺手清理一下。'
  return `来自${source.label}的${CATEGORY_LABELS[category]}条目《${title}》。${tagText}${qualityText}`
}

function buildSearchText(parts: string[]) {
  return lower(parts.join(' ').replace(/\n/g, ' ')).slice(0, 6000)
}

function buildQualityTier(sourceId: string, prompt: string, title: string, category: ExternalPromptLibraryNormalizedCategory): ExternalPromptLibraryQualityTier {
  const promptLength = prompt.length
  if (looksMojibake(title) || (promptLength > 0 && looksMojibake(prompt.slice(0, 200)))) return 'noisy'
  if (sourceId === 'freestylefly') return 'curated'
  if (sourceId === 'evolink' && promptLength > 80 && category !== 'ui-graphic') return 'curated'
  if (promptLength < 80) return 'noisy'
  return 'usable'
}

function buildImportConfidence(sourceId: string, category: ExternalPromptLibraryNormalizedCategory, quality: ExternalPromptLibraryQualityTier, portraitFocused: boolean) {
  let score = sourceId === 'freestylefly' ? 0.92 : sourceId === 'evolink' ? 0.88 : 0.8
  if (RECOMMENDED_CATEGORIES.has(category)) score += 0.05
  if (portraitFocused) score += 0.02
  if (quality === 'usable') score -= 0.08
  if (quality === 'noisy') score -= 0.2
  return Math.max(0.35, Math.min(0.98, Number(score.toFixed(2))))
}

function buildChunkPath(sourceId: string, category: ExternalPromptLibraryNormalizedCategory) {
  return `/${chunkPublicRoot}/${sourceId}/${category}.json`
}

function writeJson(filePath: string, value: unknown) {
  mkdirSync(path.dirname(filePath), { recursive: true })
  writeFileSync(filePath, JSON.stringify(value, null, 2), 'utf8')
}

function resetDirectory(directoryPath: string) {
  mkdirSync(directoryPath, { recursive: true })
  for (const name of readdirSync(directoryPath)) {
    rmSync(path.join(directoryPath, name), { recursive: true, force: true })
  }
}

function toSummary(entry: ExternalPromptLibraryEntry): ExternalPromptLibraryEntrySummary {
  const { prompt: _prompt, promptZh: _promptZh, ...summary } = entry
  return summary
}

function parseFreestyleflyEntries() {
  const source = SOURCES.find(item => item.id === 'freestylefly')!
  const library = safeReadJson<FreestyleflyLibrary>(path.join(externalRoot, 'freestylefly', 'data', 'style-library.json'))
  const entries: ExternalPromptLibraryEntry[] = []

  for (const template of library.templates ?? []) {
      const title = cleanText(template.title?.en || template.id)
      const titleZh = template.title?.zh ? cleanText(template.title.zh) : undefined
      const description = cleanText(template.description?.en || template.useWhen?.en)
      const descriptionZh = template.description?.zh ? cleanText(template.description.zh) : undefined
      const guidance = uniq([...(template.guidance?.en ?? []), ...(template.pitfalls?.en ?? [])].map(cleanText)).join('\n')
      const guidanceZh = uniq([...(template.guidance?.zh ?? []), ...(template.pitfalls?.zh ?? [])].map(cleanText)).join('\n')
      const prompt = cleanText([description, guidance].filter(Boolean).join('\n\n'))
      const promptZh = cleanText([descriptionZh || cleanText(template.useWhen?.zh || ''), guidanceZh].filter(Boolean).join('\n\n'))
    const styleTags = uniq([...(template.styles ?? []), ...(template.tags ?? [])].map(cleanText))
    const sceneTags = uniq((template.scenes ?? []).map(cleanText))
    const originalCategory = cleanText(template.category || 'Other Use Cases')
    const categoryText = [title, description, prompt, originalCategory, styleTags.join(' '), sceneTags.join(' ')].join(' ')
    const normalizedCategory = inferCategory(categoryText, source.id, originalCategory, template.id)
    const portraitFocused = inferPortraitFocused(normalizedCategory, categoryText)
      const qualityTier = buildQualityTier(source.id, prompt, title, normalizedCategory)
      const importConfidence = buildImportConfidence(source.id, normalizedCategory, qualityTier, portraitFocused)
      const displayTitleZh = titleZh || buildLocalizedTitle(title) || undefined

      entries.push({
        id: `freestylefly-${template.id}`,
        sourceId: source.id,
        sourceRepo: source.repo,
        sourceUrl: `${source.sourceUrl}/blob/main/data/style-library.json`,
        title,
        author: 'freestylefly',
        license: source.license,
        category: originalCategory,
        styleTags,
        sceneTags,
        prompt,
        description,
        descriptionZh,
        displayTitleZh,
        promptZh: promptZh || undefined,
        displaySummaryZh: buildSummaryZh(source, normalizedCategory, qualityTier, titleZh || title, styleTags, sceneTags),
      displayCategoryZh: CATEGORY_LABELS[normalizedCategory],
      language: detectLanguage(`${title} ${description} ${prompt}`),
      importHints: buildImportHints(normalizedCategory, styleTags, sceneTags),
      sourceTier: source.sourceTier,
      qualityTier,
      recommendedForCurrentProduct: RECOMMENDED_CATEGORIES.has(normalizedCategory) || portraitFocused,
      chunkId: `${source.id}:${normalizedCategory}`,
      searchText: buildSearchText([title, description, prompt, originalCategory, ...styleTags, ...sceneTags]),
      originalCategory,
      normalizedCategory,
      importConfidence,
      portraitFocused,
      entryKind: 'template',
    })
  }

  return entries
}

function parseEvolinkEntries() {
  const source = SOURCES.find(item => item.id === 'evolink')!
  const casesDir = path.join(externalRoot, 'evolink', 'cases')
  const files = readdirSync(casesDir).filter(file => file.endsWith('.md') && !/_([a-z]{2}(?:-[A-Z]{2})?)\.md$/.test(file))
  const entries: ExternalPromptLibraryEntry[] = []

  const casePattern = /^###\s*Case\s+\d+:\s*\[(.+?)\]\((.+?)\)\s*\(by\s+\[@?([^\]]+)\]\([^)]+\)\)([\s\S]*?)(?=^###\s*Case\s+\d+:|\Z)/gm
  for (const file of files) {
    const originalCategory = cleanText(path.basename(file, '.md'))
    const raw = readFileSync(path.join(casesDir, file), 'utf8')
    for (const match of raw.matchAll(casePattern)) {
      const title = cleanText(match[1])
      const sourceUrl = cleanText(match[2]) || `${source.sourceUrl}/blob/main/cases/${file}`
      const author = cleanText(match[3]) || 'unknown'
      const block = match[4]
      const prompt = cleanText(block.match(/\*\*Prompt:\*\*\s*```([\s\S]*?)```/m)?.[1] ?? '')
      const description = cleanText(block.replace(/\*\*Prompt:\*\*[\s\S]*$/m, '').replace(/\|[\s\S]*?\|/g, ' '))
      const styleTags = uniq([
        ...extractTagsFromText(title),
        ...extractTagsFromText(prompt),
      ]).slice(0, 8)
      const sceneTags = uniq(extractSceneTags(title, prompt)).slice(0, 8)
      const categoryText = [originalCategory, title, description, prompt].join(' ')
      const normalizedCategory = inferCategory(categoryText, source.id, originalCategory, file)
      const portraitFocused = inferPortraitFocused(normalizedCategory, categoryText)
      const qualityTier = buildQualityTier(source.id, prompt, title, normalizedCategory)
      const importConfidence = buildImportConfidence(source.id, normalizedCategory, qualityTier, portraitFocused)
      const displayTitleZh = buildLocalizedTitle(title)

      entries.push({
        id: `evolink-${originalCategory}-${slugify(title)}`.slice(0, 120),
        sourceId: source.id,
        sourceRepo: source.repo,
        sourceUrl,
        title,
        author,
        license: source.license,
        category: originalCategory,
        styleTags,
        sceneTags,
        prompt,
        description,
        displayTitleZh,
        displaySummaryZh: buildSummaryZh(source, normalizedCategory, qualityTier, title, styleTags, sceneTags),
        displayCategoryZh: CATEGORY_LABELS[normalizedCategory],
        language: detectLanguage(`${title} ${description} ${prompt}`),
        importHints: buildImportHints(normalizedCategory, styleTags, sceneTags),
        sourceTier: source.sourceTier,
        qualityTier,
        recommendedForCurrentProduct: RECOMMENDED_CATEGORIES.has(normalizedCategory) || portraitFocused,
        chunkId: `${source.id}:${normalizedCategory}`,
        searchText: buildSearchText([title, description, prompt, originalCategory, author, ...styleTags, ...sceneTags]),
        originalCategory,
        normalizedCategory,
        importConfidence,
        portraitFocused,
        entryKind: 'case',
      })
    }
  }

  return entries
}

function parseYouMindEntries() {
  const source = SOURCES.find(item => item.id === 'youmind')!
  const manifest = safeReadJson<YouMindManifest>(path.join(externalRoot, 'youmind-search', 'references', 'manifest.json'))
  const entries: ExternalPromptLibraryEntry[] = []

  for (const category of manifest.categories ?? []) {
    const filePath = path.join(externalRoot, 'youmind-search', 'references', category.file)
    const items = safeReadJson<YouMindEntry[]>(filePath)
    for (const item of items) {
      const title = cleanText(item.title || `${category.title} ${item.id}`)
      const description = cleanText(item.description)
      const prompt = cleanText(item.content)
      const styleTags = uniq([
        ...extractTagsFromText(title),
        ...extractTagsFromText(description),
        ...extractTagsFromText(prompt),
      ]).slice(0, 8)
      const sceneTags = uniq(extractSceneTags(title, description, prompt)).slice(0, 8)
      const categoryText = [category.title, title, description, prompt].join(' ')
      const normalizedCategory = inferCategory(categoryText, source.id, category.title, category.slug)
      const portraitFocused = inferPortraitFocused(normalizedCategory, categoryText)
      const qualityTier = buildQualityTier(source.id, prompt, title, normalizedCategory)
      const importConfidence = buildImportConfidence(source.id, normalizedCategory, qualityTier, portraitFocused)
      const displayTitleZh = buildLocalizedTitle(title)

      entries.push({
        id: `youmind-${category.slug}-${item.id}`,
        sourceId: source.id,
        sourceRepo: source.repo,
        sourceUrl: `${source.sourceUrl}/blob/main/references/${category.file}`,
        title,
        author: 'YouMind',
        license: source.license,
        category: category.title,
        styleTags,
        sceneTags,
        prompt,
        description,
        displayTitleZh,
        displaySummaryZh: buildSummaryZh(source, normalizedCategory, qualityTier, title, styleTags, sceneTags),
        displayCategoryZh: CATEGORY_LABELS[normalizedCategory],
        previewImage: pickPreview(item),
        language: detectLanguage(`${title} ${description} ${prompt}`),
        importHints: {
          ...buildImportHints(normalizedCategory, styleTags, sceneTags),
          ...(item.needReferenceImages ? { referenceMode: 'identity-reference' } : {}),
        },
        sourceTier: source.sourceTier,
        qualityTier,
        recommendedForCurrentProduct: RECOMMENDED_CATEGORIES.has(normalizedCategory) || portraitFocused,
        chunkId: `${source.id}:${normalizedCategory}`,
        searchText: buildSearchText([title, description, prompt, category.title, ...styleTags, ...sceneTags]),
        originalCategory: category.title,
        normalizedCategory,
        importConfidence,
        portraitFocused,
        entryKind: 'case',
      })
    }
  }

  return entries
}

function slugify(text: string) {
  return lower(text)
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function extractTagsFromText(...texts: string[]) {
  const joined = lower(texts.join(' '))
  const tags: string[] = []
  const pushIf = (needle: string, label: string) => {
    if (joined.includes(needle)) tags.push(label)
  }

  pushIf('portrait', 'portrait')
  pushIf('cinematic', 'cinematic')
  pushIf('editorial', 'editorial')
  pushIf('35mm', '35mm')
  pushIf('film', 'film')
  pushIf('analog', 'analog')
  pushIf('fashion', 'fashion')
  pushIf('beauty', 'beauty')
  pushIf('realistic', 'realistic')
  pushIf('phone', 'phone camera')
  pushIf('selfie', 'selfie')
  pushIf('documentary', 'documentary')
  pushIf('street', 'street')
  pushIf('studio', 'studio')
  pushIf('snapshot', 'snapshot')
  pushIf('magazine', 'magazine')

  return uniq(tags)
}

function extractSceneTags(...texts: string[]) {
  const joined = lower(texts.join(' '))
  const tags: string[] = []
  const pushIf = (needle: string, label: string) => {
    if (joined.includes(needle)) tags.push(label)
  }

  pushIf('cafe', 'cafe')
  pushIf('caf茅', 'cafe')
  pushIf('street', 'street')
  pushIf('studio', 'studio')
  pushIf('beach', 'beach')
  pushIf('seaside', 'seaside')
  pushIf('balcony', 'balcony')
  pushIf('bedroom', 'bedroom')
  pushIf('library', 'library')
  pushIf('classroom', 'classroom')
  pushIf('office', 'office')
  pushIf('basketball', 'basketball court')
  pushIf('city', 'city')
  pushIf('mirror', 'mirror')

  return uniq(tags)
}

function dedupeEntries(entries: ExternalPromptLibraryEntry[]) {
  const seen = new Set<string>()
  const result: ExternalPromptLibraryEntry[] = []
  for (const entry of entries) {
    const key = `${entry.sourceId}|${lower(entry.title)}|${lower(entry.prompt.slice(0, 160))}`
    if (seen.has(key)) continue
    seen.add(key)
    result.push(entry)
  }
  return result
}

function buildArtifacts(entries: ExternalPromptLibraryEntry[]) {
  const chunkMap = new Map<string, ExternalPromptLibraryEntry[]>()
  for (const entry of entries) {
    const list = chunkMap.get(entry.chunkId) ?? []
    list.push(entry)
    chunkMap.set(entry.chunkId, list)
  }

  const chunks: ExternalPromptLibraryChunkMeta[] = []
  for (const [chunkId, chunkEntries] of [...chunkMap.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    const [sourceId, normalizedCategory] = chunkId.split(':') as [string, ExternalPromptLibraryNormalizedCategory]
    const chunkMeta: ExternalPromptLibraryChunkMeta = {
      id: chunkId,
      sourceId,
      normalizedCategory,
      label: `${SOURCES.find(source => source.id === sourceId)?.label ?? sourceId} · ${CATEGORY_LABELS[normalizedCategory]}`,
      path: buildChunkPath(sourceId, normalizedCategory),
      entryCount: chunkEntries.length,
    }
    chunks.push(chunkMeta)
    const chunk: ExternalPromptLibraryChunk = {
      meta: chunkMeta,
      entries: chunkEntries.sort((a, b) => b.importConfidence - a.importConfidence),
    }
    writeJson(path.join(root, 'public', chunkMeta.path.replace(/^\//, '')), chunk)
  }

  const categories: ExternalPromptLibraryCategorySummary[] = CATEGORY_ORDER.map((category, index) => ({
    id: category,
    label: CATEGORY_LABELS[category],
    recommended: RECOMMENDED_CATEGORIES.has(category),
    entryCount: entries.filter(entry => entry.normalizedCategory === category).length,
    recommendedOrder: RECOMMENDED_CATEGORIES.has(category) ? index : null,
  }))

  const manifest: ExternalPromptLibraryIndex = {
    sources: SOURCES,
    categories,
    chunks,
    entryIndex: entries.map(toSummary),
  }

  writeJson(manifestOutputPath, manifest)
  writeFileSync(
    legacyGeneratedTsPath,
    [
      '// Deprecated: external library data now loads from public/external-library-manifest-v2.json at runtime.',
      'export const externalPromptLibraryIndex = null',
      '',
    ].join('\n'),
    'utf8',
  )

  return manifest
}

function main() {
  assert(path.resolve(root) === root, 'failed to resolve project root')

  resetDirectory(chunkRoot)

  const entries = dedupeEntries([
    ...parseFreestyleflyEntries(),
    ...parseEvolinkEntries(),
    ...parseYouMindEntries(),
  ])

  const manifest = buildArtifacts(entries)
  const sourceCounts = manifest.entryIndex.reduce<Record<string, number>>((acc, entry) => {
    acc[entry.sourceId] = (acc[entry.sourceId] ?? 0) + 1
    return acc
  }, {})
  const categoryCounts = manifest.categories.reduce<Record<string, number>>((acc, category) => {
    acc[category.id] = category.entryCount
    return acc
  }, {})

  console.log(`Generated manifest with ${manifest.entryIndex.length} entries.`)
  console.log(`Source counts: ${JSON.stringify(sourceCounts)}`)
  console.log(`Category counts: ${JSON.stringify(categoryCounts)}`)
  console.log(`Chunk count: ${manifest.chunks.length}`)
}

main()
