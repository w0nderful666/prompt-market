/**
 * Prompt Diff - text-level token diff with localStorage history
 */

const STORAGE_KEY = 'prompt_market_diff_history'
const MAX_HISTORY = 20

/**
 * Tokenize text into unique tokens
 */
export function tokenize(text) {
  if (!text || typeof text !== 'string') return []
  const tokens = text
    .split(/[\s，,、；;。\n\r\t]+/)
    .map(t => t.trim().toLowerCase())
    .filter(t => t.length > 0)
  return [...new Set(tokens)]
}

/**
 * Compare two texts and return diff tokens
 */
export function diffTokens(original, optimized) {
  const origTokens = tokenize(original)
  const optTokens = tokenize(optimized)
  const optSet = new Set(optTokens)
  const origSet = new Set(origTokens)

  const added = optTokens.filter(t => !origSet.has(t))
  const removed = origTokens.filter(t => !optSet.has(t))
  const kept = origTokens.filter(t => optSet.has(t))

  return { added, removed, kept }
}

/**
 * Generate a diff summary with statistics
 */
export function diffSummary(original, optimized) {
  const diff = diffTokens(original, optimized)
  const charChange = (optimized || '').length - (original || '').length
  const estimatedTokenChange = diff.added.length - diff.removed.length

  return {
    added: diff.added,
    removed: diff.removed,
    kept: diff.kept,
    charChange,
    estimatedTokenChange
  }
}

/**
 * Save a diff record to localStorage
 */
export function saveDiff(diff) {
  try {
    const history = getDiffHistory()
    const record = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      timestamp: new Date().toISOString(),
      ...diff
    }
    history.unshift(record)
    if (history.length > MAX_HISTORY) history.length = MAX_HISTORY
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
    return record
  } catch (e) {
    console.warn('Failed to save diff:', e)
    return null
  }
}

/**
 * Get diff history from localStorage
 */
export function getDiffHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    return []
  }
}

/**
 * Delete a diff record by id
 */
export function deleteDiff(id) {
  try {
    const history = getDiffHistory().filter(d => d.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  } catch (e) {
    console.warn('Failed to delete diff:', e)
  }
}

/**
 * Clear all diff history
 */
export function clearDiffHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (e) {
    console.warn('Failed to clear diff history:', e)
  }
}

export { STORAGE_KEY }
