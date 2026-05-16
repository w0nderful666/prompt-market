import { useTheme } from '../context/ThemeContext'

export default function AppHeader() {
  const { darkMode, toggleDark } = useTheme()
  return (
    <header className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-card/50 backdrop-blur-sm">
      <span className="text-sm font-bold text-foreground">Prompt Director Studio</span>
      <button
        onClick={toggleDark}
        className="px-3 py-1.5 rounded-lg text-sm bg-muted text-muted-foreground hover:bg-muted/80 transition"
        aria-label={darkMode ? '切换到浅色模式' : '切换到深色模式'}
      >
        {darkMode ? '☀️ Light' : '🌙 Dark'}
      </button>
    </header>
  )
}
