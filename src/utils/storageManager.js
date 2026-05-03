/**
 * Storage management utilities for Prompt Director Studio
 * Handles quota errors, usage estimation, and bulk import/export
 */

const STORAGE_PREFIX = 'prompt_market_'

/**
 * Get estimated localStorage usage in bytes
 */
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

/**
 * Safe write with QuotaExceededError handling
 * Returns { success: boolean, error?: string }
 */
export function safeWrite(key, value) {
  try {
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value))
    return { success: true }
  } catch (error) {
    if (error.name === 'QuotaExceededError' || error.code === 22 || error.code === 1014) {
      const usage = getStorageUsage()
      return { success: false, error: `存储空间已满 (${usage.formatted})。请清理历史数据后重试。` }
    }
    return { success: false, error: error.message || '写入失败' }
  }
}

/**
 * Safe read with JSON parse error handling
 */
export function safeRead(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

/**
 * Get all prompt_market_ keys and their values for export
 */
export function exportAllData() {
  const data = {}
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(STORAGE_PREFIX)) {
        data[key] = safeRead(key, localStorage.getItem(key))
      }
    }
  } catch { /* ignore */ }
  return {
    appVersion: '3.0.0',
    exportedAt: new Date().toISOString(),
    storageUsage: getStorageUsage(),
    data
  }
}

/**
 * Import all data with validation
 * Returns { success, imported, skipped, errors }
 */
export function importAllData(jsonData, mode = 'merge') {
  const result = { success: true, imported: 0, skipped: 0, errors: [] }

  if (!jsonData || typeof jsonData !== 'object') {
    return { success: false, imported: 0, skipped: 0, errors: ['无效的 JSON 数据'] }
  }

  const data = jsonData.data || jsonData

  if (mode === 'overwrite') {
    // Clear existing prompt_market_ keys
    const keysToRemove = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(STORAGE_PREFIX)) keysToRemove.push(key)
    }
    keysToRemove.forEach(k => localStorage.removeItem(k))
  }

  for (const [key, value] of Object.entries(data)) {
    if (!key.startsWith(STORAGE_PREFIX)) {
      result.skipped++
      continue
    }
    const writeResult = safeWrite(key, value)
    if (writeResult.success) {
      result.imported++
    } else {
      result.errors.push(`${key}: ${writeResult.error}`)
      result.success = false
    }
  }

  return result
}

/**
 * Clear all prompt_market_ keys from localStorage
 */
export function clearAllPromptMarketData() {
  const keysToRemove = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(STORAGE_PREFIX)) keysToRemove.push(key)
  }
  keysToRemove.forEach(k => localStorage.removeItem(k))
  return keysToRemove.length
}

/**
 * Clear only history-related data (keep settings, current director, etc.)
 */
export function clearHistoryData() {
  const historyKeys = [
    'prompt_market_director_history',
    'prompt_market_diff_history',
    'prompt_market_snapshots'
  ]
  historyKeys.forEach(k => localStorage.removeItem(k))
  return historyKeys.length
}

/**
 * Clear diff history
 */
export function clearDiffHistory() {
  localStorage.removeItem('prompt_market_diff_history')
}

/**
 * Clear snapshots
 */
export function clearSnapshots() {
  localStorage.removeItem('prompt_market_snapshots')
}

/**
 * Clear user prompt packs (keep built-in ones)
 */
export function clearUserPacks() {
  const packs = safeRead('prompt_market_packs', [])
  const builtIn = packs.filter(p => p.builtIn)
  safeWrite('prompt_market_packs', builtIn)
  return packs.length - builtIn.length
}

/**
 * Reset to default settings
 */
export function resetSettings() {
  localStorage.removeItem('prompt_market_dark_mode')
  localStorage.removeItem('prompt_market_active_section')
  localStorage.removeItem('prompt_market_current_category')
  localStorage.removeItem('prompt_market_current_tab')
}
