<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
    <div class="w-full max-w-md rounded-2xl p-5 shadow-xl" :class="darkMode ? 'bg-slate-800' : 'bg-white'">
      <h3 class="mb-4 font-bold" :class="darkMode ? 'text-slate-100' : 'text-slate-900'">
        {{ mode === 'export' ? '📤 Export All Data' : '📥 Import All Data' }}
      </h3>

      <!-- Export mode -->
      <div v-if="mode === 'export'">
        <p class="text-xs mb-3" :class="darkMode ? 'text-slate-400' : 'text-slate-500'">
          导出所有本地数据，包括设置、当前编辑、快照、Packs、配方等。
        </p>
        <div class="rounded-lg border p-3 mb-4 text-xs" :class="darkMode ? 'border-slate-700 bg-slate-700/50 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-600'">
          <p>📊 当前占用: {{ usage.formatted }}</p>
          <p>📦 版本: {{ exportData?.appVersion }}</p>
          <p>🕐 导出时间: {{ exportData ? new Date(exportData.exportedAt).toLocaleString() : '—' }}</p>
        </div>
        <div class="flex gap-2">
          <button class="flex-1 rounded-lg py-2 text-sm font-bold" :class="darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'" @click="$emit('close')">取消</button>
          <button class="flex-1 rounded-lg bg-emerald-500 py-2 text-sm font-bold text-white" @click="$emit('export')">下载 JSON</button>
        </div>
      </div>

      <!-- Import mode -->
      <div v-if="mode === 'import'">
        <p class="text-xs mb-3" :class="darkMode ? 'text-slate-400' : 'text-slate-500'">
          导入之前导出的 JSON 数据文件。
        </p>
        <div v-if="importPreview" class="rounded-lg border p-3 mb-4 text-xs" :class="darkMode ? 'border-slate-700 bg-slate-700/50' : 'border-slate-200 bg-slate-50'">
          <p class="font-bold mb-2" :class="darkMode ? 'text-slate-200' : 'text-slate-700'">📋 导入预览</p>
          <p :class="darkMode ? 'text-slate-400' : 'text-slate-600'">版本: {{ importPreview.appVersion || '未知' }}</p>
          <p :class="darkMode ? 'text-slate-400' : 'text-slate-600'">数据项: {{ importPreview.dataCount || 0 }} 个 key</p>
          <p :class="darkMode ? 'text-slate-400' : 'text-slate-600'">导出时间: {{ importPreview.exportedAt ? new Date(importPreview.exportedAt).toLocaleString() : '未知' }}</p>
        </div>
        <div v-if="importError" class="rounded-lg border border-red-300 bg-red-50 p-3 mb-4 text-xs text-red-700">
          ❌ {{ importError }}
        </div>
        <div v-if="importResult" class="rounded-lg border p-3 mb-4 text-xs" :class="importResult.success ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-amber-300 bg-amber-50 text-amber-700'">
          <p>✅ 导入: {{ importResult.imported }} 项</p>
          <p v-if="importResult.skipped">⏭️ 跳过: {{ importResult.skipped }} 项</p>
          <p v-if="importResult.errors?.length">❌ 错误: {{ importResult.errors.length }} 项</p>
        </div>
        <div class="flex gap-2 mb-3">
          <label class="flex-1">
            <input type="radio" v-model="importMode" value="merge" class="mr-1" />
            <span class="text-xs" :class="darkMode ? 'text-slate-300' : 'text-slate-600'">合并导入</span>
          </label>
          <label class="flex-1">
            <input type="radio" v-model="importMode" value="overwrite" class="mr-1" />
            <span class="text-xs" :class="darkMode ? 'text-slate-300' : 'text-slate-600'">覆盖导入</span>
          </label>
        </div>
        <div class="flex gap-2">
          <button class="flex-1 rounded-lg py-2 text-sm font-bold" :class="darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'" @click="$emit('close')">{{ importResult ? '关闭' : '取消' }}</button>
          <button v-if="!importResult" class="flex-1 rounded-lg bg-emerald-500 py-2 text-sm font-bold text-white" :disabled="!importPreview" @click="$emit('import-confirm', importMode)">确认导入</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  darkMode: { type: Boolean, default: false },
  mode: { type: String, default: 'export' },
  usage: { type: Object, default: () => ({ formatted: '0 B' }) },
  exportData: { type: Object, default: null },
  importPreview: { type: Object, default: null },
  importError: { type: String, default: '' },
  importResult: { type: Object, default: null }
})

defineEmits(['close', 'export', 'import-confirm'])

const importMode = ref('merge')
</script>
