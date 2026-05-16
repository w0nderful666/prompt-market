export interface MicroPreset {
  id: string
  label: string
  icon: string
  description: string
  allowFields?: string[]
  [key: string]: any
}

export const MICRO_PRESETS: MicroPreset[] = [
  {
    id: 'fix_hands_strict',
    label: '隐藏手指',
    icon: '✋',
    description: '减少手指畸形风险，让手部不入镜或被遮挡',
    allowFields: ['body', 'mustKeep', 'avoid'],
    body: '双手在画面下方裁切外，或被前景、衣袖、被子、抱枕遮住，不显示清晰手指',
    mustKeep: '手部不作为画面重点，避免清晰手指',
    avoid: '清晰手指，手部特写，畸形手，多余手指，断指，手指扭曲'
  },
  {
    id: 'third_person_no_phone',
    label: '去自拍逻辑',
    icon: '📷',
    description: '改成第三人称抓拍，不出现手机和镜子反射',
    allowFields: ['composition', 'body', 'avoid'],
    composition: '第三人称近景抓拍，不是自拍，不出现手机，不出现镜子反射',
    body: '不做举手机、拿手机的姿势，双手自然下垂或在画面裁切外',
    avoid: '手机入镜，自拍手机，镜子反射，手机遮脸，对镜自拍'
  },
  {
    id: 'more_natural_pose',
    label: '动作更自然',
    icon: '🌿',
    description: '减少刻意摆拍和不自然动作',
    allowFields: ['expression', 'body', 'avoid'],
    expression: '表情自然放松，不刻意摆拍',
    body: '肩膀放松，身体重心自然，动作像被随手拍下来的瞬间',
    avoid: '僵硬姿势，夸张摆拍，不自然动作，过度造型'
  },
  {
    id: 'more_phone_realism',
    label: '低清手机感',
    icon: '📱',
    description: '增强低清生活照质感',
    allowFields: ['camera', 'atmosphere', 'avoid'],
    camera: '普通手机随手拍，低分辨率，轻微数字噪点，JPEG 压缩痕迹',
    atmosphere: '真实生活气息，不像商业棚拍',
    avoid: '高清商业写真，影棚光，过度精修，专业摄影感'
  }
]
