import type { ParameterPreset } from '../core/types'

export const PARAMETER_PRESETS: ParameterPreset[] = [
  {
    id: 'real-stable',
    labelZh: '真实稳定',
    description: '真实照片、自然构图、低风格化、不要过度修饰',
    midjourney: '--style raw --s 50 --c 5',
    generalDescription: '真实照片，自然构图，低风格化，不要过度修饰',
  },
  {
    id: 'slight-variation',
    labelZh: '轻微变化',
    description: '同一基础上有一些自然变化',
    midjourney: '--style raw --s 80 --c 10',
    generalDescription: '同一场景下允许轻微变化，自然构图，中低风格化',
  },
  {
    id: 'multi-exploration',
    labelZh: '多图探索',
    description: '同一场景下生成多个不同动作和角度',
    midjourney: '--style raw --s 100 --c 25',
    generalDescription: '同一场景下生成多个不同动作和角度，高变化度',
  },
  {
    id: 'strong-stylized',
    labelZh: '强风格化',
    description: '更强的艺术风格化处理',
    midjourney: '--s 250 --c 20',
    generalDescription: '较强的艺术风格化处理，允许更多 AI 创意发挥',
  },
  {
    id: 'low-ai-feel',
    labelZh: '低 AI 感',
    description: '真实皮肤纹理、自然光、轻微瑕疵、非完美构图',
    midjourney: '--style raw --s 25 --c 5',
    generalDescription: '真实皮肤纹理，自然光，轻微瑕疵，非完美构图，最低 AI 修饰感',
  },
]

export const PARAMETER_MAP: Record<string, ParameterPreset> = {}
PARAMETER_PRESETS.forEach(p => { PARAMETER_MAP[p.id] = p })
