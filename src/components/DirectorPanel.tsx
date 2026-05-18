import { useRef, useState } from 'react'
import type { DirectorTemplate, PoseVariant } from '../core/types'
import { useDirector } from '../context/DirectorContext'
import { usePromptDispatch } from '../context/PromptStateContext'
import { DEVICE_PRESETS } from '../data/devicePresets'
import { LIGHT_PACKS } from '../data/lightPacks'
import { masterTemplates, MASTER_TEMPLATE_MAP } from '../data/masterTemplates'
import { PARAMETER_PRESETS } from '../data/parameterPresets'
import { SCENE_PACKS } from '../data/scenePacks'
import { STATE_PACKS } from '../data/statePacks'
import { generatePoseVariants } from '../core/variantComposer'
import { copyToClipboard } from '../utils/clipboard'

function gridClass(columns: number) {
  switch (columns) {
    case 2:
      return 'grid grid-cols-1 gap-3 sm:grid-cols-2'
    case 3:
      return 'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'
    case 4:
      return 'grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4'
    default:
      return 'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'
  }
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

function getCompatibleDevices(template: { lockedCore: { scene: string }; avoid?: string[] }) {
  const scenePack = SCENE_PACKS.find(item => item.id === template.lockedCore.scene)
  if (!scenePack) return DEVICE_PRESETS
  const compatible = DEVICE_PRESETS.filter(item => scenePack.recommendedDevices.includes(item.id))
  return filterAvoidedItems(compatible.length > 0 ? compatible : DEVICE_PRESETS, template.avoid ?? [])
}

function getCompatibleLights(template: { lockedCore: { scene: string }; avoid?: string[] }) {
  const scenePack = SCENE_PACKS.find(item => item.id === template.lockedCore.scene)
  if (!scenePack) return LIGHT_PACKS
  const compatible = LIGHT_PACKS.filter(item => scenePack.recommendedLights.includes(item.id))
  return filterAvoidedItems(compatible.length > 0 ? compatible : LIGHT_PACKS, template.avoid ?? [])
}

function filterAvoidedItems<T extends { id: string; labelZh?: string }>(items: T[], avoid: string[]) {
  if (avoid.length === 0) return items
  return items.filter(item => !avoid.some(token => item.id.includes(token) || item.labelZh?.includes(token)))
}

export default function DirectorPanel({ onNavigateToAdvanced }: { onNavigateToAdvanced?: () => void }) {
  const {
    selection,
    output,
    applyMasterTemplate,
    setDevice,
    setScene,
    setLight,
    toggleState,
    setParamPreset,
    clearAll,
    syncToPresets,
  } = useDirector()
  const dispatch = usePromptDispatch()

  const [activeSection, setActiveSection] = useState('templates')
  const [copied, setCopied] = useState<'positive' | 'negative' | 'all' | null>(null)
  const [generated, setGenerated] = useState(false)
  const [poseVariants, setPoseVariants] = useState<PoseVariant[]>([])
  const [variantCount, setVariantCount] = useState<3 | 5 | 9>(5)
  const [variantIntensity, setVariantIntensity] = useState<'subtle' | 'standard' | 'dynamic'>('standard')
  const outputRef = useRef<HTMLDivElement>(null)

  const selectedTemplate: DirectorTemplate | null = selection.directorTemplate
    ? MASTER_TEMPLATE_MAP[selection.directorTemplate] ?? null
    : null

  const sections = [
    { id: 'templates', label: '模板', icon: '🎬' },
    { id: 'device', label: '设备', icon: '📷' },
    { id: 'scene', label: '场景', icon: '🌆' },
    { id: 'light', label: '光线', icon: '💡' },
    { id: 'state', label: '人物状态', icon: '🧍' },
    { id: 'param', label: '参数风格', icon: '⚙️' },
  ]

  async function handleCopy(text: string, type: 'positive' | 'negative' | 'all') {
    const success = await copyToClipboard(text)
    if (!success) return
    setCopied(type)
    setTimeout(() => setCopied(current => (current === type ? null : current)), 1500)
  }

  function handleGenerate() {
    setGenerated(true)
    setTimeout(() => setGenerated(false), 1500)
    outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handleEnterAdvanced() {
    syncToPresets()
    onNavigateToAdvanced?.()
  }

  function handleRandomTemplate() {
    applyMasterTemplate(pickRandom(masterTemplates).id)
  }

  function handleRandomDevice() {
    if (!selection.directorTemplate) return
    const template = MASTER_TEMPLATE_MAP[selection.directorTemplate]
    if (!template) return
    const device = pickRandom(getCompatibleDevices(template))
    setDevice(device.id)
  }

  function handleRandomLight() {
    if (!selection.directorTemplate) return
    const template = MASTER_TEMPLATE_MAP[selection.directorTemplate]
    if (!template) return
    const pool = getCompatibleLights(template).filter(item => item.id !== selection.lightPack)
    const next = pickRandom(pool.length > 0 ? pool : getCompatibleLights(template))
    setLight(next.id)
  }

  function handleRandomState() {
    if (!selection.directorTemplate) return
    const template = MASTER_TEMPLATE_MAP[selection.directorTemplate]
    const nextState = pickRandom(template.randomPools.state)
    toggleState(nextState)
  }

  function handleGenerateVariants() {
    setPoseVariants(generatePoseVariants(selection, { variantCount, intensity: variantIntensity }))
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card/80 p-4 shadow-sm lg:p-5">
        <div className="flex flex-wrap gap-2">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                activeSection === section.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <span className="mr-2">{section.icon}</span>
              {section.label}
            </button>
          ))}

          <div className="ml-auto flex flex-wrap gap-2">
            {onNavigateToAdvanced && (
              <button
                onClick={handleEnterAdvanced}
                className="rounded-xl bg-amber-100 px-4 py-2.5 text-sm font-bold text-amber-900 transition hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-200"
              >
                进入高级编辑
              </button>
            )}
            <button
              onClick={clearAll}
              className="rounded-xl border border-border px-4 py-2.5 text-sm font-bold text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              清空
            </button>
          </div>
        </div>
      </section>

      {selectedTemplate && (
        <section className="rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4 shadow-sm">
          <div className="text-sm font-bold text-primary">当前模板</div>
          <div className="mt-1 text-lg font-black text-foreground">{selectedTemplate.title}</div>
          <div className="mt-1 text-sm leading-6 text-muted-foreground">{selectedTemplate.description}</div>
        </section>
      )}

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:p-6">
        {activeSection === 'templates' && (
          <TemplateSection
            selection={selection}
            applyMasterTemplate={applyMasterTemplate}
            onRandomTemplate={handleRandomTemplate}
            onRandomDevice={handleRandomDevice}
            onRandomLight={handleRandomLight}
            onRandomState={handleRandomState}
            variantCount={variantCount}
            setVariantCount={setVariantCount}
            variantIntensity={variantIntensity}
            setVariantIntensity={setVariantIntensity}
            poseVariants={poseVariants}
            onGenerateVariants={handleGenerateVariants}
            onCopyVariant={text => handleCopy(text, 'all')}
            onApplyVariant={variantId => dispatch({ type: 'APPLY_POSE_VARIANT', variantId })}
          />
        )}
        {activeSection === 'device' && (
          <DeviceSection
            selected={selection.devicePreset}
            onSelect={setDevice}
          />
        )}
        {activeSection === 'scene' && (
          <SceneSection
            selected={selection.scenePack}
            onSelect={setScene}
          />
        )}
        {activeSection === 'light' && (
          <LightSection
            selected={selection.lightPack}
            onSelect={setLight}
          />
        )}
        {activeSection === 'state' && (
          <StateSection
            selected={selection.statePacks}
            onToggle={toggleState}
          />
        )}
        {activeSection === 'param' && (
          <ParamSection
            selected={selection.parameterPreset}
            onSelect={setParamPreset}
          />
        )}
      </section>

      <section ref={outputRef} className="rounded-2xl border border-border bg-card/90 p-5 shadow-sm lg:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-foreground">快速生成结果预览</h3>
            <p className="text-sm leading-6 text-muted-foreground">
              这里是快速生成的粗选结果。想继续微调结构化词条，可以直接跳去高级编辑。
            </p>
          </div>
          <button
            onClick={handleGenerate}
            className={`rounded-xl px-5 py-2.5 text-sm font-bold transition ${
              generated ? 'bg-green-600 text-white' : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          >
            {generated ? '已刷新预览' : '刷新预览'}
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-bold text-foreground">正向提示词</span>
              <button
                onClick={() => handleCopy(output.positivePrompt, 'positive')}
                className="rounded-xl border border-border px-3 py-1.5 text-xs font-bold text-muted-foreground transition hover:border-primary/40 hover:text-primary"
              >
                {copied === 'positive' ? '已复制' : '复制'}
              </button>
            </div>
            <textarea
              value={output.positivePrompt}
              readOnly
              rows={5}
              className="w-full resize-none rounded-2xl border border-border bg-muted/40 p-4 text-sm leading-7 text-foreground outline-none"
              placeholder="先选择一个模板，系统会自动组合一套快速生成提示词。"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-bold text-foreground">Negative Prompt</span>
              <button
                onClick={() => handleCopy(output.negativePrompt.join('，'), 'negative')}
                className="rounded-xl border border-border px-3 py-1.5 text-xs font-bold text-muted-foreground transition hover:border-primary/40 hover:text-primary"
              >
                {copied === 'negative' ? '已复制' : '复制'}
              </button>
            </div>
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

          <div>
            <div className="mb-2 text-sm font-bold text-foreground">自动修复包</div>
            {output.autoEnabledPacks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
                当前没有自动触发修复包。
              </div>
            ) : (
              <div className="space-y-2">
                {output.autoEnabledPacks.map(pack => (
                  <div key={pack.id} className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-200">
                    <span className="font-bold">{pack.label}</span>
                    <span className="text-green-700 dark:text-green-300"> · {pack.reason}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => handleCopy(
              [
                output.positivePrompt,
                output.negativePrompt.length > 0 ? `Negative: ${output.negativePrompt.join(', ')}` : '',
                output.parameterSuffix,
              ].filter(Boolean).join('\n\n'),
              'all',
            )}
            className="w-full rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
          >
            {copied === 'all' ? '已复制全部提示词' : '复制全部提示词'}
          </button>
        </div>
      </section>
    </div>
  )
}

function TemplateSection(props: {
  selection: ReturnType<typeof useDirector>['selection']
  applyMasterTemplate: (id: string) => void
  onRandomTemplate: () => void
  onRandomDevice: () => void
  onRandomLight: () => void
  onRandomState: () => void
  variantCount: 3 | 5 | 9
  setVariantCount: (value: 3 | 5 | 9) => void
  variantIntensity: 'subtle' | 'standard' | 'dynamic'
  setVariantIntensity: (value: 'subtle' | 'standard' | 'dynamic') => void
  poseVariants: PoseVariant[]
  onGenerateVariants: () => void
  onCopyVariant: (text: string) => void
  onApplyVariant: (variantId: string) => void
}) {
  const {
    selection,
    applyMasterTemplate,
    onRandomTemplate,
    onRandomDevice,
    onRandomLight,
    onRandomState,
    variantCount,
    setVariantCount,
    variantIntensity,
    setVariantIntensity,
    poseVariants,
    onGenerateVariants,
    onCopyVariant,
    onApplyVariant,
  } = props

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h3 className="text-xl font-black text-foreground">选择快速生成模板</h3>
          <p className="text-sm leading-6 text-muted-foreground">
            快速生成负责粗选方向，真正的完整词库会自动同步到高级编辑里。
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={onRandomTemplate} className="rounded-xl border border-border px-4 py-2 text-sm font-bold text-foreground transition hover:border-primary/40 hover:text-primary">随机模板</button>
          <button onClick={onRandomState} className="rounded-xl border border-border px-4 py-2 text-sm font-bold text-foreground transition hover:border-primary/40 hover:text-primary">换人物状态</button>
          <button onClick={onRandomLight} className="rounded-xl border border-border px-4 py-2 text-sm font-bold text-foreground transition hover:border-primary/40 hover:text-primary">换光线</button>
          <button onClick={onRandomDevice} className="rounded-xl border border-border px-4 py-2 text-sm font-bold text-foreground transition hover:border-primary/40 hover:text-primary">换设备</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {masterTemplates.map(template => {
          const selected = selection.directorTemplate === template.id
          return (
            <button
              key={template.id}
              onClick={() => applyMasterTemplate(template.id)}
              className={`rounded-2xl border p-4 text-left transition ${
                selected
                  ? 'border-primary bg-primary/10 text-foreground shadow-sm'
                  : 'border-border bg-background/70 text-foreground hover:border-primary/30 hover:bg-primary/5'
              }`}
            >
              <div className="text-sm font-black">{template.title}</div>
              <div className="mt-2 text-sm leading-6 text-muted-foreground">{template.description}</div>
            </button>
          )
        })}
      </div>

      {selection.directorTemplate && (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-1">
              <h4 className="text-lg font-black text-foreground">变体生成</h4>
              <p className="text-sm leading-6 text-muted-foreground">
                基于当前模板，自动生成一组更专业的动作、机位和表情变化。
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {(['subtle', 'standard', 'dynamic'] as const).map(level => (
                <button
                  key={level}
                  onClick={() => setVariantIntensity(level)}
                  className={`rounded-xl px-3 py-2 text-xs font-bold transition ${
                    variantIntensity === level
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {level === 'subtle' ? '轻微' : level === 'standard' ? '标准' : '动态'}
                </button>
              ))}
              {([3, 5, 9] as const).map(count => (
                <button
                  key={count}
                  onClick={() => setVariantCount(count)}
                  className={`rounded-xl px-3 py-2 text-xs font-bold transition ${
                    variantCount === count
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {count} 套
                </button>
              ))}
              <button
                onClick={onGenerateVariants}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
              >
                生成变体
              </button>
            </div>
          </div>

          {poseVariants.length > 0 && (
            <div className={`mt-5 ${variantCount === 9 ? 'grid grid-cols-1 gap-3 lg:grid-cols-3' : variantCount === 5 ? 'grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5' : 'grid grid-cols-1 gap-3 md:grid-cols-3'}`}>
              {poseVariants.map((variant, index) => (
                <article key={variant.shot.id} className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-black text-foreground">变体 {index + 1}</div>
                      <div className="mt-1 text-sm font-bold text-primary">{variant.shot.title}</div>
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary">{variant.shot.purpose}</span>
                  </div>

                  <div className="mt-3 space-y-1 text-xs leading-6 text-muted-foreground">
                    <div>动作：{variant.shot.bodyPose}</div>
                    <div>视线：{variant.shot.gaze}</div>
                    <div>景别：{variant.shot.cameraCrop}</div>
                    <div>机位：{variant.shot.cameraAngle}</div>
                  </div>

                  <textarea
                    value={variant.positivePrompt}
                    readOnly
                    rows={5}
                    className="mt-3 w-full resize-none rounded-2xl border border-border bg-muted/40 p-3 text-xs leading-6 text-foreground outline-none"
                  />

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => onCopyVariant(variant.positivePrompt)}
                      className="rounded-xl border border-border px-3 py-2 text-xs font-bold text-muted-foreground transition hover:border-primary/40 hover:text-primary"
                    >
                      复制正向
                    </button>
                    <button
                      onClick={() => onApplyVariant(variant.shot.id)}
                      className="rounded-xl bg-green-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-green-700"
                    >
                      应用到当前方案
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function DeviceSection({ selected, onSelect }: { selected: string | null; onSelect: (id: string | null) => void }) {
  const active = selected ? DEVICE_PRESETS.find(item => item.id === selected) : null
  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h3 className="text-xl font-black text-foreground">选择拍摄设备</h3>
        <p className="text-sm leading-6 text-muted-foreground">设备决定质感基调。快速生成里只放高频入口，完整词库会同步到高级编辑。</p>
      </div>
      <div className={gridClass(4)}>
        {DEVICE_PRESETS.map(item => (
          <ChoiceCard
            key={item.id}
            active={selected === item.id}
            title={item.labelZh}
            description={item.positivePromptZh}
            onClick={() => onSelect(selected === item.id ? null : item.id)}
          />
        ))}
      </div>
      {active && (
        <div className="rounded-2xl bg-muted/40 p-4">
          <div className="text-sm font-bold text-foreground">设备风格标签</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {active.styleTags.map(tag => (
              <span key={tag} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{tag}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function SceneSection({ selected, onSelect }: { selected: string | null; onSelect: (id: string | null) => void }) {
  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h3 className="text-xl font-black text-foreground">选择场景</h3>
        <p className="text-sm leading-6 text-muted-foreground">这里负责快速确定拍摄环境，后续可以在高级编辑里继续补细节。</p>
      </div>
      <div className={gridClass(3)}>
        {SCENE_PACKS.map(item => (
          <ChoiceCard
            key={item.id}
            active={selected === item.id}
            title={item.labelZh}
            description={item.description}
            onClick={() => onSelect(selected === item.id ? null : item.id)}
          />
        ))}
      </div>
    </div>
  )
}

function LightSection({ selected, onSelect }: { selected: string | null; onSelect: (id: string | null) => void }) {
  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h3 className="text-xl font-black text-foreground">选择光线</h3>
        <p className="text-sm leading-6 text-muted-foreground">光线会直接影响氛围、脸部层次和整体风格感。</p>
      </div>
      <div className={gridClass(3)}>
        {LIGHT_PACKS.map(item => (
          <ChoiceCard
            key={item.id}
            active={selected === item.id}
            title={item.labelZh}
            description={item.positivePromptZh}
            onClick={() => onSelect(selected === item.id ? null : item.id)}
          />
        ))}
      </div>
    </div>
  )
}

function StateSection({ selected, onToggle }: { selected: string[]; onToggle: (id: string) => void }) {
  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h3 className="text-xl font-black text-foreground">选择人物状态</h3>
        <p className="text-sm leading-6 text-muted-foreground">这里是粗粒度的人物状态入口，适合快速上手。更细的动作和表情会在高级编辑里展开。</p>
      </div>
      <div className={gridClass(3)}>
        {STATE_PACKS.map(item => (
          <ChoiceCard
            key={item.id}
            active={selected.includes(item.id)}
            title={item.labelZh}
            description={item.description}
            onClick={() => onToggle(item.id)}
          />
        ))}
      </div>
    </div>
  )
}

function ParamSection({ selected, onSelect }: { selected: string | null; onSelect: (id: string | null) => void }) {
  const active = selected ? PARAMETER_PRESETS.find(item => item.id === selected) : null
  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h3 className="text-xl font-black text-foreground">选择参数风格</h3>
        <p className="text-sm leading-6 text-muted-foreground">普通用户不需要手调一堆参数，直接选一个稳定的参数风格即可。</p>
      </div>
      <div className={gridClass(3)}>
        {PARAMETER_PRESETS.map(item => (
          <ChoiceCard
            key={item.id}
            active={selected === item.id}
            title={item.labelZh}
            description={item.description}
            onClick={() => onSelect(selected === item.id ? null : item.id)}
          />
        ))}
      </div>
      {active && (
        <div className="rounded-2xl bg-muted/40 p-4 text-sm leading-7 text-muted-foreground">
          <div><span className="font-bold text-foreground">Midjourney：</span>{active.midjourney}</div>
          <div className="mt-1"><span className="font-bold text-foreground">通用说明：</span>{active.generalDescription}</div>
        </div>
      )}
    </div>
  )
}

function ChoiceCard({
  active,
  title,
  description,
  onClick,
}: {
  active: boolean
  title: string
  description: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border p-4 text-left transition ${
        active
          ? 'border-primary bg-primary/10 text-foreground shadow-sm'
          : 'border-border bg-background/70 text-foreground hover:border-primary/30 hover:bg-primary/5'
      }`}
    >
      <div className="text-sm font-black">{title}</div>
      <div className="mt-2 text-sm leading-6 text-muted-foreground">{description}</div>
    </button>
  )
}
