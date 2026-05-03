/**
 * Conflict Detector - detects contradictory or conflicting prompt elements
 */

const CONFLICT_RULES = [
  {
    id: 'resolution_conflict',
    label: '分辨率冲突',
    pairs: [
      [['低清', '低分辨率', 'lowres', 'low resolution', '模糊', 'blurry'], ['高清', '超清', '8K', 'ultra HD', 'HD', '高分辨率', 'high resolution', '锐利', 'sharp']],
      [['手机自拍', 'phone selfie', '低清手机'], ['商业摄影', 'commercial', '棚拍', 'studio', '高清锐利']]
    ],
    suggestion: '选择一个分辨率方向：要么追求低保真质感，要么追求高清细节'
  },
  {
    id: 'scene_conflict',
    label: '场景冲突',
    pairs: [
      [['普通家庭', 'ordinary home', '出租屋', '小房间'], ['豪华', 'luxury', '酒店', 'hotel', '别墅', 'villa', '高端']],
      [['浴室', 'bathroom'], ['户外', 'outdoor', '街头', 'street', '海边', 'beach']],
      [['卧室', 'bedroom'], ['地铁', 'subway', '办公', 'office', '商场', 'mall']]
    ],
    suggestion: '场景应保持一致，避免同时出现矛盾的环境描述'
  },
  {
    id: 'makeup_conflict',
    label: '妆容冲突',
    pairs: [
      [['自然妆', '淡妆', '清透', 'natural', 'clean', '裸妆'], ['浓妆', '舞台妆', 'heavy', '浓重', '烟熏', 'smoky', '夸张']],
      [['素颜', 'no makeup', '无妆'], ['精致妆', 'full makeup', '网红妆', 'idol makeup']]
    ],
    suggestion: '妆容风格应统一，自然妆和浓妆不宜混搭'
  },
  {
    id: 'composition_conflict',
    label: '构图冲突',
    pairs: [
      [['近景', '特写', 'close-up', 'close up', '半身'], ['全身', 'full body', '远景', 'long shot', '全景']],
      [['俯拍', 'top-down', '高角度'], ['仰拍', 'low angle', 'bottom-up', '低角度']],
      [['中心构图', 'center'], ['三分法', 'rule of thirds', '偏离中心', 'off-center']]
    ],
    suggestion: '构图参数应协调，避免同时出现矛盾的拍摄角度或取景范围'
  },
  {
    id: 'style_conflict',
    label: '风格冲突',
    pairs: [
      [['写实', 'realistic', '纪实', 'documentary'], ['动漫', 'anime', '卡通', 'cartoon', '插画', 'illustration']],
      [['胶片', 'film', '颗粒', 'grain', '复古'], ['数码高清', 'digital HD', '锐利', 'sharp', 'clean']],
      [['暗黑', 'dark', '哥特', 'gothic'], ['甜美', 'sweet', '可爱', 'cute', '粉色', 'pink']]
    ],
    suggestion: '风格方向应一致，写实与动漫、胶片与数码等不宜混搭'
  },
  {
    id: 'lighting_conflict',
    label: '光线冲突',
    pairs: [
      [['柔光', 'soft light', '漫射', 'diffused'], ['硬光', 'hard light', '直闪', 'direct flash', '强烈']],
      [['自然光', 'natural light'], ['人工灯', 'artificial', '荧光灯', 'fluorescent', '霓虹', 'neon']],
      [['逆光', 'backlight', '背光'], ['正面光', 'front light', '直闪', 'direct flash']]
    ],
    suggestion: '光线方向和质感应统一，柔光与硬光、自然光与人工光不宜同时出现'
  },
  {
    id: 'mood_conflict',
    label: '氛围冲突',
    pairs: [
      [['慵懒', 'lazy', '放松', 'relaxed', '安静', 'quiet'], ['活力', 'energetic', '动感', 'dynamic', '兴奋', 'excited']],
      [['私密', 'intimate', '亲密'], ['公开', 'public', '社交', 'social', '人群', 'crowd']],
      [['深夜', 'late night', '夜晚'], ['清晨', 'morning', '午后', 'afternoon', '日出', 'sunrise']]
    ],
    suggestion: '氛围情绪应协调，避免同时出现矛盾的情绪基调'
  },
  {
    id: 'camera_conflict',
    label: '设备冲突',
    pairs: [
      [['手机', 'phone', 'iPhone', 'Android'], ['单反', 'DSLR', '微单', 'mirrorless', '中画幅', 'medium format']],
      [['CCD', '老式数码', 'old digicam', '低分辨率'], ['8K', '超清', 'ultra HD', '商业级', 'commercial grade']]
    ],
    suggestion: '拍摄设备应统一，手机与专业相机、CCD与8K不宜混搭'
  }
]

export function detectConflicts(director) {
  if (!director) return []

  const allText = [
    director.subject, director.scene, director.composition, director.expression,
    director.face, director.hair, director.body, director.clothing,
    director.lighting, director.camera, director.background, director.atmosphere,
    director.caption, director.mustKeep, director.avoid
  ].filter(Boolean).join(' ').toLowerCase()

  const conflicts = []

  for (const rule of CONFLICT_RULES) {
    for (const [groupA, groupB] of rule.pairs) {
      const hitA = groupA.some(kw => allText.includes(kw.toLowerCase()))
      const hitB = groupB.some(kw => allText.includes(kw.toLowerCase()))

      if (hitA && hitB) {
        const foundA = groupA.find(kw => allText.includes(kw.toLowerCase())) || ''
        const foundB = groupB.find(kw => allText.includes(kw.toLowerCase())) || ''
        conflicts.push({
          id: rule.id,
          label: rule.label,
          found: [foundA, foundB],
          suggestion: rule.suggestion
        })
        break // One conflict per rule is enough
      }
    }
  }

  return conflicts
}
