import { useState } from 'react'
import { useDirector } from '../context/DirectorContext'

interface Variant { id: string; name_zh: string; text_zh: string }

interface Props {
  onGenerate: (director: Record<string, string>) => Variant[]
}

export default function VariantsPanel({ onGenerate }: Props) {
  const [variants, setVariants] = useState<Variant[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const { directorData } = useDirector()

  function generate() {
    setIsGenerating(true)
    setTimeout(() => {
      const results = onGenerate(directorData)
      setVariants(results)
      setIsGenerating(false)
    }, 100)
  }

  return (
    <div>
      <button onClick={generate} disabled={isGenerating}
        className="w-full rounded-lg bg-primary py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition mb-3 disabled:opacity-50">
        {isGenerating ? '⏳ 生成中...' : '🔄 生成变体'}
      </button>
      {variants.map(v => (
        <div key={v.id} className="mb-2 rounded-lg bg-muted/50 p-3">
          <h4 className="mb-1 text-xs font-bold text-foreground">{v.name_zh}</h4>
          <p className="mb-1 text-xs text-muted-foreground line-clamp-3">{v.text_zh}</p>
          <button onClick={() => navigator.clipboard.writeText(v.text_zh)}
            className="text-xs text-primary hover:text-primary/80">📋 复制</button>
        </div>
      ))}
    </div>
  )
}
