<template>
  <div class="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
    <div class="border-b border-slate-100 dark:border-slate-700 px-4 py-3">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-bold text-slate-800 dark:text-slate-200">📊 提示词质量评分</h3>
        <button
          class="rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-600"
          @click="$emit('score')"
        >评分</button>
      </div>
    </div>
    <div v-if="score" class="p-4">
      <div class="mb-4 flex items-center gap-4">
        <div class="relative h-20 w-20">
          <svg class="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke-width="6" class="stroke-slate-100 dark:stroke-slate-700" />
            <circle cx="40" cy="40" r="34" fill="none" stroke-width="6" stroke-linecap="round"
              :class="scoreColor"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="circumference - (score.score / 100) * circumference"
            />
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span class="text-lg font-black" :class="scoreTextColor">{{ score.score }}</span>
            <span class="text-[10px] text-slate-400">/ 100</span>
          </div>
        </div>
        <div>
          <div class="text-sm font-bold" :class="scoreTextColor">{{ score.level }}</div>
          <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {{ score.details.filter(d => d.passed).length }} / {{ score.details.length }} 项通过
          </div>
        </div>
      </div>

      <div v-if="score.pros.length" class="mb-3">
        <div class="mb-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">✅ 优点</div>
        <ul class="space-y-1">
          <li v-for="pro in score.pros" :key="pro" class="text-xs text-slate-600 dark:text-slate-400">• {{ pro }}</li>
        </ul>
      </div>

      <div v-if="score.suggestions.length">
        <div class="mb-1 text-xs font-bold text-amber-600 dark:text-amber-400">💡 建议</div>
        <ul class="space-y-1">
          <li v-for="sug in score.suggestions" :key="sug" class="text-xs text-slate-600 dark:text-slate-400">• {{ sug }}</li>
        </ul>
      </div>

      <div class="mt-3 grid grid-cols-5 gap-1">
        <div v-for="detail in score.details" :key="detail.id"
          class="rounded px-1 py-0.5 text-center text-[10px] font-medium"
          :class="detail.passed ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400'"
          :title="detail.label"
        >
          {{ detail.label.slice(0, 4) }}
        </div>
      </div>
    </div>
    <div v-else class="p-6 text-center text-xs text-slate-400">
      点击"评分"按钮查看提示词质量分析
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  score: { type: Object, default: null }
})

defineEmits(['score'])

const circumference = 2 * Math.PI * 34

const scoreColor = computed(() => {
  if (!props.score) return 'stroke-slate-300'
  const s = props.score.score
  if (s >= 90) return 'stroke-emerald-500'
  if (s >= 70) return 'stroke-blue-500'
  if (s >= 50) return 'stroke-amber-500'
  return 'stroke-red-500'
})

const scoreTextColor = computed(() => {
  if (!props.score) return 'text-slate-500'
  const s = props.score.score
  if (s >= 90) return 'text-emerald-600 dark:text-emerald-400'
  if (s >= 70) return 'text-blue-600 dark:text-blue-400'
  if (s >= 50) return 'text-amber-600 dark:text-amber-400'
  return 'text-red-600 dark:text-red-400'
})
</script>
