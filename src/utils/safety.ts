import type { DirectorData } from './storage'

interface SafetyRule {
  id: string; level: string; keywords?: string[]; patterns?: RegExp[];
  ambiguous?: string[]; intimate?: string[];
  reason: string; suggestion: string
  matchFn(text: string): boolean
}

const SAFETY_RULES: SafetyRule[] = [
  { id: 'ageAmbiguous', level: 'Caution', reason: '年龄模糊词与亲密/性感场景组合可能引起歧义', suggestion: '建议明确标注年龄为成年人（如"二十出头"、"25岁"）', matchFn(text) { const l = text.toLowerCase(); const amb = ['年轻', 'youth', '少女', 'young girl', '小女孩', 'little girl', '萝莉', 'lolita', 'loli']; const int = ['性感', 'sexy', '比基尼', 'bikini', '浴室', 'bathroom', '卧室', 'bedroom', '内衣', 'underwear', '内衣裤', 'lingerie', '诱惑', 'seductive', '魅惑', 'alluring']; return amb.some(k => l.includes(k)) && int.some(k => l.includes(k)) } },
  { id: 'minorRisk', level: 'Risky', reason: '包含未成年人相关关键词', suggestion: '请确保内容不涉及未成年人。如为主体描述，请明确标注为成年人。', matchFn(text) { const l = text.toLowerCase(); const kw = ['未成年', 'minor', 'underage', '儿童', 'child', 'kid', '小孩', '少年', 'teen', 'teenager', '学生', 'student', '校服', 'schoolgirl', 'schoolboy', '小学生', '初中生', '高中生', '12岁', '13岁', '14岁', '15岁', '16岁', '17岁']; return kw.some(k => l.includes(k)) } },
  { id: 'publicFigureRisk', level: 'Caution', reason: '包含真实人物/公众人物相关关键词', suggestion: '建议使用虚构人物描述', matchFn(text) { const l = text.toLowerCase(); const kw = ['真人', 'real person', '名人', 'celebrity', '明星', 'star', '政客', 'politician', '公众人物', 'public figure', '总统', 'president', '总理', 'prime minister', '主席', 'chairman']; return kw.some(k => l.includes(k)) } },
  { id: 'copyrightRisk', level: 'Caution', reason: '包含商标/版权角色或品牌名称', suggestion: '建议使用原创描述', matchFn(text) { const l = text.toLowerCase(); const kw = ['米奇', 'mickey mouse', '迪士尼', 'disney', '漫威', 'marvel', '蜘蛛侠', 'spider-man', '蝙蝠侠', 'batman', '超人', 'superman', 'nike', '耐克', '阿迪', 'adidas', 'lv', 'gucci', '香奈儿', 'chanel', '苹果', 'apple logo', '皮卡丘', 'pikachu', 'hello kitty', '龙珠', 'dragon ball', '火影', 'naruto', '海贼王', 'one piece']; return kw.some(k => l.includes(k)) } },
  { id: 'voyeurismRisk', level: 'Risky', reason: '包含偷拍/窥视/非自愿相关关键词', suggestion: '此类内容不被允许。请移除相关描述。', matchFn(text) { const l = text.toLowerCase(); const kw = ['偷拍', 'hidden camera', '裙底', 'upskirt', '窥视', 'voyeur', '非自愿', 'non-consensual', '迷晕', 'drugged', '绑架', 'kidnapped', '胁迫', 'forced', 'spy cam']; return kw.some(k => l.includes(k)) } },
  { id: 'overSexualization', level: 'Risky', reason: '包含过度性化/色情相关关键词', suggestion: '建议使用更含蓄的描述', matchFn(text) { const l = text.toLowerCase(); const kw = ['裸体', 'nude', '裸露', 'topless', '色情', 'sexual', 'nsfw', '性行为', 'sex act', '色情片', 'porn', '成人内容', 'explicit', '裸照', 'naked']; return kw.some(k => l.includes(k)) } },
  { id: 'textGenerationRisk', level: 'Caution', reason: '提示词中包含文字/水印/标志相关描述，可能影响生成质量', suggestion: '建议在 Avoid 中加入 "no text, no watermark, no signature, no logo"', matchFn(text) { const l = text.toLowerCase(); const kw = ['文字', 'text', '水印', 'watermark', '签名', 'signature', '标签', 'label', 'logo', '标志', '商标文字', 'brand text', '品牌名', 'brand name']; return kw.some(k => l.includes(k)) } },
  { id: 'medicalLegalRisk', level: 'Caution', reason: '包含医疗/法律/证件相关关键词', suggestion: '建议避免生成可能被误认为真实医疗或法律文件的内容', matchFn(text) { const l = text.toLowerCase(); const kw = ['医疗', 'medical', '法律', 'legal', '证书', 'certificate', '证件', 'id', '身份证', 'passport', '护照', '处方', 'prescription', '诊断', 'diagnosis', '律师函', 'lawsuit']; return kw.some(k => l.includes(k)) } },
  { id: 'privacyRisk', level: 'Caution', reason: '包含可能的个人隐私信息模式（电话、邮箱、身份证号等）', suggestion: '建议移除所有个人信息，使用虚构数据', matchFn(text) { const p = [/\b\d{3}[-.]?\d{4}[-.]?\d{4}\b/, /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, /\b\d{3}-\d{2}-\d{4}\b/, /\b\d{6}(19|20)\d{8}\b/]; return p.some(r => r.test(text)) } },
]

export function detectSafety(director: DirectorData) {
  if (!director) return { level: 'Safe', hits: [], quickFixes: [] }
  const allText = [director.subject, director.scene, director.composition, director.expression, director.face, director.hair, director.body, director.clothing, director.lighting, director.camera, director.depthOfField, director.background, director.atmosphere, director.caption, director.mustKeep, director.avoid, director.model, director.ratio].filter(Boolean).join(' ')
  const hits: any[] = []
  for (const rule of SAFETY_RULES) {
    if (rule.matchFn(allText)) {
      hits.push({ type: rule.id, level: rule.level, reason: rule.reason, suggestion: rule.suggestion })
    }
  }
  const quickFixes: any[] = []
  const hasAgeIssue = hits.some(h => h.type === 'ageAmbiguous')
  const hasMinor = hits.some(h => h.type === 'minorRisk')
  const hasSexual = hits.some(h => h.type === 'overSexualization')
  const hasFigure = hits.some(h => h.type === 'publicFigureRisk')
  const hasText = hits.some(h => h.type === 'textGenerationRisk')
  const hasCopyright = hits.some(h => h.type === 'copyrightRisk')
  if (hasAgeIssue || hasSexual) { quickFixes.push({ label: '加入 clearly adult, 20+', action: 'append_mustKeep_adult' }, { label: '加入 non-explicit', action: 'append_mustKeep_nonexplicit' }, { label: '加入 respectful portrait style', action: 'append_mustKeep_respectful' }) }
  if (hasText) quickFixes.push({ label: '加入 no text, no watermark', action: 'append_avoid_notext' })
  if (hasFigure || hasCopyright) quickFixes.push({ label: '加入 fictional character', action: 'append_mustKeep_fictional' })
  if (hasMinor) quickFixes.push({ label: '移除未成年人相关词', action: 'remove_minor_keywords' })
  const level = hits.some(h => h.level === 'Risky') ? 'Risky' : hits.some(h => h.level === 'Caution') ? 'Caution' : 'Safe'
  return { level, hits, quickFixes }
}

export function applySafetyFix(director: DirectorData, fixIndex: number) {
  const result = detectSafety(director)
  const fix = result.quickFixes[fixIndex]
  if (!fix) return { ...director }
  const nd = { ...director }

  function appendUnique(existing: string, addition: string) {
    const base = (existing || '').trim()
    if (base.toLowerCase().includes(addition.toLowerCase())) return base
    return base ? `${base}, ${addition}` : addition
  }

  switch (fix.action) {
    case 'append_mustKeep_adult': nd.mustKeep = appendUnique(nd.mustKeep, 'clearly adult, 20+'); break
    case 'append_mustKeep_nonexplicit': nd.mustKeep = appendUnique(nd.mustKeep, 'non-explicit, not overly sexualized'); break
    case 'append_mustKeep_respectful': nd.mustKeep = appendUnique(nd.mustKeep, 'respectful portrait style'); break
    case 'append_avoid_notext': nd.avoid = appendUnique(nd.avoid, 'no text, no watermark, no signature, no logo'); break
    case 'append_mustKeep_fictional': nd.mustKeep = appendUnique(nd.mustKeep, 'fictional character, not a real person'); break
    case 'remove_minor_keywords': {
      const minorWords = ['未成年', 'minor', 'underage', '儿童', 'child', 'kid', '小孩', '少年', 'teen', 'teenager', '学生', 'student', '校服', 'schoolgirl', 'schoolboy', '小学生', '初中生', '高中生']
      const flds: (keyof DirectorData)[] = ['subject', 'scene', 'composition', 'expression', 'face', 'makeup', 'hair', 'body', 'action', 'clothing', 'accessories', 'lighting', 'camera', 'depthOfField', 'background', 'atmosphere', 'caption', 'mustKeep', 'avoid', 'negative']
      for (const f of flds) {
        if (nd[f]) { for (const w of minorWords) nd[f] = nd[f].replace(new RegExp(w, 'gi'), ''); nd[f] = nd[f].replace(/\s{2,}/g, ' ').trim() }
      }
      break
    }
  }
  return nd
}

export { SAFETY_RULES }
