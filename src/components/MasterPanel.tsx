import { useCallback, useMemo, useState } from 'react'
import { useDirector } from '../context/DirectorContext'
import { usePromptDispatch, usePromptState } from '../context/PromptStateContext'
import { MASTER_TEMPLATE_MAP } from '../data/masterTemplates'
import { DEVICE_MAP } from '../data/devicePresets'
import { SCENE_MAP } from '../data/scenePacks'
import { LIGHT_MAP } from '../data/lightPacks'
import { STATE_MAP } from '../data/statePacks'
import { PARAMETER_MAP } from '../data/parameterPresets'
import { copyToClipboard } from '../utils/clipboard'
import { composePrompt } from '../core/promptComposer'

interface Props {
  onNavigateToAdvanced?: () => void
  onNavigateToQuick?: () => void
}

interface EditableSlotGroup {
  id: string
  label: string
  slots: string[]
}

interface PromptSection {
  id: string
  label: string
  text: string
}

interface MasterBase {
  imported: boolean
  sourceLabel: string
  templateId: string | null
  deviceId: string | null
  sceneId: string | null
  lightId: string | null
  stateIds: string[]
  paramId: string | null
  sections: PromptSection[]
  finalPositive: string
  finalNegative: string
  finalParams: string
}

const EDITABLE_SLOT_GROUPS: EditableSlotGroup[] = [
  { id: 'pose', label: '姿态 (Pose)', slots: ['posePrimary', 'bodyAngle', 'weightShift'] },
  { id: 'expression', label: '表情 (Expression)', slots: ['expressionPrimary', 'microExpr'] },
  { id: 'action', label: '动作 (Action)', slots: ['handTask', 'motionCue'] },
  { id: 'composition', label: '构图 (Composition)', slots: ['shotSize', 'cameraAngle', 'cameraCrop'] },
  { id: 'props', label: '道具 (Props)', slots: ['handheld'] },
  { id: 'gaze', label: '眼神 (Gaze)', slots: ['gaze'] },
]

const defaultMaster: MasterBase = {
  imported: false,
  sourceLabel: '',
  templateId: null,
  deviceId: null,
  sceneId: null,
  lightId: null,
  stateIds: [],
  paramId: null,
  sections: [],
  finalPositive: '',
  finalNegative: '',
  finalParams: '',
}

export default function MasterPanel({ onNavigateToAdvanced, onNavigateToQuick }: Props) {
  const { state, dispatch: promptDispatch } = usePromptState()
  const { selection, output, applyMasterTemplate, setDevice, setScene, setLight, toggleState, setParamPreset } = useDirector()
  const [master, setMaster] = useState<MasterBase>(defaultMaster)
  const [copied, setCopied] = useState(false)
  const [importedToAdvanced, setImportedToAdvanced] = useState(false)

  const template = master.templateId ? MASTER_TEMPLATE_MAP[master.templateId] : null
  const device = master.deviceId ? DEVICE_MAP[master.deviceId] : null
  const scene = master.sceneId ? SCENE_MAP[master.sceneId] : null
  const light = master.lightId ? LIGHT_MAP[master.lightId] : null
  const states = master.stateIds.map(id => STATE_MAP[id]).filter(Boolean)
  const param = master.paramId ? PARAMETER_MAP[master.paramId] : null

  function extractSectionsFromOutput(): PromptSection[] {
    return output.sections.map(s => ({
      id: s.id,
      label: s.label,
      text: s.text,
    }))
  }

  const handleImportFromQuick = useCallback(() => {
    const sections = extractSectionsFromOutput()
    setMaster({
      imported: true,
      sourceLabel: '快速生成',
      templateId: selection.directorTemplate,
      deviceId: selection.devicePreset,
      sceneId: selection.scenePack,
      lightId: selection.lightPack,
      stateIds: [...selection.statePacks],
      paramId: selection.parameterPreset,
      sections,
      finalPositive: output.positivePrompt,
      finalNegative: output.negativePrompt.join(', '),
      finalParams: output.parameterSuffix,
    })
  }, [selection, output])

  const handleImportFromAdvanced = useCallback(() => {
    const sections = extractSectionsFromOutput()
    setMaster({
      imported: true,
      sourceLabel: '高级编辑',
      templateId: selection.directorTemplate,
      deviceId: selection.devicePreset,
      sceneId: selection.scenePack,
      lightId: selection.lightPack,
      stateIds: [...selection.statePacks],
      paramId: selection.parameterPreset,
      sections,
      finalPositive: output.positivePrompt,
      finalNegative: output.negativePrompt.join(', '),
      finalParams: output.parameterSuffix,
    })
  }, [selection, output])

  const handleClear = useCallback(() => {
    setMaster(defaultMaster)
  }, [])

  const handleSectionChange = useCallback((sectionId: string, text: string) => {
    setMaster(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === sectionId ? { ...s, text } : s),
    }))
  }, [])

  const handleFinalPositiveChange = useCallback((text: string) => {
    setMaster(prev => ({ ...prev, finalPositive: text }))
  }, [])

  const handleFinalNegativeChange = useCallback((text: string) => {
    setMaster(prev => ({ ...prev, finalNegative: text }))
  }, [])

  const handleFinalParamsChange = useCallback((text: string) => {
    setMaster(prev => ({ ...prev, finalParams: text }))
  }, [])

  const handleCopyAll = useCallback(async () => {
    const text = [
      master.finalPositive,
      master.finalNegative ? `Negative prompt: ${master.finalNegative}` : '',
      master.finalParams || '',
    ].filter(Boolean).join('\n\n')
    const success = await copyToClipboard(text)
    if (!success) return
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }, [master])

  const handleImportToAdvanced = useCallback(() => {
    setImportedToAdvanced(true)
    setTimeout(() => setImportedToAdvanced(false), 1800)
    onNavigateToAdvanced?.()
  }, [onNavigateToAdvanced])

  const lockedLabel = master.templateId && template
    ? `模板: ${template.title}`
    : '未选择模板'

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card/80 p-6 shadow-sm backdrop-blur-sm lg:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-foreground">母版模式</h2>
            <p className="max-w-4xl text-base leading-7 text-muted-foreground">
              锁定骨架模板，开放姿态、表情、动作等细节供自由调整。分段编辑提示词，按类别精准修改。
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
            onClick={handleClear}
            className="rounded-xl border border-border bg-background/70 px-4 py-2.5 text-sm font-bold text-muted-foreground transition hover:border-red-300 hover:text-red-600"
          >
            清空
          </button>
        </div>
      </section>

      {master.imported && (
        <>
          <section className="rounded-2xl border border-border bg-card/80 p-5 shadow-sm lg:p-6">
            <div className="mb-4 flex items-center gap-3">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                已导入: {master.sourceLabel}
              </span>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm leading-7 text-foreground">
              <span className="font-bold">{lockedLabel}</span>
              {device && <span>设备: {device.labelZh}</span>}
              {scene && <span>场景: {scene.labelZh}</span>}
              {light && <span>灯光: {light.labelZh}</span>}
              {states.length > 0 && (
                <span>状态: {states.map(s => s.labelZh).join('、')}</span>
              )}
              {param && <span>参数: {param.labelZh}</span>}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card/80 p-5 shadow-sm lg:p-6">
            <h3 className="mb-1 text-lg font-black text-foreground">可编辑选项</h3>
            <p className="mb-5 text-sm leading-6 text-muted-foreground">
              选择要调整的类别，后续可配置具体可选值。当前为框架占位，等待填充母版词。
            </p>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {EDITABLE_SLOT_GROUPS.map(group => (
                <div key={group.id} className="rounded-2xl border border-dashed border-border bg-muted/20 p-4">
                  <div className="mb-3 text-sm font-bold text-foreground">{group.label}</div>
                  <div className="flex flex-wrap gap-2">
                    {group.slots.map(slot => (
                      <span
                        key={slot}
                        className="rounded-full border border-dashed border-border/60 px-3 py-1 text-xs text-muted-foreground/50"
                      >
                        {slot}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full border border-dashed border-border/30 px-3 py-1.5 text-xs text-muted-foreground/30 italic">
                      等待配置...
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card/80 p-5 shadow-sm lg:p-6">
            <h3 className="mb-1 text-lg font-black text-foreground">分段提示词</h3>
            <p className="mb-5 text-sm leading-6 text-muted-foreground">
              每个段落对应一个类别，可直接在文本框内修改。
            </p>

            <div className="space-y-4">
              {master.sections.map(section => (
                <div key={section.id} className="rounded-2xl border border-border bg-muted/20 p-4">
                  <div className="mb-2 text-sm font-bold text-foreground">
                    {section.label}
                  </div>
                  <textarea
                    value={section.text}
                    onChange={e => handleSectionChange(section.id, e.target.value)}
                    rows={2}
                    className="w-full resize-none rounded-xl border border-border bg-background p-3 text-sm leading-6 text-foreground outline-none transition focus:border-primary/40"
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card/80 p-5 shadow-sm lg:p-6">
            <h3 className="mb-1 text-lg font-black text-foreground">最终提示词</h3>
            <p className="mb-5 text-sm leading-6 text-muted-foreground">
              可直接在此编辑完整提示词，修改后会覆盖上方分段内容。
            </p>

            <div className="space-y-4">
              <div>
                <div className="mb-2 text-sm font-bold text-foreground">正向提示词 (Positive Prompt)</div>
                <textarea
                  value={master.finalPositive}
                  onChange={e => handleFinalPositiveChange(e.target.value)}
                  rows={6}
                  className="w-full resize-none rounded-2xl border border-border bg-background p-4 text-sm leading-7 text-foreground outline-none transition focus:border-primary/40"
                />
              </div>

              <div>
                <div className="mb-2 text-sm font-bold text-foreground">负面提示词 (Negative Prompt)</div>
                <textarea
                  value={master.finalNegative}
                  onChange={e => handleFinalNegativeChange(e.target.value)}
                  rows={3}
                  className="w-full resize-none rounded-2xl border border-border bg-background p-4 text-sm leading-7 text-foreground outline-none transition focus:border-primary/40"
                />
              </div>

              <div>
                <div className="mb-2 text-sm font-bold text-foreground">参数后缀 (Parameters)</div>
                <textarea
                  value={master.finalParams}
                  onChange={e => handleFinalParamsChange(e.target.value)}
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
        </>
      )}
    </div>
  )
}
