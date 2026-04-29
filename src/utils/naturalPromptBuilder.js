import { buildPromptText } from './promptBuilder.js'

const TAB_ALIASES = {
  subject: ['subject'],
  clothing: ['clothing'],
  accessories: ['accessories'],
  makeup: ['makeup', 'makeup_hair'],
  scene: ['scene'],
  atmosphere: ['atmosphere'],
  style: ['style'],
  composition: ['composition'],
  lighting: ['lighting'],
  camera: ['camera'],
  quality: ['quality'],
  negative: ['negative']
}

const SECTION_TITLES = {
  subject: '主体',
  clothing: '服装',
  accessories: '配饰',
  makeup: '妆发',
  scene: '场景',
  atmosphere: '氛围',
  action: '人像状态',
  style: '风格',
  composition: '构图',
  lighting: '光影',
  camera: '镜头',
  quality: '质感',
  supplement: '补充关键词',
  negative: '负面词'
}

const CONFLICT_RULES = [
  {
    when: ['realistic', 'film', 'street_photo', 'old_digicam_snapshot', 'documentary_photo', 'real_life_documentary'],
    remove: ['anime_illust', 'illustration_style', 'watercolor', 'oil_painting', 'pixel_art', 'thick_paint', 'soft_watercolor_illustration', 'thick_paint_character']
  }
]

const SMART_RULES = [
  {
    match: ['老式数码相机', 'CCD', '数字噪点', '公共扶梯', '地铁站', '俯拍', 'old digital camera', 'CCD', 'digital noise', 'escalator', 'subway', 'top-down'],
    zh: ['画面可以略微倾斜，增强随手拍真实感', '背景中保留模糊行人、金属台阶和扶手线条', '保留轻微噪点、运动模糊、压缩痕迹或日期戳'],
    en: ['the frame may be slightly tilted to enhance the candid feeling', 'blurred passersby, metal steps and handrail lines remain in the background', 'slight noise, motion blur, compression artifacts or a date stamp may be retained']
  },
  {
    match: ['夜晚街头', '手机闪光灯', '街拍', '直闪', '霓虹', 'night street', 'phone flash', 'direct flash', 'neon'],
    zh: ['近距离直闪让皮肤和衣物边缘出现真实反光', '背景略微欠曝，路灯和霓虹形成模糊光斑'],
    en: ['close direct flash creates realistic highlights on skin and clothing edges', 'the background is slightly underexposed with blurred street lights and neon bokeh']
  },
  {
    match: ['胶片摄影', '35mm', '城市街景', '胶片颗粒', 'film photography', '35mm', 'city street', 'film grain'],
    zh: ['保留自然颗粒、轻微色偏和街道纵深', '环境细节不要过度干净，保持真实照片的不完美'],
    en: ['natural grain, slight color shift and street depth are preserved', 'environmental details should not look overly clean, keeping real photographic imperfections']
  },
  {
    match: ['女性', '人像', '模特', '年轻女性', 'female', 'portrait', 'model', 'young woman'],
    zh: ['人物五官保持自然协调，眼神清晰但不过度锐化', '皮肤保留真实纹理、毛孔和轻微瑕疵，避免塑料感'],
    en: ['facial features stay natural and harmonious, with clear eyes that are not oversharpened', 'skin keeps real texture, pores and slight imperfections, avoiding a plastic look']
  }
]

function unique(items) {
  return [...new Map((items || []).filter(Boolean).map((item) => [item.id || item.zh || item.en, item])).values()]
}

function textOf(item, language = 'zh') {
  return language === 'en' ? item.en || item.zh : item.zh || item.en
}

function isBadText(text) {
  return !text || /\?{2,}|�/.test(text)
}

function safeTextOf(item, language = 'zh') {
  const primary = textOf(item, language)
  if (!isBadText(primary)) return primary
  return item.en || item.zh || ''
}

function joinNatural(values, language = 'zh', limit = 10) {
  const clean = [...new Set(values.filter((value) => value && !isBadText(value)))].slice(0, limit)
  if (!clean.length) return ''
  if (language === 'en') {
    if (clean.length === 1) return clean[0]
    return `${clean.slice(0, -1).join(', ')} and ${clean.at(-1)}`
  }
  if (clean.length === 1) return clean[0]
  return `${clean.slice(0, -1).join('、')}和${clean.at(-1)}`
}

function collectByTabs(items) {
  const buckets = Object.fromEntries(Object.keys(TAB_ALIASES).map((key) => [key, []]))
  unique(items).forEach((item) => {
    const bucketKey = Object.entries(TAB_ALIASES).find(([, ids]) => ids.includes(item.tabId))?.[0]
    if (bucketKey) buckets[bucketKey].push(item)
  })
  return buckets
}

function removeConflictingItems(items) {
  const ids = new Set(items.map((item) => item.id))
  const removeIds = new Set()

  CONFLICT_RULES.forEach((rule) => {
    if (rule.when.some((id) => ids.has(id))) {
      rule.remove.forEach((id) => removeIds.add(id))
    }
  })

  return items.filter((item) => !removeIds.has(item.id))
}

function makeSection(sourceTabId, content) {
  return content ? { title: SECTION_TITLES[sourceTabId] || sourceTabId, content, sourceTabId } : null
}

function smartDetailsFor(items, language) {
  const haystack = items.map((item) => `${item.zh || ''} ${item.en || ''}`).join(' ')
  return [...new Set(SMART_RULES.flatMap((rule) => {
    const hit = rule.match.some((word) => haystack.toLowerCase().includes(String(word).toLowerCase()))
    return hit ? rule[language] || rule.zh : []
  }))]
}

function fillTemplate(template, buckets, language, options) {
  const source = template?.[language] || template?.zh || ''
  const usePlaceholders = options.usePlaceholders

  return source.replace(/\{(\w+)\}/g, (_, key) => {
    const items = buckets[key] || []
    const value = joinNatural(items.map((item) => safeTextOf(item, language)), language, 8)
    if (value) return value
    if (!usePlaceholders) return ''
    return language === 'en' ? `[fill ${key}]` : `【请填写${SECTION_TITLES[key] || key}】`
  }).replace(/\s+/g, ' ').replace(/，+/g, '，').replace(/。+/g, '。').trim()
}

function buildNaturalSections(buckets, allItems, language, enhanced, smartDetails) {
  const isEn = language === 'en'
  const sections = []
  const values = (key, limit = 10) => joinNatural(buckets[key].map((item) => safeTextOf(item, language)), language, limit)
  const subjectDetailGroups = new Set(['expression_pose', 'action_mood', 'subject_phrases'])
  const subjectCoreItems = buckets.subject.filter((item) => !subjectDetailGroups.has(item.groupId))
  const subjectDetailItems = buckets.subject.filter((item) => subjectDetailGroups.has(item.groupId))

  const style = values('style', 6)
  const subject = joinNatural(subjectCoreItems.map((item) => safeTextOf(item, language)), language, 8)
  const subjectDetails = joinNatural(subjectDetailItems.map((item) => safeTextOf(item, language)), language, 8)
  const scene = values('scene', 8)
  const atmosphere = values('atmosphere', 6)
  const clothing = values('clothing', 8)
  const accessories = values('accessories', 8)
  const makeup = values('makeup', 6)
  const composition = values('composition', 7)
  const lighting = values('lighting', 7)
  const camera = values('camera', 7)
  const quality = values('quality', 8)

  sections.push(makeSection('style', isEn
    ? `A ${style || camera || 'realistic portrait'} image designed for AI portrait generation.`
    : `这是一张${style || camera || '写实人像'}风格的 AI 人像提示词画面。`))

  sections.push(makeSection('subject', subject && (isEn
    ? `The main subject is ${subject}, with natural posture, believable facial expression and clear eye focus.`
    : `画面主体是${subject}，姿态自然，表情可信，眼神清晰。`)))

  sections.push(makeSection('action', subjectDetails && (isEn
    ? `Portrait behavior and expression details include ${subjectDetails}.`
    : `人像状态包括${subjectDetails}，动作和表情应保持自然、不僵硬。`)))

  sections.push(makeSection('clothing', clothing && (isEn
    ? `The outfit features ${clothing}${accessories ? `, paired with ${accessories}` : ''}, adding realistic portrait details.`
    : `服装呈现${clothing}${accessories ? `，搭配${accessories}` : ''}，为人像增加真实细节。`)))

  sections.push(makeSection('makeup', makeup && (isEn
    ? `Makeup and hair details lean toward ${makeup}, while keeping the face natural and not overly retouched.`
    : `妆发细节偏向${makeup}，面部保持自然，不要过度精修。`)))

  sections.push(makeSection('scene', scene && (isEn
    ? `The scene is set in ${scene}${atmosphere ? `, carrying ${atmosphere}` : ''}.`
    : `场景位于${scene}${atmosphere ? `，周围环境带有${atmosphere}` : ''}。`)))

  sections.push(makeSection('composition', composition && (isEn
    ? `The frame uses ${composition}, keeping the portrait subject easy to read and avoiding awkward cropping.`
    : `镜头采用${composition}，让人像主体清晰易读，避免尴尬裁切。`)))

  sections.push(makeSection('lighting', lighting && (isEn
    ? `Lighting comes from ${lighting}, shaping the face, hair, clothing edges and background depth.`
    : `光线来自${lighting}，在人物面部、发丝、衣物边缘和背景层次上形成细节。`)))

  sections.push(makeSection('camera', camera && (isEn
    ? `The image carries ${camera} characteristics, retaining believable photographic traces.`
    : `画面带有${camera}等镜头或成像质感，保留可信的真实成像痕迹。`)))

  sections.push(makeSection('quality', quality && (isEn
    ? `The final image should have ${quality}, with real skin texture and no plastic AI look.`
    : `整体画面具有${quality}，皮肤保留真实纹理，避免塑料感和明显 AI 味。`)))

  if (smartDetails) {
    const details = smartDetailsFor(allItems, language)
    if (details.length) {
      sections.push(makeSection('atmosphere', isEn
        ? `${details.slice(0, enhanced ? 8 : 4).join('; ')}.`
        : `${details.slice(0, enhanced ? 8 : 4).join('；')}。`))
    }
  }

  return sections.filter(Boolean)
}

function addSupplementSection(sections, positiveItems, language) {
  const body = sections.map((section) => section.content).join(' ')
  const missing = positiveItems
    .map((item) => safeTextOf(item, language))
    .filter((value) => value && !body.includes(value))

  const supplement = joinNatural(missing, language, 24)
  if (!supplement) return sections

  return [
    ...sections,
    makeSection('supplement', language === 'en'
      ? `Additional selected keywords to preserve: ${supplement}.`
      : `需要保留的已选关键词补充：${supplement}。`)
  ].filter(Boolean)
}

function composeFinalText(positiveText, negativeText, language) {
  if (!negativeText) return positiveText
  return language === 'en'
    ? `${positiveText}\n\nNegative prompt: ${negativeText}`
    : `${positiveText}\n\n负面提示词：${negativeText}`
}

function numberedSections(sections, language) {
  return sections.map((section, index) => `${index + 1}. ${section.content}`).join('\n')
}

export function buildNaturalPrompt({
  library,
  selectedItems = [],
  language = 'zh',
  mode = 'natural',
  templateId = '',
  smartDetails = true,
  usePlaceholders = false
} = {}) {
  const cleanedItems = removeConflictingItems(unique(selectedItems))
  const buckets = collectByTabs(cleanedItems)
  const positiveItems = cleanedItems.filter((item) => item.tabId !== 'negative')
  const negativeItems = buckets.negative
  const negativeText = buildPromptText(negativeItems, language === 'en' ? 'en' : 'zh')

  if (mode === 'keywords') {
    const positiveText = buildPromptText(positiveItems, language === 'en' ? 'en' : 'zh')
    return {
      positiveText: composeFinalText(positiveText, negativeText, language),
      negativeText,
      sections: []
    }
  }

  if (mode === 'template' && templateId) {
    const template = (library?.templates || []).find((item) => item.id === templateId)
    const positiveText = fillTemplate(template, buckets, language, { usePlaceholders })
    return {
      positiveText: composeFinalText(positiveText, template?.negative || negativeText, language),
      negativeText: template?.negative || negativeText,
      sections: positiveText ? [{ title: template?.name || '模板', content: positiveText, sourceTabId: 'template' }] : []
    }
  }

  const naturalSections = buildNaturalSections(buckets, positiveItems, language, mode === 'enhanced', smartDetails)
  const sections = addSupplementSection(naturalSections, positiveItems, language)
  const positiveText = numberedSections(sections, language)

  return {
    positiveText: composeFinalText(positiveText, negativeText, language),
    negativeText,
    sections
  }
}
