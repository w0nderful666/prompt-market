<template>
  <div v-if="safety" class="rounded-xl border overflow-hidden"
    :class="levelBorderClass">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3"
      :class="levelBgClass">
      <div class="flex items-center gap-2">
        <span class="text-base">{{ levelIcon }}</span>
        <span class="text-sm font-bold" :class="levelTextClass">安全检查</span>
        <span class="rounded-full px-2 py-0.5 text-[10px] font-bold"
          :class="levelBadgeClass">{{ safety.level }}</span>
      </div>
      <span class="text-xs" :class="levelTextClass">{{ safety.hits.length }} 项提示</span>
    </div>

    <!-- Hits -->
    <div v-if="safety.hits.length" class="divide-y" :class="levelDivideClass">
      <div v-for="hit in safety.hits" :key="hit.type" class="px-4 py-3">
        <div class="flex items-start gap-2">
          <span class="mt-0.5">{{ hit.level === 'Risky' ? '🔴' : '🟡' }}</span>
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold" :class="levelTextClass">{{ hit.reason }}</span>
              <span class="rounded-full px-1.5 py-0.5 text-[10px] font-bold"
                :class="hit.level === 'Risky' ? 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400'">
                {{ hit.level }}
              </span>
            </div>
            <div v-if="hit.keywords.length" class="mt-1 flex flex-wrap gap-1">
              <span v-for="kw in hit.keywords" :key="kw"
                class="rounded bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 font-mono text-[10px]"
                :class="levelTextClass">{{ kw }}</span>
            </div>
            <div class="mt-1 text-[11px]" :class="hit.level === 'Risky' ? 'text-red-500 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'">
              💡 {{ hit.suggestion }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Fixes -->
    <div v-if="safety.quickFixes.length" class="px-4 py-3 border-t" :class="levelDivideClass">
      <div class="mb-2 text-xs font-bold" :class="levelTextClass">🛠️ 快速修复</div>
      <div class="flex flex-wrap gap-2">
        <button v-for="(fix, idx) in safety.quickFixes" :key="idx"
          class="rounded-lg px-3 py-1.5 text-[11px] font-bold transition active:scale-95"
          :class="darkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'"
          @click="$emit('apply-fix', idx)">
          {{ fix.label }}
        </button>
      </div>
    </div>

    <!-- No issues -->
    <div v-if="!safety.hits.length" class="px-4 py-4 text-center">
      <span class="text-sm">✅</span>
      <span class="ml-1 text-xs" :class="darkMode ? 'text-slate-400' : 'text-slate-500'">未检测到安全风险</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  safety: { type: Object, default: null },
  darkMode: { type: Boolean, default: false }
})

defineEmits(['apply-fix'])

const levelIcon = computed(() => {
  if (!props.safety) return '🛡️'
  return props.safety.level === 'Safe' ? '✅' : props.safety.level === 'Caution' ? '⚠️' : '🚨'
})

const levelBorderClass = computed(() => {
  if (!props.safety) return 'border-slate-200 dark:border-slate-700'
  return props.safety.level === 'Safe'
    ? 'border-emerald-200 dark:border-emerald-700'
    : props.safety.level === 'Caution'
    ? 'border-amber-200 dark:border-amber-600'
    : 'border-red-200 dark:border-red-600'
})

const levelBgClass = computed(() => {
  if (!props.safety) return 'bg-slate-50 dark:bg-slate-800'
  return props.safety.level === 'Safe'
    ? 'bg-emerald-50 dark:bg-emerald-900/20'
    : props.safety.level === 'Caution'
    ? 'bg-amber-50 dark:bg-amber-900/20'
    : 'bg-red-50 dark:bg-red-900/20'
})

const levelTextClass = computed(() => {
  if (!props.safety) return 'text-slate-600 dark:text-slate-400'
  return props.safety.level === 'Safe'
    ? 'text-emerald-700 dark:text-emerald-300'
    : props.safety.level === 'Caution'
    ? 'text-amber-700 dark:text-amber-300'
    : 'text-red-700 dark:text-red-300'
})

const levelBadgeClass = computed(() => {
  if (!props.safety) return ''
  return props.safety.level === 'Safe'
    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
    : props.safety.level === 'Caution'
    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
    : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
})

const levelDivideClass = computed(() => {
  if (!props.safety) return 'divide-slate-200 dark:divide-slate-700'
  return props.safety.level === 'Safe'
    ? 'divide-emerald-200 dark:divide-emerald-700'
    : props.safety.level === 'Caution'
    ? 'divide-amber-200 dark:divide-amber-600'
    : 'divide-red-200 dark:divide-red-600'
})
</script>
