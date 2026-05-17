import type { DiffPack } from '../core/types'

export const DIFF_PACKS: DiffPack[] = [
  {
    id: 'real-photo-base',
    labelZh: '基础写实防 AI 感',
    description: '所有写实人像默认启用',
    triggerSlots: ['*'],
    positiveRepair: ['realistic human face', 'natural skin texture', 'real photo quality', 'believable anatomy'],
    negativePrompt: ['AI-generated look', 'uncanny valley', 'plastic skin', 'waxy skin', 'doll-like face', 'overly perfect face', 'over-smoothed skin', 'fake pores', 'artificial lighting', 'unrealistic symmetry', 'CGI render', '3D render', 'cartoon', 'anime', 'illustration', 'low quality', 'watermark', 'text', 'logo'],
  },
  {
    id: 'hand-fix',
    labelZh: '手部修复',
    description: '任何包含手部动作、手持物、手部姿势时自动启用',
    triggerSlots: ['handheld', 'product', 'hairTouch', 'handBlockCamera', 'holding-phone', 'holding-cup', 'holding-flowers', 'hand-block-camera', 'hair-touch', 'holding-drink', 'holding-food', 'holding-umbrella', 'reading-book', 'phone-selfie'],
    positiveRepair: ['natural hands', 'correct finger count', 'relaxed fingers', 'believable hand anatomy', 'hands naturally interacting with the object'],
    negativePrompt: ['extra fingers', 'missing fingers', 'fused fingers', 'webbed fingers', 'deformed hands', 'twisted fingers', 'broken fingers', 'unnatural hand pose', 'reversed palm', 'malformed thumb', 'too many knuckles', 'oversized hands', 'tiny hands', 'hand merged with object', 'object fused with fingers'],
  },
  {
    id: 'face-fix',
    labelZh: '面部修复',
    description: '近景、特写、头像、美妆、看镜头时自动启用',
    triggerSlots: ['faceFix', 'expressionPrimary', 'expressionModifiers', 'makeupIntensity', 'looking-at-camera', 'lookingAtCamera', 'head-tilt-smile', 'confident-smirk', 'bright-smile', 'cool-confident', 'shy-low-head', 'sad-melancholy', 'tired-relaxed'],
    positiveRepair: ['natural facial features', 'realistic eyes', 'normal pupils', 'relaxed mouth', 'real skin texture', 'subtle pores', 'natural expression'],
    negativePrompt: ['distorted face', 'asymmetrical eyes', 'cross eyes', 'uneven pupils', 'warped mouth', 'deformed teeth', 'extra teeth', 'melted face', 'duplicated face', 'unnatural smile', 'fake eyelashes fused together', 'over-smoothed facial texture'],
  },
  {
    id: 'skin-realism',
    labelZh: '皮肤真实纹理',
    description: '写真人像、手机、专业相机、美妆、头像时自动启用',
    triggerSlots: ['realismLevel', 'shotType', 'makeupIntensity', 'shot_headshot', 'shot_editorial_beauty', 'shot_studio_portrait'],
    positiveRepair: ['real skin texture', 'subtle pores', 'natural skin tone', 'realistic highlights', 'slight imperfections', 'no heavy retouching'],
    negativePrompt: ['plastic skin', 'waxy skin', 'porcelain doll skin', 'over-retouched skin', 'airbrushed skin', 'fake pores', 'oily highlights', 'greasy skin shine', 'unnatural skin glow', 'excessive beauty filter'],
  },
  {
    id: 'motion-fix',
    labelZh: '动态动作防扭曲',
    description: '行走、跑步、跳跃、风吹头发、运动模糊、抓拍时自动启用',
    triggerSlots: ['posePrimary', 'poseModifiers', 'walking-toward', 'walking-naturally', 'running-candid', 'dancing-candid', 'motion-blur-candid', 'hair-in-wind', 'turn-back-glance'],
    positiveRepair: ['natural body movement', 'believable motion', 'face remains in focus', 'motion blur only on moving hands or background', 'correct body balance'],
    negativePrompt: ['broken limbs', 'twisted body', 'dislocated joints', 'duplicated body', 'extra arms', 'extra legs', 'unnatural motion blur', 'smeared face', 'melted body', 'rubber limbs', 'distorted torso'],
  },
  {
    id: 'group-fix',
    labelZh: '群像防多人融合',
    description: '双人、小组、大组时自动启用',
    triggerSlots: ['subjectCount', 'count_couple', 'count_group_small', 'count_group_large', 'rel_couple', 'rel_family', 'rel_friends', 'rel_colleagues'],
    positiveRepair: ['each person clearly separated', 'natural spacing between people', 'consistent body proportions', 'clear individual faces'],
    negativePrompt: ['merged faces', 'duplicated faces', 'fused bodies', 'extra person', 'missing person', 'inconsistent face identity', 'mismatched limbs', 'overlapping bodies', 'unnatural scale difference', 'distorted group anatomy'],
  },
  {
    id: 'object-product-fix',
    labelZh: '产品/道具修复',
    description: '手持物品、产品展示时自动启用',
    triggerSlots: ['handheld', 'product', 'holding-phone', 'holding-cup', 'holding-flowers', 'hand-block-camera', 'holding-drink', 'holding-food', 'holding-umbrella', 'reading-book'],
    positiveRepair: ['object held naturally', 'product shape remains clear', 'believable contact between fingers and object', 'realistic shadow and reflection'],
    negativePrompt: ['object fused with hand', 'distorted product shape', 'unreadable logo', 'random text', 'broken packaging', 'floating object', 'incorrect reflection', 'warped edges', 'duplicated object'],
  },
  {
    id: 'no-random-text',
    labelZh: '文字/Logo 防错',
    description: '默认启用，除非用户明确选择需要文字',
    triggerSlots: ['*'],
    positiveRepair: ['clean image without text', 'no watermark', 'no visible logo unless requested'],
    negativePrompt: ['random text', 'fake letters', 'garbled text', 'watermark', 'signature', 'brand logo', 'extra caption', 'subtitle', 'UI overlay'],
  },
  {
    id: 'device-specific-fix',
    labelZh: '设备专属修复',
    description: '根据当前选择的设备模板启用对应负面词',
    triggerSlots: ['devicePreset'],
    positiveRepair: [],
    negativePrompt: [],
  },
]

export const DIFF_MAP: Record<string, DiffPack> = {}
DIFF_PACKS.forEach(d => { DIFF_MAP[d.id] = d })
