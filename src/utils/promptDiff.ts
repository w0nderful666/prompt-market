const STORAGE_KEY = 'prompt_market_diff_history'
const MAX_HISTORY = 20

export function tokenize(text: string): string[] {
  if (!text || typeof text !== 'string') return []
  const tokens = text.split(/[\s，,、；;。\n\r\t]+/).map(t => t.trim().toLowerCase()).filter(t => t.length > 0)
  return [...new Set(tokens)]
}

export function diffTokens(original: string, optimized: string) {
  const origTokens = tokenize(original)
  const optTokens = tokenize(optimized)
  const optSet = new Set(optTokens)
  const origSet = new Set(origTokens)
  return { added: optTokens.filter(t => !origSet.has(t)), removed: origTokens.filter(t => !optSet.has(t)), kept: origTokens.filter(t => optSet.has(t)) }
}

export function diffSummary(original: string, optimized: string) {
  const diff = diffTokens(original, optimized)
  return { ...diff, charChange: (optimized || '').length - (original || '').length, estimatedTokenChange: diff.added.length - diff.removed.length }
}

export function saveDiff(diff: any) {
  try {
    const history = getDiffHistory()
    const record = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), timestamp: new Date().toISOString(), ...diff }
    history.unshift(record)
    if (history.length > MAX_HISTORY) history.length = MAX_HISTORY
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
    return record
  } catch { return null }
}

export function getDiffHistory(): any[] {
  try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : [] }
  catch { return [] }
}

export function deleteDiff(id: string) {
  try { const history = getDiffHistory().filter((d: any) => d.id !== id); localStorage.setItem(STORAGE_KEY, JSON.stringify(history)) } catch {}
}

export function clearDiffHistory() {
  try { localStorage.removeItem(STORAGE_KEY) } catch {}
}

export { STORAGE_KEY }
