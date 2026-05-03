<template>
  <div class="mx-auto max-w-5xl p-4">
    <div class="mb-4 flex items-center justify-between">
      <div>
        <h2 class="text-lg font-black" :class="darkMode ? 'text-slate-100' : 'text-slate-900'">📸 Snapshots 快照</h2>
        <p class="mt-1 text-sm" :class="darkMode ? 'text-slate-400' : 'text-slate-500'">保存和恢复完整的提示词状态，最多 {{ maxSnapshots }} 条</p>
      </div>
      <button class="rounded-lg px-4 py-2 text-sm font-bold transition active:scale-95"
        :class="darkMode ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'bg-emerald-500 text-white hover:bg-emerald-600'"
        @click="saveSnapshot">📸 保存快照</button>
    </div>

    <!-- Empty state -->
    <div v-if="!snapshots.length" class="rounded-xl border p-10 text-center"
      :class="darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'">
      <div class="text-4xl mb-3">📸</div>
      <p class="text-sm font-bold" :class="darkMode ? 'text-slate-300' : 'text-slate-600'">还没有快照</p>
      <p class="mt-1 text-xs" :class="darkMode ? 'text-slate-500' : 'text-slate-400'">在 Director 中编辑提示词后，点击上方按钮保存快照</p>
    </div>

    <!-- Snapshot list -->
    <div v-else class="space-y-3">
      <div v-for="snap in snapshots" :key="snap.id"
        class="rounded-xl border overflow-hidden transition-all"
        :class="darkMode ? 'border-slate-700 bg-slate-800 hover:border-emerald-500/50' : 'border-slate-200 bg-white hover:border-emerald-300'">
        <div class="flex items-center justify-between px-4 py-3">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <h4 class="text-sm font-bold truncate" :class="darkMode ? 'text-slate-200' : 'text-slate-800'">{{ snap.title }}</h4>
              <span v-if="snap.score" class="rounded-full px-2 py-0.5 text-[10px] font-bold" :class="scoreBadge(snap.score)">{{ snap.score }}分</span>
              <span v-if="snap.safetyLevel && snap.safetyLevel !== 'Safe'" class="rounded-full px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-700">⚠️ {{ snap.safetyLevel }}</span>
            </div>
            <div class="mt-1 flex flex-wrap items-center gap-2 text-[10px]" :class="darkMode ? 'text-slate-500' : 'text-slate-400'">
              <span>{{ formatDate(snap.createdAt) }}</span>
              <span>·</span>
              <span>{{ snap.selectedModel || '未选模型' }}</span>
              <span>·</span>
              <span>{{ snap.filledModules || 0 }} 模块</span>
              <span v-if="snap.aspectRatio">· {{ snap.aspectRatio }}</span>
              <span v-if="snap.conflictsCount" class="text-amber-500">· {{ snap.conflictsCount }} 冲突</span>
            </div>
            <p v-if="snap.note" class="mt-1 text-xs" :class="darkMode ? 'text-slate-400' : 'text-slate-500'">{{ snap.note }}</p>
          </div>
          <div class="flex items-center gap-1 ml-3">
            <button class="rounded-lg px-3 py-1.5 text-[11px] font-bold transition active:scale-95"
              :class="darkMode ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'bg-emerald-500 text-white hover:bg-emerald-600'"
              @click="$emit('restore', snap)">恢复</button>
            <button class="rounded-lg px-3 py-1.5 text-[11px] font-bold transition active:scale-95"
              :class="darkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
              @click="copyGPTOutput(snap)">复制 GPT</button>
            <button class="rounded-lg px-2 py-1.5 text-[11px] font-bold transition active:scale-95"
              :class="darkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
              @click="exportSnapshot(snap)">📤</button>
            <button class="rounded-lg px-2 py-1.5 text-[11px] font-bold transition active:scale-95 text-red-500"
              :class="darkMode ? 'bg-red-900/20 hover:bg-red-900/40' : 'bg-red-50 hover:bg-red-100'"
              @click="deleteSnapshot(snap.id)">✕</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Import -->
    <div class="mt-4 flex gap-2">
      <button class="rounded-lg px-4 py-2 text-xs font-bold transition"
        :class="darkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
        @click="triggerImport">📥 导入快照 JSON</button>
      <span v-if="snapshots.length >= maxSnapshots" class="text-xs font-bold text-amber-500 self-center">已达上限 ({{ maxSnapshots }})</span>
    </div>
    <input ref="fileInput" class="hidden" type="file" accept=".json" @change="importSnapshot" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { safeRead, safeWrite, getStorageUsage } from '../utils/storageManager.js'
import { buildModelOutputs } from '../utils/modelAdapter.js'
import { downloadJson } from '../utils/storage.js'

const props = defineProps({
  darkMode: { type: Boolean, default: false },
  currentDirector: { type: Object, default: () => ({}) },
  currentOutputs: { type: Object, default: () => ({}) },
  currentScore: { type: Object, default: null },
  currentSafety: { type: Object, default: null },
  currentConflicts: { type: Array, default: () => [] },
  selectedModel: { type: String, default: '' }
})

const emit = defineEmits(['restore', 'toast'])

const STORAGE_KEY = 'prompt_market_snapshots'
const maxSnapshots = 20
const snapshots = ref([])
const fileInput = ref(null)

function loadSnapshots() {
  snapshots.value = safeRead(STORAGE_KEY, [])
}

function saveSnapshots(data) {
  const result = safeWrite(STORAGE_KEY, data)
  if (!result.success) {
    emit('toast', { message: result.error, type: 'error' })
    return false
  }
  return true
}

function saveSnapshot() {
  const d = props.currentDirector
  if (!d || !Object.values(d).some(v => v && v.trim())) {
    emit('toast', { message: '请先在 Director 中填写内容', type: 'error' })
    return
  }

  const filledModules = Object.values(d).filter(v => v && v.trim()).length
  const outputs = props.currentOutputs || {}
  const gptText = outputs.gptImage?.text || ''

  const snap = {
    id: `snap_${Date.now()}`,
    title: d.subject ? d.subject.slice(0, 40) : '未命名快照',
    createdAt: new Date().toISOString(),
    appVersion: '3.0.0',
    director: { ...d },
    selectedModel: props.selectedModel || d.model || '',
    outputs: { ...outputs },
    score: props.currentScore?.score || null,
    safetyLevel: props.currentSafety?.level || 'Safe',
    conflictsCount: props.currentConflicts?.length || 0,
    aspectRatio: d.ratio || '',
    filledModules,
    note: ''
  }

  const updated = [snap, ...snapshots.value].slice(0, maxSnapshots)
  if (saveSnapshots(updated)) {
    snapshots.value = updated
    emit('toast', { message: `快照已保存 (${filledModules} 模块)` })
  }
}

function deleteSnapshot(id) {
  const updated = snapshots.value.filter(s => s.id !== id)
  if (saveSnapshots(updated)) {
    snapshots.value = updated
    emit('toast', { message: '快照已删除' })
  }
}

async function copyGPTOutput(snap) {
  const text = snap.outputs?.gptImage?.text || ''
  if (!text) { emit('toast', { message: '该快照无 GPT Image 输出', type: 'error' }); return }
  try { await navigator.clipboard.writeText(text) } catch {
    const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.left = '-9999px'
    document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove()
  }
  emit('toast', { message: '已复制 GPT Image 输出' })
}

function exportSnapshot(snap) {
  downloadJson(snap, `snapshot_${snap.title || 'unnamed'}_${Date.now()}.json`)
  emit('toast', { message: '快照已导出' })
}

function triggerImport() {
  fileInput.value?.click()
}

function importSnapshot(event) {
  const file = event.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    try {
      const data = JSON.parse(String(reader.result || '{}'))
      if (!data.director) { emit('toast', { message: '无效的快照文件', type: 'error' }); return }
      const snap = {
        ...data,
        id: `snap_${Date.now()}`,
        createdAt: data.createdAt || new Date().toISOString(),
        appVersion: '3.0.0'
      }
      const updated = [snap, ...snapshots.value].slice(0, maxSnapshots)
      if (saveSnapshots(updated)) {
        snapshots.value = updated
        emit('toast', { message: '快照已导入' })
      }
    } catch { emit('toast', { message: 'JSON 解析失败', type: 'error' }) }
  }
  reader.readAsText(file)
  event.target.value = ''
}

function scoreBadge(score) {
  if (score >= 90) return 'bg-emerald-100 text-emerald-700'
  if (score >= 70) return 'bg-blue-100 text-blue-700'
  if (score >= 50) return 'bg-amber-100 text-amber-700'
  return 'bg-red-100 text-red-700'
}

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
}

onMounted(loadSnapshots)
</script>
