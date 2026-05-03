<template>
  <div class="rounded-xl border overflow-hidden"
    :class="darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'">
    <!-- Header -->
    <div class="border-b px-4 py-3"
      :class="darkMode ? 'border-slate-700' : 'border-slate-100'">
      <h3 class="text-sm font-bold" :class="darkMode ? 'text-slate-200' : 'text-slate-800'">🔀 提示词对比 Diff</h3>
    </div>

    <div class="p-4 space-y-4">
      <!-- Input Areas -->
      <div class="grid gap-3 sm:grid-cols-2">
        <div>
          <label class="mb-1 block text-xs font-bold" :class="darkMode ? 'text-slate-300' : 'text-slate-700'">原始版本</label>
          <textarea v-model="original" rows="4"
            class="w-full rounded-lg border px-3 py-2 text-xs outline-none resize-none"
            :class="darkMode ? 'border-slate-600 bg-slate-900 text-slate-200' : 'border-slate-200'"
            placeholder="粘贴原始提示词..."></textarea>
        </div>
        <div>
          <label class="mb-1 block text-xs font-bold" :class="darkMode ? 'text-slate-300' : 'text-slate-700'">优化版本</label>
          <textarea v-model="optimized" rows="4"
            class="w-full rounded-lg border px-3 py-2 text-xs outline-none resize-none"
            :class="darkMode ? 'border-slate-600 bg-slate-900 text-slate-200' : 'border-slate-200'"
            placeholder="粘贴优化后的提示词..."></textarea>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap gap-2">
        <button class="rounded-lg px-4 py-2 text-xs font-bold transition active:scale-95"
          :class="darkMode ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'bg-emerald-500 text-white hover:bg-emerald-600'"
          @click="doCompare">
          🔍 对比
        </button>
        <button class="rounded-lg px-4 py-2 text-xs font-bold transition active:scale-95"
          :class="darkMode ? 'bg-slate-600 text-slate-300 hover:bg-slate-500' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'"
          @click="clear">
          🗑️ 清空
        </button>
        <button v-if="result"
          class="rounded-lg px-4 py-2 text-xs font-bold transition active:scale-95"
          :class="darkMode ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-blue-500 text-white hover:bg-blue-600'"
          @click="copySummary">
          📋 复制摘要
        </button>
        <button v-if="result"
          class="rounded-lg px-4 py-2 text-xs font-bold transition active:scale-95"
          :class="darkMode ? 'bg-violet-600 text-white hover:bg-violet-500' : 'bg-violet-500 text-white hover:bg-violet-600'"
          @click="saveResult">
          💾 保存记录
        </button>
      </div>

      <!-- Quick Send -->
      <div class="flex flex-wrap gap-2">
        <button class="rounded-lg px-3 py-1.5 text-[10px] font-bold transition active:scale-95"
          :class="darkMode ? 'bg-slate-700 text-slate-400 hover:bg-slate-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'"
          @click="$emit('send-to-original')">
          ← 发送到原始
        </button>
        <button class="rounded-lg px-3 py-1.5 text-[10px] font-bold transition active:scale-95"
          :class="darkMode ? 'bg-slate-700 text-slate-400 hover:bg-slate-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'"
          @click="$emit('send-to-optimized')">
          发送到优化 →
        </button>
      </div>

      <!-- Results -->
      <div v-if="result" class="space-y-3">
        <div class="grid grid-cols-3 gap-2">
          <div class="rounded-lg p-3 text-center"
            :class="darkMode ? 'bg-emerald-900/20' : 'bg-emerald-50'">
            <div class="text-lg font-black text-emerald-600 dark:text-emerald-400">+{{ result.added.length }}</div>
            <div class="text-[10px]" :class="darkMode ? 'text-emerald-400' : 'text-emerald-600'">新增</div>
          </div>
          <div class="rounded-lg p-3 text-center"
            :class="darkMode ? 'bg-red-900/20' : 'bg-red-50'">
            <div class="text-lg font-black text-red-600 dark:text-red-400">-{{ result.removed.length }}</div>
            <div class="text-[10px]" :class="darkMode ? 'text-red-400' : 'text-red-600'">移除</div>
          </div>
          <div class="rounded-lg p-3 text-center"
            :class="darkMode ? 'bg-blue-900/20' : 'bg-blue-50'">
            <div class="text-lg font-black text-blue-600 dark:text-blue-400">{{ result.kept.length }}</div>
            <div class="text-[10px]" :class="darkMode ? 'text-blue-400' : 'text-blue-600'">保留</div>
          </div>
        </div>

        <div class="flex items-center gap-4 text-xs" :class="darkMode ? 'text-slate-400' : 'text-slate-500'">
          <span>字符变化: <strong :class="result.charChange > 0 ? 'text-emerald-500' : result.charChange < 0 ? 'text-red-500' : ''">{{ result.charChange > 0 ? '+' : '' }}{{ result.charChange }}</strong></span>
          <span>Token 估计: <strong :class="result.estimatedTokenChange > 0 ? 'text-emerald-500' : result.estimatedTokenChange < 0 ? 'text-red-500' : ''">{{ result.estimatedTokenChange > 0 ? '+' : '' }}{{ result.estimatedTokenChange }}</strong></span>
        </div>

        <!-- Token Lists -->
        <div v-if="result.added.length" class="text-xs">
          <span class="font-bold text-emerald-600 dark:text-emerald-400">新增：</span>
          <span class="flex flex-wrap gap-1 mt-1">
            <span v-for="t in result.added" :key="'a'+t"
              class="rounded bg-emerald-100 dark:bg-emerald-900/30 px-1.5 py-0.5 font-mono text-[10px] text-emerald-700 dark:text-emerald-300">{{ t }}</span>
          </span>
        </div>
        <div v-if="result.removed.length" class="text-xs">
          <span class="font-bold text-red-600 dark:text-red-400">移除：</span>
          <span class="flex flex-wrap gap-1 mt-1">
            <span v-for="t in result.removed" :key="'r'+t"
              class="rounded bg-red-100 dark:bg-red-900/30 px-1.5 py-0.5 font-mono text-[10px] text-red-700 dark:text-red-300">{{ t }}</span>
          </span>
        </div>
      </div>

      <!-- History -->
      <div v-if="history.length" class="border-t pt-3" :class="darkMode ? 'border-slate-700' : 'border-slate-100'">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold" :class="darkMode ? 'text-slate-300' : 'text-slate-700'">📜 历史记录 ({{ history.length }})</span>
          <button class="text-[10px] text-red-500 hover:underline" @click="clearHistory">清空</button>
        </div>
        <div class="space-y-1 max-h-40 overflow-y-auto">
          <div v-for="h in history" :key="h.id"
            class="flex items-center justify-between rounded px-2 py-1.5 text-[10px]"
            :class="darkMode ? 'bg-slate-900 text-slate-400' : 'bg-slate-50 text-slate-500'">
            <span>{{ formatTime(h.timestamp) }} | +{{ h.added?.length || 0 }} -{{ h.removed?.length || 0 }}</span>
            <div class="flex gap-1">
              <button class="text-blue-500 hover:underline" @click="loadHistory(h)">加载</button>
              <button class="text-red-500 hover:underline" @click="deleteHistoryItem(h.id)">删除</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { diffSummary, saveDiff, getDiffHistory, deleteDiff, clearDiffHistory } from '../utils/promptDiff.js'

const props = defineProps({
  darkMode: { type: Boolean, default: false }
})

const emit = defineEmits(['send-to-original', 'send-to-optimized', 'toast'])

const original = ref('')
const optimized = ref('')
const result = ref(null)
const history = ref([])

onMounted(() => {
  history.value = getDiffHistory()
})

function doCompare() {
  if (!original.value.trim() && !optimized.value.trim()) return
  result.value = diffSummary(original.value, optimized.value)
}

function clear() {
  original.value = ''
  optimized.value = ''
  result.value = null
}

async function copySummary() {
  if (!result.value) return
  const text = [
    `Diff Summary:`,
    `+${result.value.added.length} added, -${result.value.removed.length} removed, ${result.value.kept.length} kept`,
    `Char change: ${result.value.charChange > 0 ? '+' : ''}${result.value.charChange}`,
    `Token estimate: ${result.value.estimatedTokenChange > 0 ? '+' : ''}${result.value.estimatedTokenChange}`,
    result.value.added.length ? `Added: ${result.value.added.join(', ')}` : '',
    result.value.removed.length ? `Removed: ${result.value.removed.join(', ')}` : ''
  ].filter(Boolean).join('\n')
  try {
    await navigator.clipboard.writeText(text)
    emit('toast', '已复制对比摘要')
  } catch {
    emit('toast', '复制失败')
  }
}

function saveResult() {
  if (!result.value) return
  saveDiff({
    original: original.value.slice(0, 200),
    optimized: optimized.value.slice(0, 200),
    ...result.value
  })
  history.value = getDiffHistory()
  emit('toast', '已保存对比记录')
}

function loadHistory(h) {
  original.value = h.original || ''
  result.value = {
    added: h.added || [],
    removed: h.removed || [],
    kept: h.kept || [],
    charChange: h.charChange || 0,
    estimatedTokenChange: h.estimatedTokenChange || 0
  }
}

function deleteHistoryItem(id) {
  deleteDiff(id)
  history.value = getDiffHistory()
}

function clearHistory() {
  clearDiffHistory()
  history.value = []
}

function formatTime(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
}
</script>
