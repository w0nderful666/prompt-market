import { useCallback, useState } from 'react'
import { usePromptOutput } from '../context/PromptStateContext'
import { copyToClipboard } from '../utils/clipboard'

interface Props {
  onNavigateToAdvanced?: () => void
  onNavigateToQuick?: () => void
}

interface PromptSection {
  id: string
  label: string
  text: string
}

let sectionCounter = 0
function nextSectionId() {
  sectionCounter += 1
  return `sec-${sectionCounter}`
}

const DEFAULT_SECTIONS: PromptSection[] = [
  { id: nextSectionId(), label: '主体 / 人物 (Subject)', text: '' },
  { id: nextSectionId(), label: '场景 / 背景 (Scene)', text: '' },
  { id: nextSectionId(), label: '光线 / 氛围 (Light)', text: '' },
  { id: nextSectionId(), label: '镜头 / 构图 (Camera)', text: '' },
  { id: nextSectionId(), label: '风格 / 质感 (Style)', text: '' },
  { id: nextSectionId(), label: '姿态 / 动作 (Pose)', text: '' },
  { id: nextSectionId(), label: '情绪 / 表情 (Mood)', text: '' },
]

export default function MasterPanel({ onNavigateToAdvanced }: Props) {
  const output = usePromptOutput()
  const [sections, setSections] = useState<PromptSection[]>(DEFAULT_SECTIONS)
  const [importText, setImportText] = useState('')
  const [finalPositive, setFinalPositive] = useState('')
  const [finalNegative, setFinalNegative] = useState('')
  const [finalParams, setFinalParams] = useState('')
  const [copied, setCopied] = useState(false)
  const [importedToAdvanced, setImportedToAdvanced] = useState(false)

  const handleImportFromQuick = useCallback(() => {
    if (output.sections.length > 0) {
      setSections(output.sections.map(s => ({ id: nextSectionId(), label: s.label, text: s.text })))
    }
    setFinalPositive(output.positivePrompt)
    setFinalNegative(output.negativePrompt.join(', '))
    setFinalParams(output.parameterSuffix)
  }, [output])

  const handleImportFromAdvanced = useCallback(() => {
    if (output.sections.length > 0) {
      setSections(output.sections.map(s => ({ id: nextSectionId(), label: s.label, text: s.text })))
    }
    setFinalPositive(output.positivePrompt)
    setFinalNegative(output.negativePrompt.join(', '))
    setFinalParams(output.parameterSuffix)
  }, [output])

  const handleImportDecomposed = useCallback(() => {
    if (output.sections.length > 0) {
      setSections(output.sections.map(s => ({ id: nextSectionId(), label: s.label, text: s.text })))
    }
    setFinalPositive(output.positivePrompt)
    setFinalNegative(output.negativePrompt.join(', '))
    setFinalParams(output.parameterSuffix)
  }, [output])

  const handleDecomposeText = useCallback(() => {
    if (!importText.trim()) return
    const hasNegative = importText.includes('--negative')
    const hasParams = /--\w+/.test(importText)
    const parts = importText.split('\n').filter(Boolean)
    if (parts.length <= 1) {
      const commaParts = importText.split(',').filter(Boolean)
      if (commaParts.length > 1) {
        const grouped = Math.ceil(commaParts.length / 3)
        const newSections = []
        for (let i = 0; i < grouped; i++) {
          const start = i * 3
          const chunk = commaParts.slice(start, start + 3).join(', ')
          const label = DEFAULT_SECTIONS[i]?.label ?? `分段 ${i + 1}`
          newSections.push({ id: nextSectionId(), label, text: chunk.trim() })
        }
        setSections(prev => {
          const existing = prev.filter(s => s.text)
          return newSections.length > 0 ? newSections : existing
        })
      } else {
        setSections(prev => {
          const updated = [...prev]
          if (updated.length > 0) updated[0] = { ...updated[0], text: importText.trim() }
          return updated
        })
      }
    } else {
      const newSections = parts.map((part, i) => ({
        id: nextSectionId(),
        label: DEFAULT_SECTIONS[i]?.label ?? `分段 ${i + 1}`,
        text: part.trim(),
      }))
      setSections(newSections)
    }
    setFinalPositive(importText.trim())
  }, [importText])

  const handleSectionChange = useCallback((sectionId: string, text: string) => {
    setSections(prev => prev.map(s => s.id === sectionId ? { ...s, text } : s))
  }, [])

  const handleAddSection = useCallback(() => {
    setSections(prev => [...prev, { id: nextSectionId(), label: `分段 ${prev.length + 1}`, text: '' }])
  }, [])

  const handleRemoveSection = useCallback((sectionId: string) => {
    setSections(prev => prev.filter(s => s.id !== sectionId))
  }, [])

  const handleSectionLabelChange = useCallback((sectionId: string, label: string) => {
    setSections(prev => prev.map(s => s.id === sectionId ? { ...s, label } : s))
  }, [])

  const combineSections = useCallback(() => {
    const texts = sections.map(s => s.text).filter(Boolean)
    if (texts.length > 0) {
      setFinalPositive(texts.join(', '))
    }
  }, [sections])

  const handleCopyAll = useCallback(async () => {
    const text = [
      finalPositive,
      finalNegative ? `Negative prompt: ${finalNegative}` : '',
      finalParams || '',
    ].filter(Boolean).join('\n\n')
    const success = await copyToClipboard(text)
    if (!success) return
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }, [finalPositive, finalNegative, finalParams])

  const handleImportToAdvanced = useCallback(() => {
    setImportedToAdvanced(true)
    setTimeout(() => setImportedToAdvanced(false), 1800)
    onNavigateToAdvanced?.()
  }, [onNavigateToAdvanced])

  const handleClear = useCallback(() => {
    setSections(DEFAULT_SECTIONS.map(s => ({ ...s, text: '', id: nextSectionId() })))
    setImportText('')
    setFinalPositive('')
    setFinalNegative('')
    setFinalParams('')
  }, [])

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card/80 p-6 shadow-sm backdrop-blur-sm lg:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-foreground">母版模式</h2>
            <p className="max-w-4xl text-base leading-7 text-muted-foreground">
              自由分段编辑提示词，每段对应一个类别。可从快速生成、高级编辑或已拆解的提示词导入。
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={handleImportFromQuick}
            className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
          >
            从快速生成导入
          </button>
          <button
            onClick={handleImportFromAdvanced}
            className="rounded-xl border border-border bg-background/70 px-4 py-2.5 text-sm font-bold text-foreground transition hover:border-primary/30"
          >
            从高级编辑导入
          </button>
          <button
            onClick={handleImportDecomposed}
            className="rounded-xl border border-border bg-background/70 px-4 py-2.5 text-sm font-bold text-foreground transition hover:border-primary/30"
          >
            从拆解提示词导入
          </button>
          <button
            onClick={handleClear}
            className="rounded-xl border border-border bg-background/70 px-4 py-2.5 text-sm font-bold text-muted-foreground transition hover:border-red-300 hover:text-red-600"
          >
            清空
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card/80 p-5 shadow-sm lg:p-6">
        <h3 className="mb-1 text-lg font-black text-foreground">粘贴提示词直接拆解</h3>
        <p className="mb-4 text-sm leading-6 text-muted-foreground">
          粘贴一条完整的提示词，点击「拆解到分段」自动分配到各段落中。
        </p>
        <textarea
          value={importText}
          onChange={e => setImportText(e.target.value)}
          rows={4}
          placeholder="在此粘贴完整提示词..."
          className="w-full resize-none rounded-2xl border border-border bg-background p-4 text-sm leading-7 text-foreground outline-none transition focus:border-primary/40"
        />
        <button
          onClick={handleDecomposeText}
          className="mt-4 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
        >
          拆解到分段
        </button>
      </section>

      <section className="rounded-2xl border border-border bg-card/80 p-5 shadow-sm lg:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-foreground">分段提示词</h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              每个段落可自由编辑标签和内容。点击「合并到最终提示词」将所有段落组合。
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddSection}
              className="rounded-xl border border-border px-3 py-1.5 text-xs font-bold text-foreground transition hover:border-primary/30"
            >
              + 添加分段
            </button>
            <button
              onClick={combineSections}
              className="rounded-xl border border-border px-3 py-1.5 text-xs font-bold text-foreground transition hover:border-primary/30"
            >
              合并到最终提示词
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {sections.map(section => (
            <div key={section.id} className="rounded-2xl border border-border bg-muted/20 p-4">
              <div className="mb-2 flex items-center gap-2">
                <input
                  value={section.label}
                  onChange={e => handleSectionLabelChange(section.id, e.target.value)}
                  className="flex-1 rounded-lg border border-border bg-background px-3 py-1 text-sm font-bold text-foreground outline-none transition focus:border-primary/40"
                />
                <button
                  onClick={() => handleRemoveSection(section.id)}
                  className="rounded-lg border border-border px-2 py-1 text-xs text-muted-foreground transition hover:border-red-300 hover:text-red-500"
                >
                  删除
                </button>
              </div>
              <textarea
                value={section.text}
                onChange={e => handleSectionChange(section.id, e.target.value)}
                rows={3}
                placeholder="在此输入该分段内容..."
                className="w-full resize-none rounded-xl border border-border bg-background p-3 text-sm leading-6 text-foreground outline-none transition focus:border-primary/40"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card/80 p-5 shadow-sm lg:p-6">
        <h3 className="mb-1 text-lg font-black text-foreground">最终提示词</h3>
        <p className="mb-5 text-sm leading-6 text-muted-foreground">
          可直接在此编辑完整提示词，自由修改任意内容。
        </p>

        <div className="space-y-4">
          <div>
            <div className="mb-2 text-sm font-bold text-foreground">正向提示词 (Positive Prompt)</div>
            <textarea
              value={finalPositive}
              onChange={e => setFinalPositive(e.target.value)}
              rows={6}
              className="w-full resize-none rounded-2xl border border-border bg-background p-4 text-sm leading-7 text-foreground outline-none transition focus:border-primary/40"
            />
          </div>

          <div>
            <div className="mb-2 text-sm font-bold text-foreground">负面提示词 (Negative Prompt)</div>
            <textarea
              value={finalNegative}
              onChange={e => setFinalNegative(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-2xl border border-border bg-background p-4 text-sm leading-7 text-foreground outline-none transition focus:border-primary/40"
            />
          </div>

          <div>
            <div className="mb-2 text-sm font-bold text-foreground">参数后缀 (Parameters)</div>
            <textarea
              value={finalParams}
              onChange={e => setFinalParams(e.target.value)}
              rows={2}
              className="w-full resize-none rounded-2xl border border-border bg-background p-4 text-sm leading-7 text-foreground outline-none transition focus:border-primary/40 font-mono"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={handleCopyAll}
            className="rounded-xl border border-border px-4 py-2.5 text-sm font-bold text-foreground transition hover:border-primary/40 hover:text-primary"
          >
            {copied ? '已复制' : '复制全部'}
          </button>
          <button
            onClick={handleImportToAdvanced}
            className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
          >
            {importedToAdvanced ? '已导入' : '导入到高级编辑'}
          </button>
        </div>
      </section>
    </div>
  )
}
