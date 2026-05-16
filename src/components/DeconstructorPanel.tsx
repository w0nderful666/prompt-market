import { useState, useCallback } from 'react'
import { useDirector } from '../context/DirectorContext'
import { deconstructPrompt } from '../utils/deconstructor'

const fieldLabels: Record<string, string> = {
  subject: '主体设定', scene: '场景环境', composition: '构图与镜头',
  lighting: '光线与色彩', camera: '摄影/画面质感', expression: '表情与状态',
  face: '脸部与妆容', hair: '发型与细节', body: '身体与姿势',
  clothing: '服装与配件', atmosphere: '整体氛围', ratio: '比例/尺寸',
  avoid: '避免项', mustKeep: '必须保留', caption: 'Caption 感',
  background: '背景元素', depthOfField: '景深效果', makeup: '妆容细节',
}

export default function DeconstructorPanel() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<Record<string, string> | null>(null)
  const [isDeconstructing, setIsDeconstructing] = useState(false)
  const { setDirectorData } = useDirector()

  const deconstruct = useCallback(() => {
    if (!input.trim()) return
    setIsDeconstructing(true)
    setTimeout(() => {
      const fields = deconstructPrompt(input)
      setResult(Object.keys(fields).length > 0 ? fields : null)
      setIsDeconstructing(false)
    }, 100)
  }, [input])

  function applyToDirector() {
    if (result) {
      setDirectorData(result)
    }
  }

  return (
    <div>
      <h2 className="mb-1 text-lg font-black text-foreground">🔍 提示词拆解</h2>
      <p className="mb-4 text-sm text-muted-foreground">粘贴完整提示词，自动拆解并归类到 Director 各模块</p>

      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <div className="rounded-lg border bg-card p-4">
          <textarea value={input} onChange={e => setInput(e.target.value)}
            className="mb-2 w-full resize-none rounded-lg border border-border bg-muted p-3 text-sm text-foreground outline-none"
            rows={6} placeholder="粘贴完整提示词，系统会自动拆解并归类到各模块..." />
          <div className="flex gap-2">
            <button onClick={deconstruct} disabled={!input.trim() || isDeconstructing}
              className="flex-1 rounded-lg bg-primary py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition disabled:opacity-40">
              {isDeconstructing ? '⏳ 拆解中...' : '🔍 开始拆解'}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {result && (
            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="text-xs font-bold text-foreground mb-3">📊 拆解结果</h3>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {Object.entries(result).map(([key, val]) => (
                  <div key={key} className="rounded bg-muted/50 px-3 py-2">
                    <span className="mr-2 text-[10px] font-bold text-muted-foreground uppercase">{fieldLabels[key] || key}</span>
                    <span className="text-xs text-foreground/80">{val}</span>
                  </div>
                ))}
              </div>
              <button onClick={applyToDirector}
                className="mt-3 w-full rounded-lg bg-primary py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition">
                📥 填充到 Director
              </button>
            </div>
          )}

          <div className="rounded-lg border border-dashed border-border bg-card/50 p-4">
            <h4 className="text-xs font-bold text-foreground mb-2">💡 支持拆解的类别</h4>
            <div className="flex flex-wrap gap-1">
              {Object.keys(fieldLabels).filter(k => k !== 'ratio').map(k => (
                <span key={k} className="rounded bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">{fieldLabels[k]}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
