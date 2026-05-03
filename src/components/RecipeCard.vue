<template>
  <div class="recipe-card group relative overflow-hidden rounded-xl border transition-all duration-200 hover:shadow-lg"
    :class="darkMode
      ? 'border-slate-700 bg-gradient-to-br from-slate-800 to-slate-800/80 hover:border-violet-500/50'
      : 'border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-violet-300'"
  >
    <!-- Top accent bar -->
    <div class="h-1 w-full" :class="scoreColor"></div>

    <div class="p-4">
      <!-- Header -->
      <div class="mb-3 flex items-start justify-between">
        <div class="flex-1 min-w-0">
          <h4 class="truncate text-sm font-bold" :class="darkMode ? 'text-slate-200' : 'text-slate-800'">{{ recipe.name }}</h4>
          <p class="mt-0.5 text-[11px]" :class="darkMode ? 'text-slate-500' : 'text-slate-400'">{{ recipe.model || '未指定模型' }}</p>
        </div>
        <div class="flex items-center gap-1">
          <span class="rounded-full px-2 py-0.5 text-[10px] font-bold" :class="scoreBadgeClass">
            {{ recipe.score || 0 }}分
          </span>
        </div>
      </div>

      <!-- Tags -->
      <div v-if="recipe.tags && recipe.tags.length" class="mb-3 flex flex-wrap gap-1">
        <span
          v-for="tag in recipe.tags.slice(0, 4)"
          :key="tag"
          class="rounded-full px-2 py-0.5 text-[10px] font-medium"
          :class="darkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'"
        >{{ tag }}</span>
        <span v-if="recipe.tags.length > 4" class="rounded-full px-2 py-0.5 text-[10px]" :class="darkMode ? 'text-slate-500' : 'text-slate-400'">
          +{{ recipe.tags.length - 4 }}
        </span>
      </div>

      <!-- Ratio & Time -->
      <div class="mb-3 flex items-center gap-3 text-[11px]" :class="darkMode ? 'text-slate-500' : 'text-slate-400'">
        <span v-if="recipe.ratio">📐 {{ recipe.ratio }}</span>
        <span v-if="recipe.updatedAt">🕐 {{ formatDate(recipe.updatedAt) }}</span>
      </div>

      <!-- Actions -->
      <div class="flex gap-2">
        <button
          class="flex-1 rounded-lg py-1.5 text-[11px] font-bold transition active:scale-95"
          :class="darkMode ? 'bg-violet-600 text-white hover:bg-violet-500' : 'bg-violet-500 text-white hover:bg-violet-600'"
          @click="$emit('load', recipe)"
        >加载</button>
        <button
          class="rounded-lg px-3 py-1.5 text-[11px] font-bold transition active:scale-95"
          :class="darkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
          @click="$emit('copy', recipe)"
        >复制</button>
        <button
          class="rounded-lg px-3 py-1.5 text-[11px] font-bold transition active:scale-95"
          :class="darkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
          @click="$emit('export', recipe)"
        >导出</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  recipe: { type: Object, required: true },
  darkMode: { type: Boolean, default: false }
})

defineEmits(['load', 'copy', 'export'])

const scoreColor = computed(() => {
  const s = props.recipe.score || 0
  if (s >= 90) return 'bg-emerald-500'
  if (s >= 70) return 'bg-blue-500'
  if (s >= 50) return 'bg-amber-500'
  return 'bg-red-500'
})

const scoreBadgeClass = computed(() => {
  const s = props.recipe.score || 0
  if (s >= 90) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
  if (s >= 70) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
  if (s >= 50) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
  return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
})

function formatDate(iso) {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
  } catch { return '' }
}
</script>
