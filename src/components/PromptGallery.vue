<template>
  <div class="prompt-gallery">
    <div class="mb-4 flex items-center justify-between">
      <div>
        <h3 class="text-sm font-bold" :class="darkMode ? 'text-slate-200' : 'text-slate-800'">🖼️ Prompt Gallery</h3>
        <p class="mt-0.5 text-xs" :class="darkMode ? 'text-slate-500' : 'text-slate-400'">内置 6 个完整可用的高级示例，一键加载</p>
      </div>
      <button
        class="rounded-full px-3 py-1 text-[11px] font-bold transition"
        :class="darkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
        @click="$emit('close')"
      >关闭</button>
    </div>
    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="ex in examples"
        :key="ex.id"
        class="group relative overflow-hidden rounded-xl border transition-all duration-200 hover:shadow-lg cursor-pointer"
        :class="darkMode
          ? 'border-slate-700 bg-slate-800 hover:border-emerald-500/50'
          : 'border-slate-200 bg-white hover:border-emerald-300'"
        @click="$emit('load', ex)"
      >
        <!-- Score bar -->
        <div class="h-1 w-full" :class="scoreColor(ex.score)"></div>
        <div class="p-4">
          <div class="mb-2 flex items-start justify-between">
            <h4 class="text-sm font-bold" :class="darkMode ? 'text-slate-200' : 'text-slate-800'">{{ ex.name }}</h4>
            <span class="rounded-full px-2 py-0.5 text-[10px] font-bold" :class="scoreBadge(ex.score)">
              {{ ex.score }}分
            </span>
          </div>
          <p class="text-xs" :class="darkMode ? 'text-slate-400' : 'text-slate-500'">{{ ex.subtitle }}</p>
          <div class="mt-2 flex flex-wrap gap-1">
            <span
              v-for="tag in (ex.tags || []).slice(0, 3)"
              :key="tag"
              class="rounded-full px-2 py-0.5 text-[10px]"
              :class="darkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'"
            >{{ tag }}</span>
          </div>
          <div class="mt-2 flex items-center gap-2 text-[10px]" :class="darkMode ? 'text-slate-500' : 'text-slate-400'">
            <span>{{ ex.model }}</span>
            <span>·</span>
            <span>{{ ex.director?.ratio || '—' }}</span>
          </div>
          <div class="mt-3 flex gap-2">
            <button
              class="flex-1 rounded-lg py-1.5 text-[11px] font-bold transition active:scale-95"
              :class="darkMode ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'bg-emerald-500 text-white hover:bg-emerald-600'"
              @click.stop="$emit('load', ex)"
            >加载示例</button>
            <button
              class="rounded-lg px-3 py-1.5 text-[11px] font-bold transition active:scale-95"
              :class="darkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
              @click.stop="$emit('preview', ex)"
            >预览</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  examples: { type: Array, default: () => [] },
  darkMode: { type: Boolean, default: false }
})

defineEmits(['load', 'preview', 'close'])

function scoreColor(score) {
  if (score >= 90) return 'bg-emerald-500'
  if (score >= 70) return 'bg-blue-500'
  if (score >= 50) return 'bg-amber-500'
  return 'bg-red-500'
}

function scoreBadge(score) {
  if (score >= 90) return 'bg-emerald-100 text-emerald-700'
  if (score >= 70) return 'bg-blue-100 text-blue-700'
  if (score >= 50) return 'bg-amber-100 text-amber-700'
  return 'bg-red-100 text-red-700'
}
</script>
