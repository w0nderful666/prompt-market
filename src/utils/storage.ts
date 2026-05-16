const STORAGE_PREFIX = 'prompt_market_'

export interface DirectorData {
  model: string; subject: string; scene: string; ratio: string;
  composition: string; lighting: string; camera: string; depthOfField: string;
  expression: string; face: string; makeup: string; hair: string;
  body: string; action: string; clothing: string; accessories: string;
  background: string; atmosphere: string; caption: string;
  mustKeep: string; avoid: string; negative: string;
}

const KEYS = {
  directorCurrent: `${STORAGE_PREFIX}director_current`,
  directorSchemes: `${STORAGE_PREFIX}director_schemes`,
  directorHistory: `${STORAGE_PREFIX}director_history`,
  directorFavorites: `${STORAGE_PREFIX}director_favorites`,
  snapshots: `${STORAGE_PREFIX}snapshots`,
  packs: `${STORAGE_PREFIX}packs`,
  theme: `${STORAGE_PREFIX}theme`,
  activeSection: `${STORAGE_PREFIX}active_section`,
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch { return fallback }
}

function write(key: string, value: unknown): boolean {
  try { localStorage.setItem(key, JSON.stringify(value)); return true }
  catch { return false }
}

function remove(key: string) { try { localStorage.removeItem(key) } catch {} }

export function getStorageUsage() {
  let total = 0
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(STORAGE_PREFIX)) {
        const value = localStorage.getItem(key) || ''
        total += key.length + value.length
      }
    }
  } catch { /* ignore */ }
  return {
    bytes: total,
    kb: Math.round(total / 1024 * 10) / 10,
    mb: Math.round(total / 1024 / 1024 * 100) / 100,
    formatted: total < 1024 ? `${total} B` : total < 1024 * 1024 ? `${Math.round(total / 1024)} KB` : `${Math.round(total / 1024 / 1024 * 10) / 10} MB`
  }
}

export function safeWrite(key: string, value: unknown): { success: boolean; error?: string } {
  try {
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value))
    return { success: true }
  } catch (error: any) {
    if (error?.name === 'QuotaExceededError' || error?.code === 22 || error?.code === 1014) {
      return { success: false, error: `存储空间已满 (${getStorageUsage().formatted})。请清理历史数据后重试。` }
    }
    return { success: false, error: error?.message || '写入失败' }
  }
}

export function safeRead<T>(key: string, fallback: T | null = null): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch { return fallback }
}

export function clearAllPromptMarketData() {
  const keysToRemove: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(STORAGE_PREFIX)) keysToRemove.push(key)
  }
  keysToRemove.forEach(k => localStorage.removeItem(k))
  return keysToRemove.length
}

export function clearHistoryData() {
  const historyKeys = [`${STORAGE_PREFIX}director_history`, `${STORAGE_PREFIX}diff_history`, `${STORAGE_PREFIX}snapshots`]
  historyKeys.forEach(k => localStorage.removeItem(k))
  return historyKeys.length
}

export function exportAllData() {
  const data: Record<string, unknown> = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(STORAGE_PREFIX)) {
      data[key] = safeRead(key, localStorage.getItem(key))
    }
  }
  return { appVersion: '3.0.0', exportedAt: new Date().toISOString(), storageUsage: getStorageUsage(), data }
}

export function importAllData(jsonData: any, mode: 'merge' | 'overwrite' = 'merge') {
  const result = { success: true, imported: 0, skipped: 0, errors: [] as string[] }
  if (!jsonData || typeof jsonData !== 'object') {
    return { success: false, imported: 0, skipped: 0, errors: ['无效的 JSON 数据'] }
  }
  const data = jsonData.data || jsonData
  if (mode === 'overwrite') {
    const keysToRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(STORAGE_PREFIX)) keysToRemove.push(key)
    }
    keysToRemove.forEach(k => localStorage.removeItem(k))
  }
  for (const [key, value] of Object.entries(data)) {
    if (!key.startsWith(STORAGE_PREFIX)) { result.skipped++; continue }
    const wr = safeWrite(key, value)
    if (wr.success) result.imported++
    else { result.errors.push(`${key}: ${wr.error}`); result.success = false }
  }
  return result
}

export const storage = {
  getDirectorCurrent: (): DirectorData | null => read(KEYS.directorCurrent, null),
  setDirectorCurrent: (data: DirectorData) => write(KEYS.directorCurrent, data),

  getDirectorSchemes: (): any[] => read(KEYS.directorSchemes, []),
  saveScheme: (name: string, director: DirectorData, outputs: any) => {
    const schemes = read<any[]>(KEYS.directorSchemes, [])
    schemes.unshift({ id: `ds_${Date.now()}`, name, director: { ...director }, outputs: { ...outputs }, createdAt: new Date().toISOString() })
    write(KEYS.directorSchemes, schemes)
  },
  deleteScheme: (id: string) => {
    const schemes = read<any[]>(KEYS.directorSchemes, []).filter((s: any) => s.id !== id)
    write(KEYS.directorSchemes, schemes)
  },

  getDirectorHistory: (): any[] => read(KEYS.directorHistory, []),
  addDirectorHistory: (entry: any) => {
    const hist = read<any[]>(KEYS.directorHistory, [])
    hist.unshift({ ...entry, id: `h_${Date.now()}`, createdAt: new Date().toISOString() })
    write(KEYS.directorHistory, hist.slice(0, 10))
  },
  clearDirectorHistory: () => remove(KEYS.directorHistory),

  getSnapshots: (): any[] => read(KEYS.snapshots, []),
  setSnapshots: (snapshots: any[]) => write(KEYS.snapshots, snapshots),

  getPacks: (): any[] => read(KEYS.packs, []),
  setPacks: (packs: any[]) => write(KEYS.packs, packs),
}

export function downloadJson(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url; link.download = filename
  document.body.appendChild(link); link.click()
  link.remove(); URL.revokeObjectURL(url)
}

export function downloadText(text: string, filename: string) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url; link.download = filename
  document.body.appendChild(link); link.click()
  link.remove(); URL.revokeObjectURL(url)
}
