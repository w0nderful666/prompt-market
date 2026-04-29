<template>
  <div v-if="sections.length" class="space-y-2">
    <div class="text-sm font-bold text-slate-700">生成结构预览</div>
    <article v-for="section in sections" :key="`${section.sourceTabId}-${section.title}`" class="rounded-lg border border-slate-100 bg-white">
      <button class="flex w-full items-center justify-between px-3 py-2 text-left" @click="toggle(section)">
        <span class="flex items-center gap-2">
          <span class="text-xs text-emerald-500">{{ opened[sectionKey(section)] ? '▾' : '▸' }}</span>
          <span class="text-sm font-semibold text-slate-800">{{ section.title }}</span>
          <span class="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-500">{{ section.sourceTabId }}</span>
        </span>
        <span class="text-xs text-emerald-600" @click.stop="$emit('append', section.content)">追加</span>
      </button>
      <p v-show="opened[sectionKey(section)]" class="border-t border-slate-50 px-3 py-2 text-sm leading-6 text-slate-600">
        {{ section.content }}
      </p>
    </article>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

defineProps({
  sections: { type: Array, default: () => [] }
})

defineEmits(['append'])

const opened = reactive({})

function sectionKey(section) {
  return `${section.sourceTabId}-${section.title}`
}

function toggle(section) {
  const key = sectionKey(section)
  opened[key] = !opened[key]
}
</script>
