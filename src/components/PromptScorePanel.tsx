import { useState } from 'react'
import { useDirector } from '../context/DirectorContext'

interface ScoreDetail { id: string; label: string; score: number }
interface ScoreResult { score: number; level: string; details: ScoreDetail[]; pros: string[]; suggestions: string[] }

interface Props {
  onScore: (director: Record<string, string>) => ScoreResult | null
}

export default function PromptScorePanel({ onScore }: Props) {
  const [result, setResult] = useState<ScoreResult | null>(null)
  const [isScoring, setIsScoring] = useState(false)
  const { directorData } = useDirector()

  function handleScore() {
    setIsScoring(true)
    setTimeout(() => {
      const res = onScore(directorData)
      setResult(res)
      setIsScoring(false)
    }, 100)
  }

  function scoreColor(score: number): string {
    if (score >= 2) return 'bg-green-500'
    if (score >= 1) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div>
      <button onClick={handleScore} disabled={isScoring}
        className="w-full rounded-lg bg-primary py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition mb-3 disabled:opacity-50">
        {isScoring ? '⏳ 评分中...' : '📊 开始评分'}
      </button>
      {result && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black text-foreground">{result.score}</span>
            <span className="rounded-full px-2 py-0.5 text-xs font-bold bg-primary/10 text-primary">{result.level}</span>
          </div>
          <div className="space-y-1.5">
            {result.details.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-24 text-xs text-muted-foreground truncate">{d.label}</span>
                <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${scoreColor(d.score)}`} style={{ width: `${(d.score / 2) * 100}%` }} />
                </div>
                <span className="text-xs text-muted-foreground w-4 text-right">{d.score}</span>
              </div>
            ))}
          </div>
          {result.pros.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-green-600 mb-1">✓ 优点</h4>
              <ul className="space-y-0.5">
                {result.pros.map((p, i) => <li key={i} className="text-xs text-muted-foreground">• {p}</li>)}
              </ul>
            </div>
          )}
          {result.suggestions.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-amber-600 mb-1">💡 建议</h4>
              <ul className="space-y-0.5">
                {result.suggestions.map((s, i) => <li key={i} className="text-xs text-muted-foreground">• {s}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
