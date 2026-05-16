import { useRef, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'

interface Preset { id: string; zh: string }

interface Props {
  value: string
  title: string
  icon: string
  placeholder?: string
  locked?: boolean
  presets?: Preset[]
  moduleId: string
  onChange: (value: string) => void
  onToggleLock?: () => void
  onClear?: () => void
}

export default function DirectorCard({
  value, title, icon, placeholder, locked, presets, onChange, onToggleLock, onClear
}: Props) {
  const { darkMode } = useTheme()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.max(textareaRef.current.scrollHeight, 42) + 'px'
    }
  }, [value])

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    onChange(e.target.value)
  }

  function togglePreset(preset: Preset) {
    if (locked) return
    onChange(value === preset.zh ? '' : preset.zh)
  }

  return (
    <div className={`director-card group relative rounded-lg border transition-all duration-200 ${
      locked
        ? 'border-amber-300 bg-warning/5 dark:border-amber-600 dark:bg-amber-900/20'
        : 'border-border bg-card dark:border-border dark:bg-card'
    } hover:shadow-md dark:hover:shadow-lg`}>
      <div className={`flex items-center justify-between border-b px-3 py-2 ${
        locked ? 'border-amber-200 dark:border-amber-700' : 'border-border/50 dark:border-border'
      }`}>
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base shrink-0">{icon}</span>
          <span className={`text-xs font-bold truncate ${locked ? 'text-amber-700 dark:text-amber-300' : 'text-foreground/80'}`}>{title}</span>
          {locked && <span className="rounded bg-amber-200 px-1.5 py-0.5 text-xs font-bold text-amber-800 dark:bg-amber-700 dark:text-amber-200">🔒 已锁定</span>}
          {value && value.trim() && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button className="rounded p-1 text-xs text-muted-foreground transition hover:bg-muted hover:text-foreground/70" onClick={onToggleLock} title={locked ? '解锁' : '锁定'}>{locked ? '🔓' : '🔒'}</button>
          <button className="rounded p-1 text-xs text-muted-foreground transition hover:bg-destructive/5 hover:text-destructive" onClick={onClear} title="清空">✕</button>
        </div>
      </div>
      <div className="p-3">
        <textarea ref={textareaRef}
          className={`w-full resize-none rounded-lg border bg-transparent px-3 py-2 text-sm leading-5 outline-none transition dark:text-foreground ${
            locked ? 'border-amber-200 bg-warning/5 dark:border-amber-700 dark:bg-amber-900/10 cursor-not-allowed' : 'border-border focus:border-primary dark:border-border dark:focus:border-primary'
          }`}
          value={value} placeholder={placeholder} disabled={locked} rows={2}
          onChange={handleInput} />
        <div className="mt-2 flex items-center justify-between">
          {presets && presets.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {presets.map(preset => (
                <button key={preset.id}
                  className={`rounded-full border px-2.5 py-1 text-xs font-medium transition active:scale-95 ${
                    value === preset.zh
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                      : locked
                        ? 'cursor-not-allowed border-amber-200 text-amber-400 dark:border-amber-700'
                        : 'border-border text-muted-foreground hover:border-primary/30 hover:bg-primary/5 hover:text-primary dark:border-border dark:text-muted-foreground dark:hover:border-primary/50 dark:hover:bg-primary/20'
                  }`}
                  disabled={locked}
                  onClick={() => togglePreset(preset)}>{preset.zh}</button>
              ))}
            </div>
          )}
          {value && <span className="text-xs text-muted-foreground ml-auto shrink-0">{value.length}字</span>}
        </div>
      </div>
    </div>
  )
}
