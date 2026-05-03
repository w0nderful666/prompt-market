<template>
  <div v-if="conflicts.length" class="rounded-xl border border-amber-300 bg-amber-50 dark:border-amber-600 dark:bg-amber-900/20">
    <div class="flex items-center justify-between border-b border-amber-200 dark:border-amber-700 px-4 py-2">
      <div class="flex items-center gap-2">
        <span class="text-base">⚠️</span>
        <span class="text-xs font-bold text-amber-800 dark:text-amber-300">检测到 {{ conflicts.length }} 个冲突</span>
      </div>
      <button class="text-xs text-amber-600 dark:text-amber-400 hover:underline" @click="$emit('dismiss')">忽略</button>
    </div>
    <div class="divide-y divide-amber-200 dark:divide-amber-700">
      <div v-for="c in conflicts" :key="c.id" class="px-4 py-3">
        <div class="flex items-start gap-2">
          <span class="mt-0.5 text-amber-500">⚡</span>
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-amber-800 dark:text-amber-300">{{ c.label }}</span>
              <span class="rounded-full px-1.5 py-0.5 text-[10px] font-bold"
                :class="riskBadgeClass(c.riskLevel)">
                {{ riskLabel(c.riskLevel) }}
              </span>
            </div>
            <div class="mt-1 text-xs text-amber-700 dark:text-amber-400">
              <span class="rounded bg-amber-200 dark:bg-amber-700 px-1.5 py-0.5 font-mono text-[11px]">"{{ c.foundA || c.found[0] }}"</span>
              <span class="mx-1">与</span>
              <span class="rounded bg-amber-200 dark:bg-amber-700 px-1.5 py-0.5 font-mono text-[11px]">"{{ c.foundB || c.found[1] }}"</span>
              <span class="mx-1">冲突</span>
            </div>
            <div v-if="c.reason" class="mt-1 text-[11px] text-amber-600 dark:text-amber-500">
              {{ c.reason }}
            </div>
            <div class="mt-1 text-[11px] text-amber-600 dark:text-amber-500">💡 {{ c.suggestion }}</div>
            <!-- Remove Word Buttons -->
            <div class="mt-2 flex flex-wrap gap-1">
              <button class="rounded px-2 py-0.5 text-[10px] font-bold transition active:scale-95 bg-amber-200 dark:bg-amber-700 text-amber-800 dark:text-amber-200 hover:bg-amber-300 dark:hover:bg-amber-600"
                @click="$emit('remove-word', c.foundA || c.found[0])">
                ✕ 移除 "{{ c.foundA || c.found[0] }}"
              </button>
              <button class="rounded px-2 py-0.5 text-[10px] font-bold transition active:scale-95 bg-amber-200 dark:bg-amber-700 text-amber-800 dark:text-amber-200 hover:bg-amber-300 dark:hover:bg-amber-600"
                @click="$emit('remove-word', c.foundB || c.found[1])">
                ✕ 移除 "{{ c.foundB || c.found[1] }}"
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  conflicts: { type: Array, default: () => [] }
})

defineEmits(['dismiss', 'remove-word'])

function riskBadgeClass(level) {
  if (level === 'high') return 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400'
  if (level === 'medium') return 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400'
  return 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
}

function riskLabel(level) {
  if (level === 'high') return '高风险'
  if (level === 'medium') return '中风险'
  return '低风险'
}
</script>
