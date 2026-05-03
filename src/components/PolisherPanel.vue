<template>
  <div class="rounded-xl border overflow-hidden"
    :class="darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'">
    <!-- Header -->
    <div class="border-b px-4 py-3"
      :class="darkMode ? 'border-slate-700' : 'border-slate-100'">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-bold" :class="darkMode ? 'text-slate-200' : 'text-slate-800'">✨ 提示词润色</h3>
        <span class="text-xs" :class="darkMode ? 'text-slate-500' : 'text-slate-400'">15 种模式</span>
      </div>
    </div>

    <!-- Mode Selector -->
    <div class="p-4">
      <div class="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-4">
        <button v-for="mode in modes" :key="mode.id"
          class="flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-center transition active:scale-95"
          :class="selectedMode === mode.id
            ? (darkMode ? 'bg-emerald-600 text-white' : 'bg-emerald-500 text-white')
            : (darkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-50 text-slate-600 hover:bg-slate-100')"
          @click="selectMode(mode.id)">
          <span class="text-base">{{ mode.icon }}</span>
          <span class="text-[10px] font-bold leading-tight">{{ mode.label }}</span>
        </button>
      </div>

      <!-- Mode Description -->
      <div v-if="selectedModeInfo" class="mb-3 text-xs" :class="darkMode ? 'text-slate-400' : 'text-slate-500'">
        {{ selectedModeInfo.description }}
      </div>

      <!-- Preview Area -->
      <div v-if="preview" class="mb-4">
        <div class="mb-2 text-xs font-bold" :class="darkMode ? 'text-slate-300' : 'text-slate-700'">📋 变更预览</div>
        <div class="rounded-lg p-3 text-xs" :class="darkMode ? 'bg-slate-900 text-slate-400' : 'bg-slate-50 text-slate-600'">
          <div class="mb-2 font-bold">{{ preview.summary }}</div>
          <div v-if="preview.additions.length" class="mb-2">
            <span class="text-emerald-500">+ 添加：</span>
            <span v-for="(a, i) in preview.additions" :key="i" class="ml-1">
              <span class="rounded bg-emerald-100 dark:bg-emerald-900/30 px-1 py-0.5 text-[10px] text-emerald-600 dark:text-emerald-400">{{ a.term }}</span>
            </span>
          </div>
          <div v-if="preview.removals.length">
            <span class="text-red-500">- 移除：</span>
            <span v-for="(r, i) in preview.removals" :key="i" class="ml-1">
              <span class="rounded bg-red-100 dark:bg-red-900/30 px-1 py-0.5 text-[10px] text-red-600 dark:text-red-400">{{ r.term }}</span>
            </span>
          </div>
          <div v-if="!preview.additions.length && !preview.removals.length" class="text-slate-400">
            无需修改
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap gap-2">
        <button class="rounded-lg px-4 py-2 text-xs font-bold transition active:scale-95"
          :class="darkMode ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'bg-emerald-500 text-white hover:bg-emerald-600'"
          @click="doPreview">
          👁️ 预览
        </button>
        <button v-if="preview"
          class="rounded-lg px-4 py-2 text-xs font-bold transition active:scale-95"
          :class="darkMode ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-blue-500 text-white hover:bg-blue-600'"
          @click="doApply">
          ✅ 确认应用
        </button>
        <button v-if="preview"
          class="rounded-lg px-4 py-2 text-xs font-bold transition active:scale-95"
          :class="darkMode ? 'bg-slate-600 text-slate-300 hover:bg-slate-500' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'"
          @click="cancelPreview">
          ❌ 取消
        </button>
        <button v-if="lastApplied"
          class="rounded-lg px-4 py-2 text-xs font-bold transition active:scale-95"
          :class="darkMode ? 'bg-amber-600 text-white hover:bg-amber-500' : 'bg-amber-500 text-white hover:bg-amber-600'"
          @click="undoLast">
          ↩️ 撤销上次
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { POLISH_MODES, polishPrompt } from '../utils/promptPolisher.js'

const props = defineProps({
  director: { type: Object, default: () => ({}) },
  darkMode: { type: Boolean, default: false }
})

const emit = defineEmits(['apply', 'undo'])

const modes = POLISH_MODES
const selectedMode = ref(null)
const preview = ref(null)
const lastApplied = ref(false)
const lastDirector = ref(null)

const selectedModeInfo = computed(() => modes.find(m => m.id === selectedMode.value))

function selectMode(id) {
  selectedMode.value = id
  preview.value = null
}

function doPreview() {
  if (!selectedMode.value || !props.director) return
  preview.value = polishPrompt(props.director, selectedMode.value)
}

function doApply() {
  if (!preview.value) return
  lastDirector.value = { ...props.director }
  lastApplied.value = true
  emit('apply', preview.value.preview)
  preview.value = null
}

function cancelPreview() {
  preview.value = null
}

function undoLast() {
  if (!lastDirector.value) return
  emit('undo', lastDirector.value)
  lastApplied.value = false
  lastDirector.value = null
}
</script>
