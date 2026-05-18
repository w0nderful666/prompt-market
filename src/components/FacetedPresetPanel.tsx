import { useCallback, useMemo, useState } from 'react'
import { useDirector } from '../context/DirectorContext'
import { usePromptDispatch, usePromptOutput, usePromptState } from '../context/PromptStateContext'
import { ALL_FACETS } from '../data/facetedPresets'
import type { FacetValue } from '../data/facetedPresets'
import { copyToClipboard } from '../utils/clipboard'
import { detectFacetConflicts, getSelectedCount, getSelectionSummary } from '../utils/facetedBuilder'
import type { FacetConflict } from '../utils/facetedBuilder'

const SOURCE_LABELS: Record<string, string> = {
  director: '来自快速生成的模板结果',
  advanced: '当前内容主要由高级编辑控制',
  variant: '当前内容叠加了变体姿态模板',
  mixed: '快速生成与高级编辑正在联动',
}

function getAllValues(): FacetValue[] {
  return ALL_FACETS.flatMap(facet => facet.values || [])
}

function splitNegativeInput(value: string) {
  return value
    .split(/[,\n，、；;]/)
    .map(item => item.trim())
    .filter(Boolean)
}

export default function FacetedPresetPanel({ onNavigateToQuick }: { onNavigateToQuick?: () => void }) {
  const { sharedFacetSelections, setSharedFacetSelections, syncFromPresets } = useDirector()
  const promptState = usePromptState()
  const dispatch = usePromptDispatch()
  const output = usePromptOutput()

  const [activeFacet, setActiveFacet] = useState(ALL_FACETS[0]?.id ?? 'image')
  const [conflicts, setConflicts] = useState<FacetConflict[]>([])
  const [copied, setCopied] = useState(false)
  const [importText, setImportText] = useState('')

  const allValues = useMemo(() => getAllValues(), [])
  const counts = useMemo(() => getSelectedCount(sharedFacetSelections), [sharedFacetSelections])
  const summary = useMemo(() => getSelectionSummary(sharedFacetSelections), [sharedFacetSelections])
  const currentFacet = useMemo(() => ALL_FACETS.find(facet => facet.id === activeFacet) ?? ALL_FACETS[0], [activeFacet])
  const importMeta = promptState.state.advanced.importMeta

  const toggleValue = useCallback((slotId: string, valueId: string) => {
    const slot = ALL_FACETS.flatMap(facet => facet.slots).find(item => item.id === slotId)
    if (!slot) return

    setSharedFacetSelections(previous => {
      const next = { ...previous }
      if (slot.mode === 'single') {
        next[slotId] = previous[slotId] === valueId ? '' : valueId
        return next
      }

      const current = Array.isArray(previous[slotId]) ? [...(previous[slotId] as string[])] : []
      const exists = current.includes(valueId)
      const nextValues = exists ? current.filter(item => item !== valueId) : [...current, valueId]
      next[slotId] = slot.maxSelect ? nextValues.slice(0, slot.maxSelect) : nextValues
      return next
    })
  }, [setSharedFacetSelections])

  const setOutputLanguage = useCallback((value: 'lang_zh' | 'lang_en' | 'lang_mix') => {
    setSharedFacetSelections(previous => ({ ...previous, outputLang: value }))
  }, [setSharedFacetSelections])

  const clearAll = useCallback(() => {
    setSharedFacetSelections({ outputLang: sharedFacetSelections.outputLang || 'lang_zh' })
    dispatch({ type: 'SET_FREEFORM_POSITIVE', value: '' })
    dispatch({ type: 'SET_FREEFORM_NEGATIVE', value: [] })
    setConflicts([])
  }, [dispatch, setSharedFacetSelections, sharedFacetSelections.outputLang])

  const copyPrompt = useCallback(async () => {
    const text = [
      output.positivePrompt,
      output.negativePrompt.length > 0 ? `Negative: ${output.negativePrompt.join(', ')}` : '',
      output.parameterSuffix,
    ].filter(Boolean).join('\n\n')

    const success = await copyToClipboard(text)
    if (!success) return

    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }, [output])

  const isSelected = useCallback((slotId: string, valueId: string) => {
    const value = sharedFacetSelections[slotId]
    if (typeof value === 'string') return value === valueId
    if (Array.isArray(value)) return value.includes(valueId)
    return false
  }, [sharedFacetSelections])

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-amber-300/70 bg-amber-50/90 px-5 py-4 shadow-sm dark:border-amber-700 dark:bg-amber-900/20 lg:px-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-black text-amber-900 dark:text-amber-200">高级编辑联动模式</h2>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              {SOURCE_LABELS[promptState.state.source] ?? SOURCE_LABELS.advanced}
              {promptState.state.variants.appliedVariantId ? ' · 已应用一个变体模板' : ''}
            </p>
          </div>

          {onNavigateToQuick && (
            <button
              onClick={() => {
                syncFromPresets()
                onNavigateToQuick()
              }}
              className="rounded-xl bg-amber-200 px-4 py-2.5 text-sm font-bold text-amber-900 transition hover:bg-amber-300 dark:bg-amber-800 dark:text-amber-100"
            >
              返回快速生成
            </button>
          )}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(420px,0.95fr)]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card/80 p-5 shadow-sm lg:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-foreground">结构化高级编辑</h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  已填写 {counts.filled}/{counts.total} 个槽位
                  {summary ? ` · ${summary}` : ' · 还没有勾选任何结构化词条'}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setConflicts(detectFacetConflicts(sharedFacetSelections))}
                  className="rounded-xl border border-border px-4 py-2 text-sm font-bold text-foreground transition hover:border-primary/40 hover:text-primary"
                >
                  检查冲突
                </button>
                <button
                  onClick={clearAll}
                  className="rounded-xl border border-border px-4 py-2 text-sm font-bold text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  清空高级编辑
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:p-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="text-lg font-black text-foreground">粘贴提示词并拆解</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  支持中文、英文和中英混排。可识别内容会自动回填到高级编辑，识别不了的内容会留在自由补充区。
                </p>
              </div>
              <button
                onClick={() => dispatch({ type: 'IMPORT_ADVANCED_PROMPT', text: importText })}
                className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
              >
                解析并导入
              </button>
            </div>

            <textarea
              value={importText}
              onChange={event => setImportText(event.target.value)}
              className="mt-4 min-h-[180px] w-full rounded-2xl border border-border bg-muted/40 p-4 text-sm leading-7 text-foreground outline-none transition focus:border-primary/40"
              placeholder="例如：咖啡馆，窗边光，回眸，胶片感，负面提示词：手变形，塑料皮肤，--ar 3:4"
            />

            {importMeta && (
              <div className="mt-4 space-y-4 rounded-2xl border border-border bg-muted/40 p-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-xl bg-background/80 p-3">
                    <div className="text-xs font-bold text-foreground">命中结构化</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {importMeta.matchedValues.length === 0 && (
                        <span className="text-sm text-muted-foreground">这次还没有命中结构化词条</span>
                      )}
                      {importMeta.matchedValues.map(match => (
                        <span key={`${match.slotId}-${match.valueId}`} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                          {match.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl bg-background/80 p-3">
                    <div className="text-xs font-bold text-foreground">来源信息</div>
                    <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <div>{importMeta.sourceKind === 'externalLibraryImport' ? '外挂词库导入' : '手动粘贴导入'}</div>
                      {importMeta.sourceLabel && <div>标题：{importMeta.sourceLabel}</div>}
                      {importMeta.sourceRepo && <div>仓库：{importMeta.sourceRepo}</div>}
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 lg:grid-cols-3">
                  <div className="rounded-xl bg-background/80 p-3">
                    <div className="text-xs font-bold text-foreground">未识别正向</div>
                    <div className="mt-2 text-sm leading-7 text-muted-foreground">
                      {importMeta.unmatchedPositive.length > 0 ? importMeta.unmatchedPositive.join('，') : '无'}
                    </div>
                  </div>

                  <div className="rounded-xl bg-background/80 p-3">
                    <div className="text-xs font-bold text-foreground">负面词</div>
                    <div className="mt-2 text-sm leading-7 text-muted-foreground">
                      {importMeta.unmatchedNegative.length > 0 ? importMeta.unmatchedNegative.join('，') : '无'}
                    </div>
                  </div>

                  <div className="rounded-xl bg-background/80 p-3">
                    <div className="text-xs font-bold text-foreground">参数后缀</div>
                    <div className="mt-2 text-sm leading-7 text-muted-foreground">
                      {importMeta.parameterSuffix || '无'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:p-6">
            <div className="mb-4 flex flex-wrap gap-2">
              {ALL_FACETS.map(facet => (
                <button
                  key={facet.id}
                  onClick={() => setActiveFacet(facet.id)}
                  className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                    activeFacet === facet.id
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <span className="mr-2">{facet.icon}</span>
                  {facet.label}
                </button>
              ))}
            </div>

            {currentFacet && (
              <div className="space-y-5">
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-foreground">
                    <span className="mr-2">{currentFacet.icon}</span>
                    {currentFacet.label}
                  </h3>
                  <p className="text-sm leading-6 text-muted-foreground">{currentFacet.description}</p>
                </div>

                {currentFacet.slots.map(slot => {
                  const slotValues = allValues.filter(value => value.slot === slot.id)
                  const selected = sharedFacetSelections[slot.id]
                  const selectedCount = Array.isArray(selected) ? selected.length : selected ? 1 : 0

                  return (
                    <div key={slot.id} className="rounded-2xl border border-border bg-muted/20 p-4">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className="text-base">{slot.icon}</span>
                        <span className="text-sm font-bold text-foreground">{slot.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {slot.mode === 'single'
                            ? '单选'
                            : `多选${slot.maxSelect ? ` · 最多 ${slot.maxSelect} 项` : ''}`}
                        </span>
                        <span className="ml-auto text-xs font-bold text-primary">
                          已选 {selectedCount}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {slotValues.map(value => (
                          <button
                            key={value.id}
                            onClick={() => toggleValue(slot.id, value.id)}
                            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                              isSelected(slot.id, value.id)
                                ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                                : 'border-border bg-background/70 text-muted-foreground hover:border-primary/40 hover:text-primary'
                            }`}
                          >
                            {value.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          {conflicts.length > 0 && (
            <section className="rounded-2xl border border-amber-300 bg-amber-50 p-5 shadow-sm dark:border-amber-700 dark:bg-amber-900/20 lg:p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-black text-amber-900 dark:text-amber-200">发现 {conflicts.length} 个冲突或提醒</h3>
                <button onClick={() => setConflicts([])} className="text-sm font-bold text-amber-700 dark:text-amber-300">
                  关闭
                </button>
              </div>
              <div className="space-y-2">
                {conflicts.map((conflict, index) => (
                  <div key={`${conflict.slot}-${index}`} className="rounded-xl bg-background/80 px-4 py-3 text-sm text-foreground">
                    <span className={`mr-3 rounded-full px-2 py-1 text-xs font-bold ${conflict.type === 'hard' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'}`}>
                      {conflict.type === 'hard' ? '禁止组合' : '注意'}
                    </span>
                    {conflict.message}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-black text-foreground">输出模式</h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  标签模式适合直接拼接给模型，自然语言模式更适合阅读和二次微调。
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  onClick={() => dispatch({ type: 'SET_PROMPT_STYLE', value: 'tag' })}
                  className={`rounded-2xl border px-4 py-4 text-left transition ${
                    promptState.state.advanced.promptStyle === 'tag'
                      ? 'border-primary bg-primary/10 text-foreground'
                      : 'border-border bg-background/70 text-muted-foreground hover:border-primary/40'
                  }`}
                >
                  <div className="text-base font-black">标签模式</div>
                  <div className="mt-1 text-sm leading-6">按类别拼接成可复制标签串，适合快速投喂模型。</div>
                </button>

                <button
                  onClick={() => dispatch({ type: 'SET_PROMPT_STYLE', value: 'natural' })}
                  className={`rounded-2xl border px-4 py-4 text-left transition ${
                    promptState.state.advanced.promptStyle === 'natural'
                      ? 'border-primary bg-primary/10 text-foreground'
                      : 'border-border bg-background/70 text-muted-foreground hover:border-primary/40'
                  }`}
                >
                  <div className="text-base font-black">自然语言</div>
                  <div className="mt-1 text-sm leading-6">按中文句式或英文语句组织，更适合阅读、微调和回改。</div>
                </button>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-bold text-foreground">输出语言</div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'lang_zh', label: '中文提示词' },
                    { id: 'lang_en', label: '英文提示词' },
                    { id: 'lang_mix', label: '中英混合' },
                  ].map(option => (
                    <button
                      key={option.id}
                      onClick={() => setOutputLanguage(option.id as 'lang_zh' | 'lang_en' | 'lang_mix')}
                      className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                        sharedFacetSelections.outputLang === option.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-foreground">结构化分段预览</h3>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                {promptState.state.advanced.promptStyle === 'natural' ? '自然语言导出' : '标签模式导出'}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {output.sections.map(section => (
                <div key={section.id} className="rounded-2xl border border-border bg-muted/30 p-4">
                  <div className="text-sm font-bold text-foreground">{section.label}</div>
                  <div className="mt-1 text-sm leading-7 text-muted-foreground">{section.text}</div>
                </div>
              ))}
              {output.sections.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                  还没有足够的结构化内容，先在左侧选择模板词条，或者粘贴一段提示词进来。
                </div>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-foreground">
                最终导出结果 · {promptState.state.advanced.promptStyle === 'natural' ? '自然语言' : '标签模式'}
              </h3>
              <button
                onClick={copyPrompt}
                className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
              >
                {copied ? '已复制全部提示词' : '复制全部提示词'}
              </button>
            </div>

            <textarea
              value={output.positivePrompt}
              readOnly
              rows={8}
              className="mt-4 w-full resize-none rounded-2xl border border-border bg-muted/40 p-4 text-sm leading-7 text-foreground outline-none"
            />

            <div className="mt-4 space-y-3">
              <div>
                <div className="mb-2 text-sm font-bold text-foreground">自由补充正向</div>
                <textarea
                  value={promptState.state.advanced.freeformPositive}
                  onChange={event => dispatch({ type: 'SET_FREEFORM_POSITIVE', value: event.target.value })}
                  rows={4}
                  className="w-full resize-none rounded-2xl border border-border bg-muted/40 p-4 text-sm leading-7 text-foreground outline-none"
                  placeholder="识别不了但你又想保留的长句、细节或补充描述，可以放在这里。"
                />
              </div>

              <div>
                <div className="mb-2 text-sm font-bold text-foreground">补充负面词</div>
                <textarea
                  value={promptState.state.advanced.freeformNegative.join('，')}
                  onChange={event => dispatch({ type: 'SET_FREEFORM_NEGATIVE', value: splitNegativeInput(event.target.value) })}
                  rows={4}
                  className="w-full resize-none rounded-2xl border border-border bg-muted/40 p-4 text-sm leading-7 text-foreground outline-none"
                  placeholder="手动补充 negative prompt，用逗号、顿号或换行分隔。"
                />
              </div>

              <div>
                <div className="mb-2 text-sm font-bold text-foreground">最终 Negative Prompt</div>
                <textarea
                  value={output.negativePrompt.join('，')}
                  readOnly
                  rows={4}
                  className="w-full resize-none rounded-2xl border border-border bg-muted/40 p-4 text-sm leading-7 text-foreground outline-none"
                />
              </div>

              <div>
                <div className="mb-2 text-sm font-bold text-foreground">参数后缀</div>
                <textarea
                  value={output.parameterSuffix || '--ar 4:5'}
                  readOnly
                  rows={3}
                  className="w-full resize-none rounded-2xl border border-border bg-muted/40 p-4 text-sm leading-7 text-foreground outline-none"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
