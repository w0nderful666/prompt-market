<template>
  <div class="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
    <div class="flex max-h-[82vh] w-full max-w-lg flex-col rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
      <div class="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <h3 class="font-bold text-slate-900">已保存方案</h3>
        <button class="rounded-full bg-slate-100 px-3 py-1 text-slate-500" @click="$emit('close')">×</button>
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto p-4">
        <div v-if="!schemes.length" class="py-12 text-center text-sm text-slate-400">暂无保存的方案</div>
        <div v-else class="space-y-3">
          <article v-for="scheme in schemes" :key="scheme.id" class="rounded-lg bg-slate-50 p-4">
            <div class="mb-3">
              <div class="flex items-center justify-between gap-2">
                <h4 class="font-semibold text-slate-800">{{ scheme.name }}</h4>
                <span class="rounded bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-700">
                  {{ modeName(scheme.promptState?.mode) }}
                </span>
              </div>
              <p class="mt-1 text-xs text-slate-400">
                {{ (scheme.prompts || []).length }} 个关键词 · {{ formatDate(scheme.updatedAt || scheme.createdAt) }}
              </p>
            </div>
            <div class="mb-3 line-clamp-2 text-sm text-slate-500">
              {{ previewText(scheme) }}
            </div>
            <div class="flex gap-2">
              <button class="scheme-btn primary" @click="$emit('restore', scheme)">恢复</button>
              <button class="scheme-btn danger" @click="$emit('delete', scheme.id)">删除</button>
            </div>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  schemes: { type: Array, default: () => [] }
})

defineEmits(['close', 'restore', 'delete'])

function formatDate(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return `${date.getMonth() + 1}月${date.getDate()}日 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

function modeName(mode) {
  return {
    keywords: '关键词',
    natural: '自然语言',
    enhanced: '增强',
    template: '模板'
  }[mode] || '旧方案'
}

function previewText(scheme) {
  if (scheme.promptState?.positiveText) return scheme.promptState.positiveText
  return (scheme.prompts || []).map((item) => item.zh).join('，')
}
</script>

<style scoped>
.scheme-btn {
  flex: 1;
  border-radius: 8px;
  padding: 8px;
  font-size: 13px;
  font-weight: 700;
}

.scheme-btn.primary {
  background: #22c55e;
  color: white;
}

.scheme-btn.danger {
  background: #fee2e2;
  color: #dc2626;
}
</style>
