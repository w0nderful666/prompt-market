<template>
  <div class="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
    <div class="border-b border-slate-100 dark:border-slate-700 px-4 py-3">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-bold text-slate-800 dark:text-slate-200">🧹 Token Cleaner</h3>
        <button
          class="rounded-full bg-teal-500 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-teal-600 active:scale-95"
          @click="$emit('clean')"
        >一键清理</button>
      </div>
    </div>
    <div class="p-4">
      <div v-if="issues.length" class="space-y-2">
        <div
          v-for="(issue, i) in issues"
          :key="i"
          class="flex items-center gap-2 rounded-lg px-3 py-2 text-xs"
          :class="issue.type === 'duplicate' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                   issue.type === 'empty_modules' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' :
                   'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300'"
        >
          <span>{{ issue.type === 'duplicate' ? '🔄' : issue.type === 'empty_modules' ? '📭' : '✨' }}</span>
          <span>{{ issue.message }}</span>
        </div>
      </div>
      <div v-else class="py-4 text-center text-xs text-slate-400">
        点击"一键清理"检查重复词、空模块和格式问题
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  issues: { type: Array, default: () => [] }
})
defineEmits(['clean'])
</script>
