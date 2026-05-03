import { validatePromptLibrary } from './promptBuilder.js'

const STORAGE_KEYS = {
  selected: 'prompt_market_selected',
  schemes: 'prompt_market_schemes',
  customPrompts: 'prompt_market_custom_prompts',
  currentCategory: 'prompt_market_current_category',
  currentTab: 'prompt_market_current_tab',
  editorStatePrefix: 'prompt_market_editor_state',
  // Director mode keys
  directorSchemes: 'prompt_market_director_schemes',
  directorHistory: 'prompt_market_director_history',
  directorFavorites: 'prompt_market_director_favorites',
  directorCurrent: 'prompt_market_director_current',
  currentView: 'prompt_market_current_view'
}

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch (error) {
    console.warn(`读取本地缓存失败: ${key}`, error)
    return fallback
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.warn(`写入本地缓存失败: ${key}`, error)
    return false
  }
}

function remove(key) {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.warn(`清理本地缓存失败: ${key}`, error)
  }
}

function editorKey(libraryId) {
  return `${STORAGE_KEYS.editorStatePrefix}:${libraryId || 'default'}`
}

export const storage = {
  getSelectedPrompts: () => read(STORAGE_KEYS.selected, []),
  setSelectedPrompts: (items) => write(STORAGE_KEYS.selected, items),
  clearSelected: () => remove(STORAGE_KEYS.selected),

  getSavedSchemes: () => read(STORAGE_KEYS.schemes, []),
  setSavedSchemes: (schemes) => write(STORAGE_KEYS.schemes, schemes),

  getCustomPrompts: () => read(STORAGE_KEYS.customPrompts, null),
  setCustomPrompts: (data) => write(STORAGE_KEYS.customPrompts, data),
  clearCustomPrompts: () => remove(STORAGE_KEYS.customPrompts),

  getCurrentCategory: () => read(STORAGE_KEYS.currentCategory, 'draw'),
  setCurrentCategory: (id) => write(STORAGE_KEYS.currentCategory, id),
  getCurrentTab: () => read(STORAGE_KEYS.currentTab, 'subject'),
  setCurrentTab: (id) => write(STORAGE_KEYS.currentTab, id),

  getEditorState: (libraryId, fallback) => read(editorKey(libraryId), fallback),
  setEditorState: (libraryId, state) => write(editorKey(libraryId), state),
  clearEditorState: (libraryId) => remove(editorKey(libraryId)),

  // Director mode
  getCurrentView: () => read(STORAGE_KEYS.currentView, 'classic'),
  setCurrentView: (view) => write(STORAGE_KEYS.currentView, view),

  getDirectorCurrent: () => read(STORAGE_KEYS.directorCurrent, null),
  setDirectorCurrent: (data) => write(STORAGE_KEYS.directorCurrent, data),

  getDirectorHistory: () => read(STORAGE_KEYS.directorHistory, []),
  addDirectorHistory: (entry) => {
    const history = read(STORAGE_KEYS.directorHistory, [])
    history.unshift({ ...entry, id: `h_${Date.now()}`, createdAt: new Date().toISOString() })
    write(STORAGE_KEYS.directorHistory, history.slice(0, 10))
  },
  clearDirectorHistory: () => remove(STORAGE_KEYS.directorHistory),

  getDirectorFavorites: () => read(STORAGE_KEYS.directorFavorites, []),
  addDirectorFavorite: (entry) => {
    const favs = read(STORAGE_KEYS.directorFavorites, [])
    favs.unshift({ ...entry, id: `f_${Date.now()}`, createdAt: new Date().toISOString() })
    write(STORAGE_KEYS.directorFavorites, favs)
  },
  removeDirectorFavorite: (id) => {
    const favs = read(STORAGE_KEYS.directorFavorites, []).filter(f => f.id !== id)
    write(STORAGE_KEYS.directorFavorites, favs)
  },

  getDirectorSchemes: () => read(STORAGE_KEYS.directorSchemes, []),
  saveDirectorScheme: (name, director, outputs) => {
    const schemes = read(STORAGE_KEYS.directorSchemes, [])
    schemes.unshift({
      id: `ds_${Date.now()}`,
      name,
      director: { ...director },
      outputs: { ...outputs },
      createdAt: new Date().toISOString()
    })
    write(STORAGE_KEYS.directorSchemes, schemes)
  },
  deleteDirectorScheme: (id) => {
    const schemes = read(STORAGE_KEYS.directorSchemes, []).filter(s => s.id !== id)
    write(STORAGE_KEYS.directorSchemes, schemes)
  }
}

export function saveScheme(name, prompts, promptState = {}) {
  const now = new Date().toISOString()
  const schemes = storage.getSavedSchemes()
  const scheme = {
    id: `${Date.now()}`,
    name,
    prompts: [...prompts],
    promptState: { ...promptState },
    createdAt: now,
    updatedAt: now
  }
  storage.setSavedSchemes([scheme, ...schemes])
  return scheme
}

export function deleteScheme(id) {
  const nextSchemes = storage.getSavedSchemes().filter((scheme) => scheme.id !== id)
  storage.setSavedSchemes(nextSchemes)
  return nextSchemes
}

export function downloadJson(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export function downloadText(text, filename) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export function importPromptLibrary(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result || '{}'))
        const message = validatePromptLibrary(data)
        if (message) reject(new Error(message))
        else resolve(data)
      } catch (error) {
        reject(new Error(error.message || 'JSON 文件解析失败'))
      }
    }
    reader.onerror = () => reject(new Error('文件读取失败，请重试'))
    reader.readAsText(file, 'utf-8')
  })
}

export async function fetchRemotePromptLibrary(url) {
  const response = await fetch(url)
  if (!response.ok) throw new Error('远程词库请求失败')
  const data = await response.json()
  const message = validatePromptLibrary(data)
  if (message) throw new Error(message)
  return data
}
