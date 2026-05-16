import { safeRead, safeWrite } from './storageManager.js'

const STORAGE_KEY = 'prompt_market_packs'

export function saveSeriesAsPack(series, packMeta = {}) {
  if (!series || !Array.isArray(series) || series.length === 0) {
    return { success: false, error: 'Series 数据为空', pack: null }
  }

  const packs = safeRead(STORAGE_KEY, [])
  const now = new Date().toISOString()

  const pack = {
    id: packMeta.id || `pack_series_${Date.now()}`,
    name: packMeta.name || `Series: ${series[0]?.title || '批量组图'}`,
    description: packMeta.description || '由 Series Studio 批量生成',
    tags: packMeta.tags || ['Series', '第三人称', '手部规避'],
    builtIn: false,
    prompts: series.map((item, index) => ({
      id: item.id || `series_prompt_${index}_${Date.now()}`,
      title: item.title || `组图 ${index + 1}`,
      summary: item.summary || '',
      director: item.director || {},
      meta: item.meta || {},
      addedAt: now
    })),
    createdAt: now
  }

  const result = safeWrite(STORAGE_KEY, [...packs, pack])
  return { ...result, pack }
}
