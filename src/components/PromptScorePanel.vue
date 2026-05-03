<template>
  <div class="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
    <div class="border-b border-slate-100 dark:border-slate-700 px-4 py-3">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-bold text-slate-800 dark:text-slate-200">📊 提示词质量评分</h3>
        <div class="flex items-center gap-2">
          <span v-if="score" class="rounded-full px-2 py-0.5 text-[10px] font-bold" :class="levelBadgeClass">
            {{ levelText }}
          </span>
          <button
            class="rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-600"
            @click="$emit('score')"
          >评分</button>
        </div>
      </div>
    </div>
    <div v-if="score" class="p-4">
      <!-- Score Circle -->
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
          <div class="text-sm font-bold" :class="scoreTextColor">{{ levelText }}</div>
          <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {{ passedCount }} / {{ totalCount }} 项通过
          </div>
          <div class="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
            {{ partialCount }} 项部分通过
          </div>
        </div>
      </div>

      <!-- Pros -->
      <div v-if="score.pros.length" class="mb-3">
        <div class="mb-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">✅ 优点</div>
        <ul class="space-y-1">
          <li v-for="pro in score.pros" :key="pro" class="text-xs text-slate-600 dark:text-slate-400">• {{ pro }}</li>
        </ul>
      </div>

      <!-- 16 Dimension Details -->
      <div class="mb-3">
        <div class="mb-1 text-xs font-bold" :class="darkMode ? 'text-slate-300' : 'text-slate-700'">📋 16 维度详情</div>
        <div class="space-y-1">
          <div v-for="detail in score.details" :key="detail.id"
            class="flex items-center justify-between rounded px-2 py-1 text-[11px]"
            :class="detail.passed
              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
              : detail.partial
              ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'
              : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'">
            <span class="font-medium">{{ detail.label }}</span>
            <span class="font-mono">{{ detail.score }}/{{ detail.maxScore }}</span>
          </div>
        </div>
      </div>

      <!-- Suggestions -->
      <div v-if="score.suggestions.length">
        <div class="mb-1 text-xs font-bold text-amber-600 dark:text-amber-400">💡 建议</div>
        <ul class="space-y-1">
          <li v-for="sug in score.suggestions" :key="sug" class="text-xs text-slate-600 dark:text-slate-400">• {{ sug }}</li>
        </ul>
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
  score: { type: Object, default: null },
  darkMode: { type: Boolean, default: false }
})

defineEmits(['score'])

const circumference = 2 * Math.PI * 34

const levelText = computed(() => {
  if (!props.score) return ''
  const map = { 'Excellent': '优秀', 'Good': '良好', 'Needs Work': '需改进', 'Incomplete': '待完善' }
  return map[props.score.level] || props.score.level
})

const passedCount = computed(() => props.score?.details?.filter(d => d.passed).length || 0)
const partialCount = computed(() => props.score?.details?.filter(d => d.partial).length || 0)
const totalCount = computed(() => props.score?.details?.length || 0)

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

const levelBadgeClass = computed(() => {
  if (!props.score) return ''
  const s = props.score.score
  if (s >= 90) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
  if (s >= 70) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
  if (s >= 50) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
  return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
})
</script>
