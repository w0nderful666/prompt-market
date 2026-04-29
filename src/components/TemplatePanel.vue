<template>
  <div v-if="templates.length" class="rounded-lg bg-slate-50 p-3">
    <div class="mb-2 flex items-center justify-between">
      <span class="text-sm font-bold text-slate-700">模板</span>
      <span class="text-xs text-slate-400">{{ templates.length }} 个</span>
    </div>
    <div class="space-y-2">
      <button
        v-for="template in templates"
        :key="template.id"
        class="w-full rounded-lg border p-3 text-left transition"
        :class="template.id === selectedId ? 'border-emerald-400 bg-white' : 'border-transparent bg-white/80 hover:border-emerald-100'"
        @click="$emit('select', template)"
      >
        <div class="flex items-center justify-between gap-2">
          <span class="text-sm font-semibold text-slate-800">{{ template.name }}</span>
          <span class="rounded bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-700">{{ template.mode || 'natural' }}</span>
        </div>
        <p v-if="template.description" class="mt-1 text-xs leading-5 text-slate-500">{{ template.description }}</p>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  templates: { type: Array, default: () => [] },
  selectedId: { type: String, default: '' }
})

defineEmits(['select'])
</script>
