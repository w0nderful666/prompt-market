import { useState, useCallback, useMemo } from 'react'
import { useDirector } from '../context/DirectorContext'
import { SHOWCASE_ENTRIES, SHOWCASE_CATEGORIES } from '../data/showcaseData'
import type { ShowcaseCategory } from '../data/showcaseData'

const CATEGORY_ICONS: Record<string, string> = {
  all: '📋', daily: '☕', outdoor: '🌳', travel: '✈️',
  portrait: '👤', street: '🏙️', seasonal: '🌸',
  fashion: '👗', indoor: '🏠', product: '📦', concept: '🎨'
}

export default function ShowcaseSection() {
  const [activeCat, setActiveCat] = useState<string>('all')
  const { setDirectorData } = useDirector()

  const filtered = activeCat === 'all'
    ? SHOWCASE_ENTRIES
    : SHOWCASE_ENTRIES.filter(ex => ex.category === activeCat)

  const loadExample = useCallback((ex: typeof SHOWCASE_ENTRIES[number]) => {
    setDirectorData(ex.director)
  }, [setDirectorData])

  const categoryList = useMemo(() => {
    const cats: { id: string; label: string; icon: string; count: number }[] = [
      { id: 'all', label: '全部', icon: CATEGORY_ICONS.all, count: SHOWCASE_ENTRIES.length }
    ]
    for (const c of SHOWCASE_CATEGORIES) {
      cats.push({
        id: c.key,
        label: c.label,
        icon: CATEGORY_ICONS[c.key] || '📌',
        count: SHOWCASE_ENTRIES.filter(e => e.category === c.key).length
      })
    }
    return cats
  }, [])

  return (
    <div>
      <h2 className="mb-1 text-lg font-black text-foreground">🖼️ Showcase</h2>
      <p className="mb-4 text-sm text-muted-foreground">浏览 {SHOWCASE_ENTRIES.length} 个示例，一键加载到 Director</p>

      <div className="mb-4 flex gap-1 flex-wrap">
        {categoryList.map(cat => (
          <button key={cat.id} onClick={() => setActiveCat(cat.id)}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              activeCat === cat.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
            }`}>{cat.icon} {cat.label} ({cat.count})</button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(ex => (
          <div key={ex.id} className="group rounded-lg border border-border bg-card p-4 transition-all hover:shadow-md">
            <div className="mb-2 flex items-start justify-between">
              <h4 className="text-sm font-bold text-foreground">{ex.name}</h4>
              {ex.score && (
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                  ex.score >= 90 ? 'bg-green-100 text-green-700' : ex.score >= 85 ? 'bg-blue-100 text-blue-700' : 'bg-muted text-muted-foreground'
                }`}>{ex.score}</span>
              )}
            </div>
            <p className="mb-2 text-xs text-muted-foreground">{ex.subtitle}</p>
            <div className="mb-2 flex flex-wrap gap-1">
              {ex.tags?.slice(0, 4).map(tag => (
                <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{tag}</span>
              ))}
            </div>
            <button onClick={() => loadExample(ex)}
              className="mt-2 w-full rounded-lg bg-primary py-1.5 text-xs font-bold text-primary-foreground transition hover:bg-primary/90 active:scale-[0.97]">
              加载到 Director
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
