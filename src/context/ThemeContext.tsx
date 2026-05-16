import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { applyTheme, loadTheme, BACKGROUND_STYLES } from '../lib/applyTheme'

interface ThemeContextType {
  themeId: string
  mode: 'light' | 'dark'
  darkMode: boolean
  bgStyle: string
  bgClass: string
  setTheme: (id: string) => void
  setMode: (mode: 'light' | 'dark') => void
  toggleMode: () => void
  toggleDark: () => void
  setBgStyle: (id: string) => void
}

const ThemeContext = createContext<ThemeContextType>(null!)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState('material-you')
  const [mode, setModeState] = useState<'light' | 'dark'>('light')
  const [bgStyle, setBgStyleState] = useState('solid')

  useEffect(() => {
    const saved = loadTheme()
    setThemeId(saved.themeId || 'material-you')
    setModeState(saved.mode || 'light')
  }, [])

  const bgClass = BACKGROUND_STYLES[bgStyle]?.cls || 'bg-background'

  function setTheme(id: string) {
    setThemeId(id)
    applyTheme(id, mode)
  }

  function setMode(m: 'light' | 'dark') {
    setModeState(m)
    applyTheme(themeId, m)
  }

  function toggleMode() {
    const next = mode === 'light' ? 'dark' : 'light'
    setMode(next)
  }

  const darkMode = mode === 'dark'
  const toggleDark = toggleMode

  function setBgStyle(id: string) {
    setBgStyleState(id)
  }

  return (
    <ThemeContext.Provider value={{ themeId, mode, darkMode, bgStyle, bgClass, setTheme, setMode, toggleMode, toggleDark, setBgStyle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
