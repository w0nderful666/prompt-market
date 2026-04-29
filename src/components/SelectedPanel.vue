<template>
  <aside class="rounded-2xl border border-emerald-100 bg-white shadow-[0_12px_40px_rgba(15,118,110,0.14)]">
    <div class="border-b border-slate-100 p-4">
      <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 class="font-bold text-slate-900">生成好的提示词</h2>
          <p class="text-xs text-slate-400">
            {{ selectedItems.length }} 个关键词 · {{ modeLabel }} ·
            <span :class="needsGenerate ? 'text-amber-600' : 'text-emerald-600'">
              {{ needsGenerate ? '待生成' : '已生成' }}
            </span>
            <span v-if="localState.dirtyPositive"> · 已手动编辑</span>
          </p>
        </div>
        <div class="flex flex-wrap gap-2">
          <button class="pill-btn generate" @click="generateNow">生成</button>
          <button class="pill-btn primary" @click="copyText(localState.positiveText, 'positive')">一键复制</button>
          <button class="pill-btn" @click="$emit('save')">保存</button>
          <button class="pill-btn" @click="advancedOpen = !advancedOpen">{{ advancedOpen ? '收起编辑' : '展开编辑' }}</button>
        </div>
      </div>

      <div class="grid gap-3 lg:grid-cols-[1fr_220px]">
        <textarea
          class="h-32 w-full resize-none rounded-xl border border-emerald-100 bg-emerald-50/40 p-3 text-sm leading-6 text-slate-700 outline-none focus:border-emerald-400"
          :value="localState.positiveText"
          placeholder="选择关键词后点击“生成”，这里会出现可直接复制的完整提示词。负面提示词会自动合并在末尾。"
          @input="updatePositiveText($event.target.value)"
        />

        <div class="flex flex-col gap-2">
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="mode in quickModes"
              :key="mode.id"
              class="small-mode"
              :class="localState.mode === mode.id ? 'active' : ''"
              @click="setMode(mode.id)"
            >
              {{ mode.name }}
            </button>
          </div>
          <button class="action-wide" @click="$emit('random-realistic')">真实照片随机</button>
          <button class="action-wide" @click="generateNow">用当前选择生成</button>
        </div>
      </div>

      <div v-if="needsGenerate && localState.dirtyPositive" class="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
        <p class="mb-2">当前选择已变化，但你手动编辑过提示词。点击“生成”会用最新选择覆盖当前编辑内容。</p>
        <div class="flex gap-2">
          <button class="mini-btn primary" @click="generateNow">重新生成</button>
          <button class="mini-btn" @click="needsGenerate = false">保留当前内容</button>
        </div>
      </div>
    </div>

    <div class="grid gap-3 p-4 lg:grid-cols-[260px_1fr]">
      <section>
        <div class="mb-2 flex items-center justify-between">
          <span class="text-sm font-bold text-slate-700">预设方案</span>
          <button class="text-xs font-semibold text-emerald-600" @click="$emit('show-schemes')">我的方案</button>
        </div>
        <div class="grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
          <button
            v-for="preset in presets"
            :key="preset.id"
            class="rounded-xl border border-slate-100 bg-slate-50 p-3 text-left hover:border-emerald-200 hover:bg-emerald-50"
            @click="$emit('apply-preset', preset)"
          >
            <div class="text-sm font-semibold text-slate-800">{{ preset.name }}</div>
            <p class="mt-1 text-xs leading-5 text-slate-500">{{ preset.description }}</p>
          </button>
        </div>
      </section>

      <section class="space-y-3">
        <div v-if="selectedItems.length" class="flex max-h-20 flex-wrap gap-2 overflow-y-auto">
          <span
            v-for="item in selectedItems"
            :key="getItemKey(item)"
            class="inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-sm text-emerald-800"
          >
            {{ displayKeyword(item) }}
            <button class="text-emerald-500 hover:text-red-500" @click="$emit('remove', item)">×</button>
          </span>
        </div>

        <div class="flex flex-wrap gap-2">
          <button class="tool-btn" @click="rewritePositive">改写自然</button>
          <button class="tool-btn" @click="compressPositive">压缩</button>
          <button class="tool-btn" @click="expandPositive">展开</button>
          <button class="tool-btn" @click="$emit('clear-current')">清空当前</button>
          <button class="tool-btn danger" @click="$emit('clear-all')">清空全部</button>
        </div>

        <QuickAppendPanel @append="appendPositive" />
      </section>
    </div>

    <div v-if="advancedOpen" class="grid gap-4 border-t border-slate-100 p-4 lg:grid-cols-2">
      <section class="space-y-4">
        <PromptModeSwitch :model-value="localState" @update:model-value="patchLocalState" />

        <TemplatePanel
          v-if="localState.mode === 'template'"
          :templates="templates"
          :selected-id="localState.templateId"
          @select="selectTemplate"
        />

        <div class="rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-500">
          负面词现在会自动合并到“生成好的提示词”末尾，不需要单独复制。选择或删除负面词后，点击“生成”即可更新。
        </div>
      </section>

      <PromptSections :sections="generated.sections" @append="appendPositive" />
    </div>
  </aside>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import PromptModeSwitch from './PromptModeSwitch.vue'
import PromptSections from './PromptSections.vue'
import QuickAppendPanel from './QuickAppendPanel.vue'
import TemplatePanel from './TemplatePanel.vue'
import { buildNaturalPrompt } from '../utils/naturalPromptBuilder.js'
import { getItemKey } from '../utils/promptBuilder.js'
import {
  appendSentence,
  compressPrompt,
  expandPrompt,
  rewriteToNatural
} from '../utils/promptTextTools.js'

const props = defineProps({
  selectedItems: { type: Array, default: () => [] },
  library: { type: Object, default: () => ({}) },
  editorState: { type: Object, required: true },
  presets: { type: Array, default: () => [] }
})

const emit = defineEmits([
  'remove',
  'clear-current',
  'clear-all',
  'save',
  'show-schemes',
  'copy',
  'update:editor-state',
  'apply-preset',
  'random-realistic'
])

const localState = reactive({ ...props.editorState })
const needsGenerate = ref(!localState.positiveText)
const advancedOpen = ref(false)

const quickModes = [
  { id: 'natural', name: '自然' },
  { id: 'enhanced', name: '增强' },
  { id: 'keywords', name: '关键词' },
  { id: 'template', name: '模板' }
]

const modeNames = {
  keywords: '关键词模式',
  natural: '自然语言模式',
  enhanced: '增强描述模式',
  template: '模板填充模式'
}

const modeLabel = computed(() => modeNames[localState.mode] || '自然语言模式')
const templates = computed(() => props.library?.templates || [])

const generated = computed(() => buildNaturalPrompt({
  library: props.library,
  selectedItems: props.selectedItems,
  language: localState.language,
  mode: localState.mode,
  templateId: localState.templateId,
  smartDetails: localState.smartDetails,
  usePlaceholders: localState.usePlaceholders
}))

watch(() => props.editorState, (next) => {
  Object.assign(localState, next)
  needsGenerate.value = !next.positiveText
}, { deep: true })

watch(localState, (state) => {
  emit('update:editor-state', { ...state })
}, { deep: true })

watch(generated, (next, previous) => {
  if (!previous) return
  if (next.positiveText !== previous.positiveText) {
    needsGenerate.value = true
  }
})

function hasBadText(text) {
  return !text || /\?{2,}|�/.test(text)
}

function displayKeyword(item) {
  return hasBadText(item.zh) ? item.en || item.id : item.zh
}

function setMode(mode) {
  localState.mode = mode
  needsGenerate.value = true
}

function selectTemplate(template) {
  localState.templateId = template.id
  localState.mode = template.mode || 'template'
  if (!['keywords', 'natural', 'enhanced'].includes(localState.mode)) {
    localState.mode = 'template'
  }
  needsGenerate.value = true
}

function patchLocalState(nextState) {
  Object.assign(localState, nextState)
  needsGenerate.value = true
}

function generateNow() {
  localState.positiveText = generated.value.positiveText
  localState.negativeText = generated.value.negativeText
  localState.dirtyPositive = false
  localState.dirtyNegative = false
  needsGenerate.value = false
}

function updatePositiveText(text) {
  localState.positiveText = text
  localState.dirtyPositive = true
  needsGenerate.value = false
}

function appendPositive(sentence) {
  updatePositiveText(appendSentence(localState.positiveText, sentence))
}

function rewritePositive() {
  updatePositiveText(rewriteToNatural(localState.positiveText, props.selectedItems, props.library))
}

function compressPositive() {
  updatePositiveText(compressPrompt(localState.positiveText))
}

function expandPositive() {
  updatePositiveText(expandPrompt(localState.positiveText, props.selectedItems, props.library))
}

async function copyText(text, target) {
  if (!text) return
  try {
    if (!navigator?.clipboard?.writeText) throw new Error('Clipboard API unavailable')
    await navigator.clipboard.writeText(text)
    emit('copy', { success: true, target })
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.left = '-9999px'
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()
    try {
      document.execCommand('copy')
      emit('copy', { success: true, target })
    } catch {
      emit('copy', { success: false, target })
    } finally {
      textarea.remove()
    }
  }
}
</script>

<style scoped>
.pill-btn,
.tool-btn,
.mini-btn,
.action-wide,
.small-mode {
  border-radius: 999px;
  background: #f8fafc;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 700;
  color: #475569;
}

.pill-btn.primary,
.mini-btn.primary {
  background: #22c55e;
  color: white;
}

.pill-btn.generate {
  background: #0f172a;
  color: white;
}

.tool-btn.danger {
  background: #fef2f2;
  color: #dc2626;
}

.action-wide {
  width: 100%;
  border-radius: 10px;
  background: #dcfce7;
  color: #047857;
}

.small-mode {
  border-radius: 10px;
  background: white;
  color: #64748b;
}

.small-mode.active {
  background: #22c55e;
  color: white;
}
</style>
