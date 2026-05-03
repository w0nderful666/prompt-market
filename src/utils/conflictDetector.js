/**
 * Conflict Detector - detects contradictory or conflicting prompt elements
 * 19+ conflict rules across 6 categories
 */

const CONFLICT_RULES = [
  // Quality conflicts (3)
  {
    id: 'quality_lowres_vs_ultra_sharp',
    category: 'quality',
    label: '低分辨率 vs 超清商业',
    pairs: [
      [['低清', '低分辨率', 'lowres', 'low resolution', '模糊', 'blurry', '手机自拍', 'phone selfie', '低清手机', 'CCD', 'ccd'],
       ['超清', '8K', 'ultra HD', 'HD', '高分辨率', 'high resolution', '锐利', 'sharp', '商业摄影', 'commercial', '棚拍', 'studio', '高清锐利']]
    ],
    reason: '低分辨率质感与超清商业画质方向相反，同时出现会导致模型困惑',
    riskLevel: 'medium',
    suggestion: '选择一个分辨率方向：要么追求低保真质感（CCD/手机自拍），要么追求高清商业细节（8K/棚拍）'
  },
  {
    id: 'quality_blurry_vs_ultra_sharp',
    category: 'quality',
    label: '轻微模糊 vs 超清锐利',
    pairs: [
      [['轻微模糊', 'slight blurry', 'soft focus', '柔焦', '跑焦', 'out of focus'],
       ['超清', 'ultra sharp', '8K', '高清', '锐利', 'sharp', 'crisp']]
    ],
    reason: '模糊与锐利是相反的画质方向',
    riskLevel: 'medium',
    suggestion: '选择一个画质方向：柔焦/跑焦适合情绪氛围，超清锐利适合商业展示'
  },
  {
    id: 'quality_ccd_vs_studio',
    category: 'quality',
    label: 'CCD 快照 vs 棚拍商业',
    pairs: [
      [['CCD', 'ccd', '老式数码', 'old digicam', '低分辨率', '数字噪点'],
       ['商业摄影', 'studio', '棚拍', 'commercial grade', '高清', '专业灯光', 'professional lighting']]
    ],
    reason: 'CCD 低保真质感与棚拍商业质感风格冲突',
    riskLevel: 'medium',
    suggestion: 'CCD 快照强调随性和噪点感，棚拍强调精致和控制感，两者不宜混搭'
  },

  // Scene conflicts (3)
  {
    id: 'scene_home_vs_luxury',
    category: 'scene',
    label: '家庭浴室 vs 豪华酒店浴室',
    pairs: [
      [['普通家庭', 'ordinary home', '出租屋', '小房间', '家庭浴室', 'home bathroom'],
       ['豪华', 'luxury', '酒店', 'hotel', '别墅', 'villa', '高端', '五星级', '5-star']]
    ],
    reason: '家庭环境与豪华酒店环境的质感完全不同',
    riskLevel: 'low',
    suggestion: '选择一个场景定位：家庭日常感 vs 豪华高端感'
  },
  {
    id: 'scene_night_vs_morning',
    category: 'scene',
    label: '夜晚街头 vs 清晨阳光',
    pairs: [
      [['夜晚', 'night', '深夜', 'late night', '午夜', 'midnight', '凌晨'],
       ['清晨', 'morning', '阳光', 'sunlight', '日出', 'sunrise', '午后', 'afternoon', '日光', 'daylight']]
    ],
    reason: '夜晚与白天/清晨的光线和氛围完全不同',
    riskLevel: 'medium',
    suggestion: '统一时间设定：深夜场景配合暗色调和人工光源，白天场景配合自然光'
  },
  {
    id: 'scene_indoor_vs_outdoor',
    category: 'scene',
    label: '室内卧室 vs 户外街头',
    pairs: [
      [['卧室', 'bedroom', '室内', 'indoor', '客厅', 'living room', '浴室', 'bathroom'],
       ['户外', 'outdoor', '街头', 'street', '海边', 'beach', '公园', 'park', '山路', 'mountain']]
    ],
    reason: '室内与户外场景不能同时成立',
    riskLevel: 'low',
    suggestion: '选择一个主场景，室内和户外的光线、氛围差异很大'
  },

  // Composition conflicts (4)
  {
    id: 'composition_half_vs_full',
    category: 'composition',
    label: '近景半身 vs 全身照',
    pairs: [
      [['近景', 'close-up', 'close up', '半身', 'half body', '胸部以上', 'bust shot', '特写', 'headshot'],
       ['全身', 'full body', '远景', 'long shot', '全景', 'wide shot', 'full-length']]
    ],
    reason: '半身特写与全身照的取景范围完全不同',
    riskLevel: 'medium',
    suggestion: '选择一个取景范围：半身特写突出表情细节，全身照展示姿态和服装'
  },
  {
    id: 'composition_waist_vs_full',
    category: 'composition',
    label: '腰部裁切 vs 全身入镜',
    pairs: [
      [['腰部以下不可见', 'waist and legs invisible', '裁切', 'cropped', '腰部以上', 'above waist'],
       ['全身', 'full body', '全身入镜', 'legs visible', 'show full body']]
    ],
    reason: '裁切构图与全身入镜矛盾',
    riskLevel: 'medium',
    suggestion: '统一构图裁切方式'
  },
  {
    id: 'composition_closeup_vs_long',
    category: 'composition',
    label: '特写 vs 远景',
    pairs: [
      [['特写', 'closeup', 'extreme close-up', '大特写', 'macro'],
       ['远景', 'long shot', '全景', 'panorama', 'wide angle']]
    ],
    reason: '特写与远景是完全相反的取景方式',
    riskLevel: 'high',
    suggestion: '特写适合展示细节和情绪，远景适合展示环境和氛围'
  },
  {
    id: 'composition_mirror_vs_third',
    category: 'composition',
    label: '镜面自拍 vs 第三人称',
    pairs: [
      [['镜面自拍', 'mirror selfie', '对镜自拍', 'mirror shot', '镜子反射'],
       ['第三人称', 'third person', '旁观者视角', 'bystander', '偷拍视角', 'candid angle']]
    ],
    reason: '镜面自拍（第一人称）与第三人称拍摄视角冲突',
    riskLevel: 'low',
    suggestion: '镜面自拍是第一人称视角，与第三人称拍摄视角不同'
  },

  // Style conflicts (3)
  {
    id: 'style_realistic_vs_cartoon',
    category: 'style',
    label: '写实照片 vs 卡通插画',
    pairs: [
      [['写实', 'realistic', '纪实', 'documentary', '真实', 'photo', '照片'],
       ['动漫', 'anime', '卡通', 'cartoon', '插画', 'illustration', '二次元', '2D']]
    ],
    reason: '写实风格与卡通/动漫风格是完全不同的视觉方向',
    riskLevel: 'high',
    suggestion: '写实照片追求真实质感，卡通插画追求艺术风格化，两者不宜混搭'
  },
  {
    id: 'style_casual_vs_commercial',
    category: 'style',
    label: '随手拍 vs 商业广告',
    pairs: [
      [['随手拍', 'casual snap', '手机拍', 'phone shot', '日常', 'daily', '朋友圈', '社交媒体'],
       ['商业广告', 'commercial ad', '广告大片', 'campaign', '品牌宣传', 'brand shoot']]
    ],
    reason: '随手拍的随意感与商业广告的专业感冲突',
    riskLevel: 'medium',
    suggestion: '随手拍追求自然随意，商业广告追求精致控制'
  },
  {
    id: 'style_film_vs_futuristic',
    category: 'style',
    label: '胶片质感 vs 未来科技感',
    pairs: [
      [['胶片', 'film', '颗粒', 'grain', '复古', 'vintage', '怀旧'],
       ['未来', 'futuristic', '赛博', 'cyber', '科技', 'tech', '全息', 'hologram', 'UI界面']]
    ],
    reason: '胶片复古感与未来科技感的视觉语言冲突',
    riskLevel: 'medium',
    suggestion: '胶片风格强调颗粒和暖色调，未来科技感强调冷色调和数字质感'
  },

  // Mood conflicts (3)
  {
    id: 'mood_lazy_vs_energetic',
    category: 'mood',
    label: '慵懒放松 vs 活力动感',
    pairs: [
      [['慵懒', 'lazy', '放松', 'relaxed', '安静', 'quiet', '沉思', 'contemplative', '迷离', 'dreamy'],
       ['活力', 'energetic', '动感', 'dynamic', '兴奋', 'excited', '大笑', 'laughing', '跳跃', 'jumping']]
    ],
    reason: '慵懒安静与活力动感的情绪基调冲突',
    riskLevel: 'low',
    suggestion: '选择一个情绪方向：慵懒适合安静氛围，活力适合动态场景'
  },
  {
    id: 'mood_intimate_vs_commercial',
    category: 'mood',
    label: '私密随手拍 vs 商业广告',
    pairs: [
      [['私密', 'intimate', '亲密', '随手拍', '朋友圈', '自拍'],
       ['商业广告', 'commercial', '广告', 'campaign', '品牌', 'brand', '专业棚拍']]
    ],
    reason: '私密感与商业感的情绪定位冲突',
    riskLevel: 'medium',
    suggestion: '私密风格强调个人化和真实感，商业风格强调专业和品牌感'
  },
  {
    id: 'mood_quiet_vs_high_energy',
    category: 'mood',
    label: '安静氛围 vs 高能动作',
    pairs: [
      [['安静', 'quiet', '宁静', 'serene', '平和', 'peaceful', '沉静', 'calm'],
       ['高能', 'high energy', '动作', 'action', '激烈', 'intense', '爆炸', 'explosion', '追逐', 'chase']]
    ],
    reason: '安静氛围与高能动作场景冲突',
    riskLevel: 'low',
    suggestion: '安静场景适合沉思和氛围感，高能场景适合动态和冲击力'
  },

  // Subject conflicts (3)
  {
    id: 'subject_single_vs_group',
    category: 'subject',
    label: '单人肖像 vs 合影',
    pairs: [
      [['单人', 'single', '一个人', 'solo', '独处', 'alone', '肖像', 'portrait'],
       ['合影', 'group', '多人', 'multiple people', '双人', 'couple', '朋友', 'friends', '团队', 'team']]
    ],
    reason: '单人肖像与多人合影的主体数量冲突',
    riskLevel: 'medium',
    suggestion: '明确主体数量，单人肖像突出个体，合影需要考虑人物关系和构图'
  },
  {
    id: 'subject_no_jewelry_vs_heavy',
    category: 'subject',
    label: '无首饰 vs 重型首饰',
    pairs: [
      [['无首饰', 'no jewelry', '素净', 'minimal accessories', '不戴饰品'],
       ['重型首饰', 'heavy jewelry', '大量饰品', 'bling', '金链', 'gold chain', '钻石', 'diamond']]
    ],
    reason: '无首饰与重型首饰的风格冲突',
    riskLevel: 'low',
    suggestion: '首饰风格应与整体造型协调'
  },
  {
    id: 'subject_no_text_vs_title',
    category: 'subject',
    label: '无文字 vs 大标题文字',
    pairs: [
      [['无文字', 'no text', '不要文字', 'clean', '无水印', 'no watermark'],
       ['大标题', 'big title', '标题文字', 'title text', '文字叠加', 'text overlay', '字幕', 'subtitle']]
    ],
    reason: '无文字要求与大标题文字需求冲突',
    riskLevel: 'low',
    suggestion: '如果需要文字叠加，应移除"无文字"的限制'
  },

  // Makeup conflicts (preserved from original)
  {
    id: 'makeup_conflict',
    category: 'style',
    label: '妆容冲突',
    pairs: [
      [['自然妆', '淡妆', '清透', 'natural', 'clean', '裸妆'],
       ['浓妆', '舞台妆', 'heavy', '浓重', '烟熏', 'smoky', '夸张']],
      [['素颜', 'no makeup', '无妆'],
       ['精致妆', 'full makeup', '网红妆', 'idol makeup']]
    ],
    reason: '自然妆与浓妆风格方向相反',
    riskLevel: 'low',
    suggestion: '妆容风格应统一，自然妆和浓妆不宜混搭'
  },

  // Lighting conflicts (preserved from original)
  {
    id: 'lighting_conflict',
    category: 'lighting',
    label: '光线冲突',
    pairs: [
      [['柔光', 'soft light', '漫射', 'diffused'],
       ['硬光', 'hard light', '直闪', 'direct flash', '强烈']],
      [['自然光', 'natural light'],
       ['人工灯', 'artificial', '荧光灯', 'fluorescent', '霓虹', 'neon']],
      [['逆光', 'backlight', '背光'],
       ['正面光', 'front light', '直闪', 'direct flash']]
    ],
    reason: '光线方向和质感应统一',
    riskLevel: 'low',
    suggestion: '柔光与硬光、自然光与人工光不宜同时出现'
  },

  // Device conflicts (preserved from original)
  {
    id: 'device_conflict',
    category: 'quality',
    label: '设备冲突',
    pairs: [
      [['手机', 'phone', 'iPhone', 'Android'],
       ['单反', 'DSLR', '微单', 'mirrorless', '中画幅', 'medium format']],
      [['CCD', '老式数码', 'old digicam'],
       ['8K', '超清', 'ultra HD', '商业级', 'commercial grade']]
    ],
    reason: '拍摄设备应统一',
    riskLevel: 'low',
    suggestion: '手机与专业相机、CCD与8K的画质特征差异很大'
  }
]

/**
 * Detect conflicts in director content
 */
export function detectConflicts(director) {
  if (!director) return []

  const allText = [
    director.subject, director.scene, director.composition, director.expression,
    director.face, director.hair, director.body, director.clothing,
    director.lighting, director.camera, director.depthOfField,
    director.background, director.atmosphere, director.caption,
    director.mustKeep, director.avoid
  ].filter(Boolean).join(' ').toLowerCase()

  const conflicts = []

  for (const rule of CONFLICT_RULES) {
    for (const pair of rule.pairs) {
      const groupA = pair[0]
      const groupB = pair[1]
      if (!groupA || !groupB) continue

      const hitA = groupA.some(kw => allText.includes(kw.toLowerCase()))
      const hitB = groupB.some(kw => allText.includes(kw.toLowerCase()))

      if (hitA && hitB) {
        const foundA = groupA.find(kw => allText.includes(kw.toLowerCase())) || ''
        const foundB = groupB.find(kw => allText.includes(kw.toLowerCase())) || ''
        conflicts.push({
          id: rule.id,
          category: rule.category,
          label: rule.label,
          foundA,
          foundB,
          found: [foundA, foundB],
          reason: rule.reason,
          riskLevel: rule.riskLevel || 'low',
          suggestion: rule.suggestion
        })
        break
      }
    }
  }

  return conflicts
}

/**
 * Remove a specific word from all module text fields
 */
export function removeConflictWord(director, word) {
  if (!director || !word) return { ...director }
  const newDirector = { ...director }
  const textFields = ['subject', 'scene', 'composition', 'expression', 'face', 'hair',
    'body', 'clothing', 'lighting', 'camera', 'depthOfField', 'background',
    'atmosphere', 'caption', 'mustKeep', 'avoid']

  for (const field of textFields) {
    if (newDirector[field]) {
      const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      newDirector[field] = newDirector[field]
        .replace(new RegExp(`,\\s*${escaped}`, 'gi'), '')
        .replace(new RegExp(`${escaped}\\s*,`, 'gi'), '')
        .replace(new RegExp(escaped, 'gi'), '')
        .replace(/\s{2,}/g, ' ')
        .replace(/^,\s*/, '')
        .replace(/,\s*$/, '')
        .trim()
    }
  }

  return newDirector
}

export { CONFLICT_RULES }
