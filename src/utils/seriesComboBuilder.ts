import { SCENE_POOL, STYLE_POOL, CHARACTER_POOL } from '../data/seriesComboPools'
import type { SeriesPromptResult } from './seriesGenerator'

const ADULT_SAFETY = 'clearly adult, 20+'
const DEFAULT_AVOID = '手机入镜，自拍，镜子反射，清晰手指，畸形手，多余手指，未成年感'

export function buildComboPrompt(sceneId: string, styleId: string, charId: string, count = 4): SeriesPromptResult[] {
  const scene = SCENE_POOL.find(s => s.id === sceneId)
  const style = STYLE_POOL.find(s => s.id === styleId)
  const character = CHARACTER_POOL.find(c => c.id === charId)

  if (!scene || !style || !character) return []

  const results: SeriesPromptResult[] = []
  for (let i = 0; i < count; i++) {
    const director: Record<string, string> = {
      model: 'GPT Image / 写实人像',
      subject: character.fields.subject || '',
      scene: scene.fields.scene || '',
      composition: scene.fields.composition || '第三人称近景抓拍',
      expression: character.fields.expression || '表情自然放松',
      face: character.fields.face || '',
      makeup: '',
      hair: character.fields.hair || '',
      body: '',
      action: '',
      clothing: character.fields.clothing || '',
      accessories: '',
      lighting: scene.fields.lighting || '',
      camera: style.fields.camera || '手机随手拍',
      depthOfField: scene.fields.depthOfField || '中等景深',
      background: scene.fields.background || '',
      atmosphere: style.fields.atmosphere || '真实生活气息',
      caption: '',
      mustKeep: ADULT_SAFETY,
      avoid: DEFAULT_AVOID,
      negative: '',
      ratio: '3:4'
    }
    results.push({
      id: `combo_${sceneId}_${styleId}_${charId}_${String(i + 1).padStart(2, '0')}`,
      title: `${character.name} · ${style.name} · ${scene.name}`,
      summary: `组合生成：${scene.name} + ${style.name}`,
      templateId: 'combo',
      shotIndex: i + 1,
      director,
      meta: { cameraLogic: 'third_person_no_phone', handSafeLevel: 'strict', generatedAt: new Date().toISOString() }
    })
  }
  return results
}
