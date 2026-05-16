import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'

const STORAGE_KEY = 'prompt_market_director_current'

interface DirectorContextType {
  directorData: Record<string, string>
  setDirectorField: (id: string, value: string) => void
  setDirectorData: (data: Record<string, string>) => void
  clearDirector: () => void
}

const DirectorContext = createContext<DirectorContextType>(null!)

function loadFromStorage(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

function saveToStorage(data: Record<string, string>) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch {}
}

export function DirectorProvider({ children }: { children: ReactNode }) {
  const [directorData, setDirectorData] = useState<Record<string, string>>(loadFromStorage)

  useEffect(() => {
    saveToStorage(directorData)
  }, [directorData])

  const setDirectorField = useCallback((id: string, value: string) => {
    setDirectorData(prev => ({ ...prev, [id]: value }))
  }, [])

  const clearDirector = useCallback(() => {
    setDirectorData({})
  }, [])

  return (
    <DirectorContext.Provider value={{ directorData, setDirectorField, setDirectorData, clearDirector }}>
      {children}
    </DirectorContext.Provider>
  )
}

export function useDirector() {
  return useContext(DirectorContext)
}
