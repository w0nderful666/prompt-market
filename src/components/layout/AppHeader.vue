<template>
  <header class="sticky top-0 z-40 border-b backdrop-blur" :class="darkMode ? 'border-slate-700 bg-slate-800/95' : 'border-emerald-100 bg-white/95'">
    <div class="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2">
      <div class="flex items-center gap-3">
        <h1 class="text-base font-black sm:text-lg" :class="darkMode ? 'text-slate-100' : 'text-slate-900'">
          🎬 Prompt Director Studio
        </h1>
        <span class="hidden sm:inline rounded-full px-2 py-0.5 text-[10px] font-bold" :class="darkMode ? 'bg-emerald-900/40 text-emerald-300' : 'bg-emerald-100 text-emerald-700'">v{{ appMeta.version }}</span>
      </div>
      <div class="flex items-center gap-2">
        <slot name="actions" />
        <button class="top-btn" :class="darkMode ? 'dark' : ''" @click="$emit('toggle-dark')">{{ darkMode ? '☀️' : '🌙' }}</button>
      </div>
    </div>
    <slot />
  </header>
</template>

<script setup>
import { appMeta } from '../../config/appMeta.js'

defineProps({
  darkMode: { type: Boolean, default: false }
})

defineEmits(['toggle-dark'])
</script>

<style scoped>
.top-btn {
  white-space: nowrap; border-radius: 999px; border: 1px solid #d1fae5;
  background: #f0fdf4; padding: 7px 11px; font-size: 12px; font-weight: 600; color: #047857;
}
.top-btn:hover { background: #dcfce7; }
.top-btn.dark { border-color: #334155; background: #1e293b; color: #86efac; }
.top-btn.dark:hover { background: #334155; }
</style>
