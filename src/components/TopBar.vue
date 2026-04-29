<template>
  <header class="sticky top-0 z-40 border-b border-emerald-100 bg-white/95 px-4 py-3 backdrop-blur">
    <div class="mx-auto flex max-w-7xl items-center justify-between gap-3">
      <div>
        <h1 class="text-lg font-bold text-slate-900 sm:text-xl">提示词集市</h1>
        <p class="mt-0.5 text-xs text-slate-400">版本 {{ version }} · 更新 {{ updatedAt }}</p>
      </div>

      <div class="flex items-center gap-2 overflow-x-auto">
        <button class="top-btn" title="导入词库" @click="$emit('import')">导入</button>
        <button class="top-btn" title="导出词库" @click="$emit('export-library')">导出词库</button>
        <button class="top-btn" title="导出方案" @click="$emit('export-schemes')">导出方案</button>
        <button class="top-btn" title="查看方案" @click="$emit('schemes')">方案</button>
        <button class="top-btn danger" title="清空全部" @click="$emit('clear')">清空</button>
        <button class="top-btn" title="重置词库" @click="$emit('reset')">重置</button>
      </div>
    </div>
  </header>
</template>

<script setup>
defineProps({
  version: { type: String, default: '1.0.0' },
  updatedAt: { type: String, default: '' }
})

defineEmits(['import', 'export-library', 'export-schemes', 'schemes', 'clear', 'reset'])
</script>

<style scoped>
.top-btn {
  white-space: nowrap;
  border-radius: 999px;
  border: 1px solid #d1fae5;
  background: #f0fdf4;
  padding: 7px 11px;
  font-size: 12px;
  font-weight: 600;
  color: #047857;
}

.top-btn:hover {
  background: #dcfce7;
}

.top-btn.danger {
  border-color: #fee2e2;
  background: #fff7f7;
  color: #dc2626;
}
</style>
