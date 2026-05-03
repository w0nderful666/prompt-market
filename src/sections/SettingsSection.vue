<template>
  <div class="mx-auto max-w-3xl p-4 space-y-4">
    <!-- Dark mode -->
    <div class="rounded-xl border p-5" :class="darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'">
      <h3 class="text-sm font-bold mb-4" :class="darkMode ? 'text-slate-200' : 'text-slate-800'">⚙️ 设置</h3>
      <div class="flex items-center justify-between py-3 border-b" :class="darkMode ? 'border-slate-700' : 'border-slate-100'">
        <div>
          <div class="text-sm font-semibold" :class="darkMode ? 'text-slate-200' : 'text-slate-700'">🌙 深色模式</div>
          <div class="text-xs" :class="darkMode ? 'text-slate-400' : 'text-slate-500'">切换亮色/暗色主题</div>
        </div>
        <button class="rounded-full px-4 py-1.5 text-xs font-bold transition"
          :class="darkMode ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'"
          @click="$emit('toggle-dark')">{{ darkMode ? '已开启' : '已关闭' }}</button>
      </div>
    </div>

    <!-- Storage usage -->
    <div class="rounded-xl border p-5" :class="darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'">
      <h3 class="text-sm font-bold mb-3" :class="darkMode ? 'text-slate-200' : 'text-slate-800'">💾 本地存储</h3>
      <div class="flex items-center gap-3 mb-3">
        <div class="flex-1 h-2 rounded-full overflow-hidden" :class="darkMode ? 'bg-slate-700' : 'bg-slate-100'">
          <div class="h-full rounded-full transition-all" :class="usagePercent > 80 ? 'bg-red-500' : usagePercent > 50 ? 'bg-amber-500' : 'bg-emerald-500'" :style="{ width: Math.min(usagePercent, 100) + '%' }"></div>
        </div>
        <span class="text-xs font-bold" :class="darkMode ? 'text-slate-400' : 'text-slate-500'">{{ usage.formatted }}</span>
      </div>
      <p class="text-[11px]" :class="darkMode ? 'text-slate-500' : 'text-slate-400'">浏览器 localStorage 通常限制 5-10MB，当前使用约 {{ usage.formatted }}</p>
    </div>

    <!-- Import / Export All -->
    <div class="rounded-xl border p-5" :class="darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'">
      <h3 class="text-sm font-bold mb-3" :class="darkMode ? 'text-slate-200' : 'text-slate-800'">📤 数据管理</h3>
      <div class="grid gap-2 sm:grid-cols-2">
        <button class="settings-btn" :class="darkMode ? 'settings-btn-dark' : ''" @click="$emit('export-all')">📤 Export All Data</button>
        <button class="settings-btn" :class="darkMode ? 'settings-btn-dark' : ''" @click="$emit('import-all')">📥 Import All Data</button>
        <button class="settings-btn" :class="darkMode ? 'settings-btn-dark' : ''" @click="$emit('export-library')">📚 导出词库</button>
        <button class="settings-btn" :class="darkMode ? 'settings-btn-dark' : ''" @click="$emit('import-library')">📚 导入词库</button>
      </div>
    </div>

    <!-- Clear actions -->
    <div class="rounded-xl border p-5" :class="darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'">
      <h3 class="text-sm font-bold mb-3" :class="darkMode ? 'text-slate-200' : 'text-slate-800'">🗑️ 清理数据</h3>
      <div class="grid gap-2 sm:grid-cols-2">
        <button class="settings-btn" :class="darkMode ? 'settings-btn-dark' : ''" @click="$emit('clear-history')">🧹 清空历史</button>
        <button class="settings-btn" :class="darkMode ? 'settings-btn-dark' : ''" @click="$emit('clear-diff')">🔀 清空 Diff</button>
        <button class="settings-btn" :class="darkMode ? 'settings-btn-dark' : ''" @click="$emit('clear-snapshots')">📸 清空 Snapshots</button>
        <button class="settings-btn" :class="darkMode ? 'settings-btn-dark' : ''" @click="$emit('clear-packs')">📦 清空用户 Packs</button>
        <button class="settings-btn" :class="darkMode ? 'settings-btn-dark' : ''" @click="$emit('reset-settings')">🔄 恢复默认设置</button>
        <button class="settings-btn danger" :class="darkMode ? 'settings-btn-dark' : ''" @click="$emit('clear-all')">🗑️ 清空所有数据</button>
      </div>
    </div>

    <!-- About -->
    <div class="rounded-xl border p-5" :class="darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'">
      <h3 class="text-sm font-bold mb-2" :class="darkMode ? 'text-slate-200' : 'text-slate-800'">ℹ️ 关于</h3>
      <div class="text-xs space-y-1" :class="darkMode ? 'text-slate-400' : 'text-slate-500'">
        <p>Prompt Director Studio v{{ appMeta.version }}</p>
        <p>{{ appMeta.tagline }}</p>
        <p>所有数据保存在浏览器 localStorage，不上传服务器。</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { appMeta } from '../config/appMeta.js'
import { getStorageUsage } from '../utils/storageManager.js'

defineProps({
  darkMode: { type: Boolean, default: false }
})

defineEmits([
  'toggle-dark', 'export-all', 'import-all', 'export-library', 'import-library',
  'clear-history', 'clear-diff', 'clear-snapshots', 'clear-packs',
  'reset-settings', 'clear-all'
])

const usage = ref({ bytes: 0, kb: 0, mb: 0, formatted: '0 B' })
const usagePercent = computed(() => Math.round(usage.value.bytes / (5 * 1024 * 1024) * 100))

function refreshUsage() {
  usage.value = getStorageUsage()
}

onMounted(refreshUsage)

defineExpose({ refreshUsage })
</script>

<style scoped>
.settings-btn {
  border-radius: 8px; background: #f1f5f9; padding: 8px 14px;
  font-size: 12px; font-weight: 700; color: #475569; transition: all 0.15s;
  text-align: left;
}
.settings-btn:hover { background: #e2e8f0; }
.settings-btn-dark { background: #334155; color: #cbd5e1; }
.settings-btn-dark:hover { background: #475569; }
.settings-btn.danger { background: #fef2f2; color: #dc2626; }
.settings-btn.danger:hover { background: #fee2e2; }
.settings-btn.danger-dark { background: #450a0a; color: #fca5a5; }
</style>
