import { useState, useMemo, useCallback, useRef } from 'react'
import { useDirector } from '../context/DirectorContext'
import { usePromptDispatch } from '../context/PromptStateContext'
import { masterTemplates, MASTER_TEMPLATE_MAP } from '../data/masterTemplates'
import { DEVICE_PRESETS } from '../data/devicePresets'
import { SCENE_PACKS } from '../data/scenePacks'
import { LIGHT_PACKS } from '../data/lightPacks'
import { STATE_PACKS } from '../data/statePacks'
import { PARAMETER_PRESETS } from '../data/parameterPresets'
import { copyToClipboard } from '../utils/clipboard'
import { generatePoseVariants } from '../core/variantComposer'
import type { DirectorTemplate, PoseVariant } from '../core/types'

export default function DirectorPanel({ onNavigateToAdvanced }: { onNavigateToAdvanced?: () => void }) {
  const {
    selection, output,
    applyMasterTemplate, setDevice, setScene, setLight, toggleState,
    setParamPreset, clearAll, syncToPresets,
  } = useDirector()
  const [activeSection, setActiveSection] = useState<string>('templates')
  const [copied, setCopied] = useState<'positive' | 'negative' | 'all' | null>(null)
  const [generated, setGenerated] = useState(false)
  const outputRef = useRef<HTMLDivElement>(null)

  const sections = [
    { id: 'templates', label: '🎬 模板', icon: '🎬' },
    { id: 'device', label: '📱 设备', icon: '📱' },
    { id: 'scene', label: '🏠 场景', icon: '🏠' },
    { id: 'light', label: '💡 光线', icon: '💡' },
    { id: 'state', label: '🧍 状态', icon: '🧍' },
    { id: 'param', label: '⚙️ 参数', icon: '⚙️' },
  ]

  const selectedTpl: DirectorTemplate | null = selection.directorTemplate
    ? MASTER_TEMPLATE_MAP[selection.directorTemplate] ?? null
    : null

  const handleCopy = async (text: string, type: 'positive' | 'negative' | 'all') => {
    const ok = await copyToClipboard(text)
    if (ok) {
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    }
  }

  const handleGenerate = () => {
    setGenerated(true)
    setTimeout(() => setGenerated(false), 2000)
    outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleEnterAdvanced = () => {
    syncToPresets()
    onNavigateToAdvanced?.()
  }

  return (
    <div className="space-y-4">
      {/* Nav */}
      <div className="flex gap-1 flex-wrap rounded-lg border border-border bg-card/70 p-2">
        {sections.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              activeSection === s.id ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted'
            }`}>
            {s.icon} {s.label}
          </button>
        ))}
        <div className="ml-auto flex gap-1">
          {onNavigateToAdvanced && (
            <button onClick={handleEnterAdvanced}
              className="rounded-lg px-3 py-1.5 text-xs font-bold bg-amber-100 text-amber-800 hover:bg-amber-200 transition dark:bg-amber-900/30 dark:text-amber-300">
              🔧 进入高级编辑
            </button>
          )}
          <button onClick={clearAll} className="rounded-lg px-3 py-1.5 text-xs font-bold bg-muted text-muted-foreground hover:bg-muted/80 transition">🗑️ 清空</button>
        </div>
      </div>

      {/* Active summary */}
      {selectedTpl && (
        <div className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-xs text-foreground">
          📌 当前模板：<span className="font-bold">{selectedTpl.title}</span>
          <span className="text-muted-foreground"> — {selectedTpl.description}</span>
        </div>
      )}

      {/* Section content */}
      <div className="rounded-lg border border-border bg-card p-4">
        {activeSection === 'templates' && <TemplateSection />}
        {activeSection === 'device' && <DeviceSection />}
        {activeSection === 'scene' && <SceneSection />}
        {activeSection === 'light' && <LightSection />}
        {activeSection === 'state' && <StateSection />}
        {activeSection === 'param' && <ParamSection />}
      </div>

      {/* Output Preview */}
      <div ref={outputRef} className="rounded-xl border border-border bg-card/80 backdrop-blur-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-foreground">📝 输出预览</h3>
            <button onClick={handleGenerate}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold transition active:scale-[0.97] ${
                generated
                  ? 'bg-green-500 text-white scale-105'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}>
              {generated ? '✅ 已生成' : '🪄 生成'}
            </button>
          </div>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
            {output.positivePrompt ? (generated ? '已生成' : '实时预览中') : '请选择模板'}
          </span>
        </div>

        {/* 1. Positive Prompt */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-foreground">✅ 正向提示词</span>
            <button onClick={() => handleCopy(output.positivePrompt, 'positive')}
              className="rounded px-2 py-0.5 text-[10px] font-bold bg-muted text-muted-foreground hover:bg-muted/80 transition">
              {copied === 'positive' ? '✅ 已复制' : '📋 复制'}
            </button>
          </div>
          <textarea value={output.positivePrompt} readOnly
            className="w-full resize-none rounded-lg border border-border bg-muted p-3 text-xs leading-relaxed text-foreground outline-none"
            rows={4} placeholder="选择模板后自动生成正向提示词..." />
        </div>

        {/* 2. Negative Prompt */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-foreground">🚫 Diff / Negative Prompt</span>
            <button onClick={() => handleCopy(output.negativePrompt.join(', '), 'negative')}
              className="rounded px-2 py-0.5 text-[10px] font-bold bg-muted text-muted-foreground hover:bg-muted/80 transition">
              {copied === 'negative' ? '✅ 已复制' : '📋 复制'}
            </button>
          </div>
          <textarea value={output.negativePrompt.join(', ')} readOnly
            className="w-full resize-none rounded-lg border border-border bg-muted p-3 text-xs leading-relaxed text-foreground outline-none"
            rows={3} placeholder="自动生成负面提示词..." />
        </div>

        {/* 3. Parameter suffix */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-foreground">⚙️ 参数后缀</span>
            <button onClick={() => handleCopy(output.parameterSuffix, 'all')}
              className="rounded px-2 py-0.5 text-[10px] font-bold bg-muted text-muted-foreground hover:bg-muted/80 transition">
              {copied === 'all' ? '✅ 已复制' : '📋 复制'}
            </button>
          </div>
          <div className="rounded-lg border border-border bg-muted p-3 text-xs font-mono text-foreground">
            {output.parameterSuffix || '--ar 4:5'}
          </div>
        </div>

        {/* 4. Auto-enabled packs */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-foreground">🛡️ 自动启用修复包</span>
          </div>
          {output.autoEnabledPacks.length === 0 ? (
            <p className="text-xs text-muted-foreground">未触发自动修复包</p>
          ) : (
            <div className="space-y-1">
              {output.autoEnabledPacks.map(p => (
                <div key={p.id} className="flex items-start gap-2 rounded bg-green-50 px-3 py-2 text-[10px] text-green-800 dark:bg-green-900/20 dark:text-green-300">
                  <span className="mt-0.5 shrink-0">🛡️</span>
                  <div>
                    <span className="font-bold">{p.label}</span>
                    <span className="text-green-600 dark:text-green-400"> — {p.reason}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Copy all button */}
        <button onClick={async () => {
          const full = `正向提示词：\n${output.positivePrompt}\n\n负面提示词：\n${output.negativePrompt.join(', ')}\n\n参数：${output.parameterSuffix}`
          const ok = await copyToClipboard(full)
          if (ok) { setCopied('all'); setTimeout(() => setCopied(null), 2000) }
        }}
          className="w-full rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition active:scale-[0.97]">
          {copied === 'all' ? '✅ 已复制全部' : '📋 复制全部提示词'}
        </button>
      </div>
    </div>
  )
}

function SelectorGrid<T extends { id: string; labelZh: string }>({
  items, selected, onSelect, columns = 4, emptyLabel = '',
}: {
  items: T[]; selected: string | null; onSelect: (id: string | null) => void; columns?: number; emptyLabel?: string
}) {
  return (
    <div>
      {emptyLabel && <p className="text-xs text-muted-foreground mb-3">{emptyLabel}</p>}
      <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-${columns} gap-1.5`}>
        {items.map(item => {
          const isSel = selected === item.id
          return (
            <button key={item.id} onClick={() => onSelect(isSel ? null : item.id)}
              className={`rounded-lg border px-3 py-2 text-xs font-medium text-left transition active:scale-95 ${
                isSel
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'border-border text-muted-foreground hover:border-primary/30 hover:bg-primary/5 hover:text-primary'
              }`}>
              {item.labelZh}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function MultiSelectorGrid<T extends { id: string; labelZh: string }>({
  items, selected, onToggle, columns = 4, max = 0, emptyLabel = '',
}: {
  items: T[]; selected: string[]; onToggle: (id: string) => void; columns?: number; max?: number; emptyLabel?: string
}) {
  return (
    <div>
      {emptyLabel && <p className="text-xs text-muted-foreground mb-3">{emptyLabel}</p>}
      {max > 0 && <p className="text-xs text-muted-foreground mb-2">已选 {selected.length}/{max}</p>}
      <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-${columns} gap-1.5`}>
        {items.map(item => {
          const isSel = selected.includes(item.id)
          return (
            <button key={item.id} onClick={() => onToggle(item.id)}
              className={`rounded-lg border px-3 py-2 text-xs font-medium text-left transition active:scale-95 ${
                isSel
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'border-border text-muted-foreground hover:border-primary/30 hover:bg-primary/5 hover:text-primary'
              } ${max > 0 && !isSel && selected.length >= max ? 'opacity-40 pointer-events-none' : ''}`}>
              {item.labelZh}
              {isSel && <span className="ml-1.5">✓</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function TemplateSection() {
  const { selection, applyMasterTemplate, toggleState, setDevice, setLight } = useDirector()
  const dispatch = usePromptDispatch()
  const [poseVariants, setPoseVariants] = useState<PoseVariant[]>([])
  const [variantCount, setVariantCount] = useState<3 | 5 | 9>(5)
  const [variantIntensity, setVariantIntensity] = useState<'subtle' | 'standard' | 'dynamic'>('standard')

  const handleRandomFullTemplate = () => {
    const tpl = pickRandom(masterTemplates)
    applyMasterTemplate(tpl.id)
  }

  const handleRandomAction = () => {
    if (!selection.directorTemplate) return
    const tpl = MASTER_TEMPLATE_MAP[selection.directorTemplate]
    if (!tpl) return
    const action = pickRandom(tpl.randomPools.action)
    toggleState(action)
  }

  const handleRandomLight = () => {
    if (!selection.directorTemplate) return
    const tpl = MASTER_TEMPLATE_MAP[selection.directorTemplate]
    if (!tpl) return
    const light = pickRandom(tpl.lockedCore.light ? LIGHT_PACKS.filter(l => l.id !== selection.lightPack) : LIGHT_PACKS)
    setLight(light ? light.id : null)
  }

  const handleRandomDeviceTexture = () => {
    if (!selection.directorTemplate) return
    const tpl = MASTER_TEMPLATE_MAP[selection.directorTemplate]
    if (!tpl) return
    const device = pickRandom(DEVICE_PRESETS)
    setDevice(device.id)
  }

  const handleGenerateVariants = () => {
    const variants = generatePoseVariants(selection, { variantCount, intensity: variantIntensity })
    setPoseVariants(variants)
  }

  const handleVariantCopied = (text: string) => {
    copyToClipboard(text)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-foreground">🎬 选择生成模板</h3>
        <div className="flex gap-1">
          <button onClick={handleRandomFullTemplate}
            className="rounded-lg px-2.5 py-1 text-[10px] font-bold bg-muted text-muted-foreground hover:bg-muted/80 transition">
            🎲 随机模板
          </button>
          <button onClick={handleRandomAction}
            className="rounded-lg px-2.5 py-1 text-[10px] font-bold bg-muted text-muted-foreground hover:bg-muted/80 transition">
            🔄 换动作
          </button>
          <button onClick={handleRandomLight}
            className="rounded-lg px-2.5 py-1 text-[10px] font-bold bg-muted text-muted-foreground hover:bg-muted/80 transition">
            💡 换光线
          </button>
          <button onClick={handleRandomDeviceTexture}
            className="rounded-lg px-2.5 py-1 text-[10px] font-bold bg-muted text-muted-foreground hover:bg-muted/80 transition">
            📷 换设备
          </button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mb-3">选择一个模板，系统自动设置设备、场景、光线、人物状态和修复包</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-[400px] overflow-y-auto">
        {masterTemplates.map(t => {
          const isSel = selection.directorTemplate === t.id
          return (
            <button key={t.id} onClick={() => applyMasterTemplate(t.id)}
              className={`rounded-xl border p-3 text-left transition active:scale-95 ${
                isSel
                  ? 'bg-primary text-primary-foreground border-primary shadow-md'
                  : 'border-border text-foreground hover:border-primary/30 hover:bg-primary/5'
              }`}>
              <div className="text-xs font-bold mb-1">{t.title}</div>
              <div className={`text-[10px] ${isSel ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{t.description}</div>
            </button>
          )
        })}
      </div>

      {/* Pose Director Section */}
      {selection.directorTemplate && (
        <div className="mt-6 rounded-lg border border-primary/20 bg-primary/[0.03] p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-black text-foreground">🎬 Pose Director · 动作导演</h4>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground">强度</span>
              {(['subtle', 'standard', 'dynamic'] as const).map(int => (
                <button key={int} onClick={() => setVariantIntensity(int)}
                  className={`rounded px-2 py-0.5 text-[10px] font-bold transition ${
                    variantIntensity === int ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}>
                  {int === 'subtle' ? '轻微' : int === 'standard' ? '标准' : '动态'}
                </button>
              ))}
              <span className="ml-2 text-[10px] text-muted-foreground">张数</span>
              {([3, 5, 9] as const).map(n => (
                <button key={n} onClick={() => setVariantCount(n)}
                  className={`rounded px-2 py-0.5 text-[10px] font-bold transition ${
                    variantCount === n ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}>
                  {n}张
                </button>
              ))}
              <button onClick={handleGenerateVariants}
                className="ml-2 rounded-lg bg-primary px-3 py-1 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition active:scale-95">
                🎬 生成
              </button>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground mb-3">
            基于当前模板锁定的人物、场景、设备、光线，像摄影师一样按流程生成 {variantCount} 张动作变体
          </p>

          {/* Variant Cards */}
          {poseVariants.length > 0 && (
            <div className={`grid gap-3 ${variantCount === 3 ? 'grid-cols-1 sm:grid-cols-3' : variantCount === 5 ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'}`}>
              {poseVariants.map((v, i) => (
                <div key={v.shot.id} className="rounded-xl border border-border bg-card p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-foreground">Variant {i + 1} · {v.shot.title}</span>
                    <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary">{v.shot.purpose}</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground space-y-0.5">
                    <div>变动：{v.shot.bodyPose}、{v.shot.gaze}、{v.shot.cameraCrop}</div>
                    <div>自动修复：{v.autoDiffPacks.map(p => p.replace(/-/g, ' ')).join('、')}</div>
                  </div>
                  <textarea value={v.positivePrompt} readOnly
                    className="w-full resize-none rounded border border-border bg-muted p-2 text-[10px] leading-relaxed text-foreground outline-none"
                    rows={3} />
                  <div className="flex flex-wrap gap-1">
                    <button onClick={() => handleVariantCopied(v.positivePrompt)}
                      className="flex-1 min-w-[60px] rounded bg-muted px-2 py-1 text-[9px] font-bold text-muted-foreground hover:bg-muted/80 transition">
                      📋 复制正向
                    </button>
                    <button onClick={() => handleVariantCopied(`正向：${v.positivePrompt}\n负面：${v.negativePrompt.join(', ')}`)}
                      className="flex-1 min-w-[60px] rounded bg-primary/10 px-2 py-1 text-[9px] font-bold text-primary hover:bg-primary/20 transition">
                      📋 复制全部
                    </button>
                    <button onClick={() => dispatch({ type: 'APPLY_POSE_VARIANT', variantId: v.shot.id })}
                      className="flex-1 min-w-[60px] rounded bg-green-100 px-2 py-1 text-[9px] font-bold text-green-700 hover:bg-green-200 transition dark:bg-green-900/30 dark:text-green-300">
                      ✅ 应用
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function DeviceSection() {
  const { selection, setDevice } = useDirector()
  const selDevice = selection.devicePreset ? DEVICE_PRESETS.find(d => d.id === selection.devicePreset) : null
  return (
    <div>
      <h3 className="text-sm font-bold text-foreground mb-3">📱 选择拍摄设备</h3>
      <p className="text-xs text-muted-foreground mb-3">设备模板直接决定成像质感，普通用户不需要调镜头参数</p>
      <SelectorGrid items={DEVICE_PRESETS} selected={selection.devicePreset} onSelect={setDevice} />
      {selDevice && (
        <div className="mt-3 rounded-lg bg-muted/50 p-3">
          <div className="text-xs font-bold text-foreground mb-1">{selDevice.labelZh} 特征</div>
          <div className="flex flex-wrap gap-1">
            {selDevice.styleTags.map(tag => (
              <span key={tag} className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">{tag}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function SceneSection() {
  const { selection, setScene } = useDirector()
  return (
    <div>
      <h3 className="text-sm font-bold text-foreground mb-3">🏠 选择场景</h3>
      <SelectorGrid items={SCENE_PACKS} selected={selection.scenePack} onSelect={setScene} columns={3} />
    </div>
  )
}

function LightSection() {
  const { selection, setLight } = useDirector()
  return (
    <div>
      <h3 className="text-sm font-bold text-foreground mb-3">💡 选择光线</h3>
      <SelectorGrid items={LIGHT_PACKS} selected={selection.lightPack} onSelect={setLight} columns={3} />
    </div>
  )
}

function StateSection() {
  const { selection, toggleState } = useDirector()
  return (
    <div>
      <h3 className="text-sm font-bold text-foreground mb-3">🧍 选择人物状态</h3>
      <p className="text-xs text-muted-foreground mb-3">可选多个状态（最多 4 个），系统自动组合</p>
      <MultiSelectorGrid items={STATE_PACKS} selected={selection.statePacks} onToggle={toggleState} columns={3} max={4} />
    </div>
  )
}

function ParamSection() {
  const { selection, setParamPreset } = useDirector()
  const selParam = selection.parameterPreset ? PARAMETER_PRESETS.find(p => p.id === selection.parameterPreset) : null
  return (
    <div>
      <h3 className="text-sm font-bold text-foreground mb-3">⚙️ 参数风格</h3>
      <p className="text-xs text-muted-foreground mb-3">普通用户不需要调复杂参数，选择你想要的风格即可</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {PARAMETER_PRESETS.map(p => {
          const isSel = selection.parameterPreset === p.id
          return (
            <button key={p.id} onClick={() => setParamPreset(isSel ? null : p.id)}
              className={`rounded-xl border p-3 text-left transition active:scale-95 ${
                isSel
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'border-border text-foreground hover:border-primary/30 hover:bg-primary/5'
              }`}>
              <div className="text-xs font-bold mb-1">{p.labelZh}</div>
              <div className={`text-[10px] ${isSel ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{p.description}</div>
            </button>
          )
        })}
      </div>
      {selParam && (
        <div className="mt-3 rounded-lg bg-muted/50 p-3">
          <div className="text-xs text-muted-foreground">
            <span className="font-bold text-foreground">Midjourney:</span> {selParam.midjourney}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            <span className="font-bold text-foreground">通用:</span> {selParam.generalDescription}
          </div>
        </div>
      )}
    </div>
  )
}
