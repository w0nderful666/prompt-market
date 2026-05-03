/**
 * Safety hints engine - local rules only, no API calls
 */

const SAFETY_RULES = [
  {
    id: 'ageAmbiguous',
    level: 'Caution',
    keywords: {
      ambiguous: ['年轻', 'youth', '少女', 'young girl', '小女孩', 'little girl', '萝莉', 'lolita', 'loli'],
      intimate: ['性感', 'sexy', '比基尼', 'bikini', '浴室', 'bathroom', '卧室', 'bedroom', '内衣', 'underwear', '内衣裤', 'lingerie', '诱惑', 'seductive', '魅惑', 'alluring']
    },
    reason: '年龄模糊词与亲密/性感场景组合可能引起歧义',
    suggestion: '建议明确标注年龄为成年人（如"二十出头"、"25岁"），或在 Must Keep 中加入 "clearly adult, 20+"',
    matchFn(text) {
      const lower = text.toLowerCase()
      const hasAmbiguous = this.keywords.ambiguous.some(k => lower.includes(k.toLowerCase()))
      const hasIntimate = this.keywords.intimate.some(k => lower.includes(k.toLowerCase()))
      return hasAmbiguous && hasIntimate
    }
  },
  {
    id: 'minorRisk',
    level: 'Risky',
    keywords: ['未成年', 'minor', 'underage', '儿童', 'child', 'kid', '小孩', '少年', 'teen', 'teenager', '学生', 'student', '校服', 'schoolgirl', 'schoolboy', '小学生', '初中生', '高中生', '12岁', '13岁', '14岁', '15岁', '16岁', '17岁'],
    reason: '包含未成年人相关关键词',
    suggestion: '请确保内容不涉及未成年人。如为主体描述，请明确标注为成年人。',
    matchFn(text) {
      const lower = text.toLowerCase()
      return this.keywords.some(k => lower.includes(k.toLowerCase()))
    }
  },
  {
    id: 'publicFigureRisk',
    level: 'Caution',
    keywords: ['真人', 'real person', '名人', 'celebrity', '明星', 'star', '政客', 'politician', '公众人物', 'public figure', '总统', 'president', '总理', 'prime minister', '主席', 'chairman'],
    reason: '包含真实人物/公众人物相关关键词',
    suggestion: '建议使用虚构人物描述，或在 Must Keep 中加入 "fictional character, not a real person"',
    matchFn(text) {
      const lower = text.toLowerCase()
      return this.keywords.some(k => lower.includes(k.toLowerCase()))
    }
  },
  {
    id: 'copyrightRisk',
    level: 'Caution',
    keywords: ['米奇', 'Mickey Mouse', '迪士尼', 'Disney', '漫威', 'Marvel', '蜘蛛侠', 'Spider-Man', '蝙蝠侠', 'Batman', '超人', 'Superman', 'Nike', '耐克', '阿迪', 'Adidas', 'LV', 'Gucci', '香奈儿', 'Chanel', '苹果', 'Apple logo', '皮卡丘', 'Pikachu', 'Hello Kitty', '龙珠', 'Dragon Ball', '火影', 'Naruto', '海贼王', 'One Piece'],
    reason: '包含商标/版权角色或品牌名称',
    suggestion: '建议使用原创描述，或在 Must Keep 中加入 "original design, not trademarked"',
    matchFn(text) {
      const lower = text.toLowerCase()
      return this.keywords.some(k => lower.includes(k.toLowerCase()))
    }
  },
  {
    id: 'voyeurismRisk',
    level: 'Risky',
    keywords: ['偷拍', 'hidden camera', '裙底', 'upskirt', '窥视', 'voyeur', '非自愿', 'non-consensual', '迷晕', 'drugged', '绑架', 'kidnapped', '胁迫', 'forced', 'hidden camera', 'spy cam'],
    reason: '包含偷拍/窥视/非自愿相关关键词',
    suggestion: '此类内容不被允许。请移除相关描述。',
    matchFn(text) {
      const lower = text.toLowerCase()
      return this.keywords.some(k => lower.includes(k.toLowerCase()))
    }
  },
  {
    id: 'overSexualization',
    level: 'Risky',
    keywords: ['裸体', 'nude', '裸露', 'topless', '色情', 'sexual', 'nsfw', '性行为', 'sex act', '色情片', 'porn', '成人内容', 'explicit', '裸照', 'naked'],
    reason: '包含过度性化/色情相关关键词',
    suggestion: '建议使用更含蓄的描述，或在 Must Keep 中加入 "non-explicit, not overly sexualized"',
    matchFn(text) {
      const lower = text.toLowerCase()
      return this.keywords.some(k => lower.includes(k.toLowerCase()))
    }
  },
  {
    id: 'textGenerationRisk',
    level: 'Caution',
    keywords: ['文字', 'text', '水印', 'watermark', '签名', 'signature', '标签', 'label', 'logo', '标志', '商标文字', 'brand text', '品牌名', 'brand name'],
    reason: '提示词中包含文字/水印/标志相关描述，可能影响生成质量',
    suggestion: '建议在 Avoid 中加入 "no text, no watermark, no signature, no logo"',
    matchFn(text) {
      const lower = text.toLowerCase()
      return this.keywords.some(k => lower.includes(k.toLowerCase()))
    }
  },
  {
    id: 'medicalLegalRisk',
    level: 'Caution',
    keywords: ['医疗', 'medical', '法律', 'legal', '证书', 'certificate', '证件', 'ID', '身份证', 'passport', '护照', '处方', 'prescription', '诊断', 'diagnosis', '律师函', 'lawsuit'],
    reason: '包含医疗/法律/证件相关关键词',
    suggestion: '建议避免生成可能被误认为真实医疗或法律文件的内容',
    matchFn(text) {
      const lower = text.toLowerCase()
      return this.keywords.some(k => lower.includes(k.toLowerCase()))
    }
  },
  {
    id: 'privacyRisk',
    level: 'Caution',
    keywords: [],
    patterns: [
      /\b\d{3}[-.]?\d{4}[-.]?\d{4}\b/,  // phone
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,  // email
      /\b\d{3}-\d{2}-\d{4}\b/,  // SSN
      /\b\d{6}(19|20)\d{8}\b/  // Chinese ID
    ],
    reason: '包含可能的个人隐私信息模式（电话、邮箱、身份证号等）',
    suggestion: '建议移除所有个人信息，使用虚构数据',
    matchFn(text) {
      return this.patterns.some(p => p.test(text))
    }
  }
]

/**
 * Detect safety issues in director content
 */
export function detectSafety(director) {
  if (!director) return { level: 'Safe', hits: [], quickFixes: [] }

  const allText = [
    director.subject, director.scene, director.composition, director.expression,
    director.face, director.hair, director.body, director.clothing,
    director.lighting, director.camera, director.depthOfField,
    director.background, director.atmosphere, director.caption,
    director.mustKeep, director.avoid, director.model, director.ratio
  ].filter(Boolean).join(' ')

  const hits = []

  for (const rule of SAFETY_RULES) {
    const matched = rule.matchFn(allText)
    if (matched) {
      let foundKeywords = []
      if (rule.patterns) {
        for (const p of rule.patterns) {
          const m = allText.match(p)
          if (m) foundKeywords.push(...m)
        }
      } else if (rule.keywords.ambiguous) {
        // ageAmbiguous special case
        const lower = allText.toLowerCase()
        foundKeywords = [
          ...rule.keywords.ambiguous.filter(k => lower.includes(k.toLowerCase())),
          ...rule.keywords.intimate.filter(k => lower.includes(k.toLowerCase()))
        ]
      } else {
        const lower = allText.toLowerCase()
        foundKeywords = rule.keywords.filter(k => lower.includes(k.toLowerCase()))
      }

      hits.push({
        type: rule.id,
        level: rule.level,
        keywords: foundKeywords.slice(0, 5),
        reason: rule.reason,
        suggestion: rule.suggestion
      })
    }
  }

  // Build quick fixes based on what was found
  const quickFixes = []
  const hasAgeIssue = hits.some(h => h.type === 'ageAmbiguous')
  const hasMinor = hits.some(h => h.type === 'minorRisk')
  const hasSexual = hits.some(h => h.type === 'overSexualization')
  const hasFigure = hits.some(h => h.type === 'publicFigureRisk')
  const hasText = hits.some(h => h.type === 'textGenerationRisk')
  const hasCopyright = hits.some(h => h.type === 'copyrightRisk')

  if (hasAgeIssue || hasSexual) {
    quickFixes.push({ label: '加入 clearly adult, 20+', action: 'append_mustKeep_adult' })
    quickFixes.push({ label: '加入 non-explicit, not overly sexualized', action: 'append_mustKeep_nonexplicit' })
    quickFixes.push({ label: '加入 respectful portrait style', action: 'append_mustKeep_respectful' })
  }
  if (hasText) {
    quickFixes.push({ label: '加入 no text, no watermark', action: 'append_avoid_notext' })
  }
  if (hasFigure || hasCopyright) {
    quickFixes.push({ label: '加入 fictional character, not a real person', action: 'append_mustKeep_fictional' })
  }
  if (hasMinor) {
    quickFixes.push({ label: '移除未成年人相关词', action: 'remove_minor_keywords' })
  }

  const level = hits.some(h => h.level === 'Risky') ? 'Risky'
    : hits.some(h => h.level === 'Caution') ? 'Caution'
    : 'Safe'

  return { level, hits, quickFixes }
}

/**
 * Apply a safety quick fix to director
 */
export function applySafetyFix(director, fixIndex) {
  const result = detectSafety(director)
  const fix = result.quickFixes[fixIndex]
  if (!fix) return { ...director }

  const newDirector = { ...director }

  switch (fix.action) {
    case 'append_mustKeep_adult':
      newDirector.mustKeep = appendUnique(newDirector.mustKeep, 'clearly adult, 20+')
      break
    case 'append_mustKeep_nonexplicit':
      newDirector.mustKeep = appendUnique(newDirector.mustKeep, 'non-explicit, not overly sexualized')
      break
    case 'append_mustKeep_respectful':
      newDirector.mustKeep = appendUnique(newDirector.mustKeep, 'respectful portrait style')
      break
    case 'append_avoid_notext':
      newDirector.avoid = appendUnique(newDirector.avoid, 'no text, no watermark, no signature, no logo')
      break
    case 'append_mustKeep_fictional':
      newDirector.mustKeep = appendUnique(newDirector.mustKeep, 'fictional character, not a real person')
      break
    case 'remove_minor_keywords': {
      const minorWords = ['未成年', 'minor', 'underage', '儿童', 'child', 'kid', '小孩',
        '少年', 'teen', 'teenager', '学生', 'student', '校服', 'schoolgirl', 'schoolboy',
        '小学生', '初中生', '高中生']
      const textFields = ['subject', 'scene', 'composition', 'expression', 'face', 'hair',
        'body', 'clothing', 'lighting', 'camera', 'depthOfField', 'background',
        'atmosphere', 'caption', 'mustKeep', 'avoid']
      for (const field of textFields) {
        if (newDirector[field]) {
          let text = newDirector[field]
          for (const word of minorWords) {
            text = text.replace(new RegExp(word, 'gi'), '')
          }
          newDirector[field] = text.replace(/\s{2,}/g, ' ').trim()
        }
      }
      break
    }
  }

  return newDirector
}

function appendUnique(existing, addition) {
  const base = (existing || '').trim()
  if (base.toLowerCase().includes(addition.toLowerCase())) return base
  return base ? `${base}, ${addition}` : addition
}

export { SAFETY_RULES }
