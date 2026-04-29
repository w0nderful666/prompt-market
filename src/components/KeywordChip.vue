<template>
  <button
    type="button"
    class="inline-flex items-center gap-1 rounded-full border px-3.5 py-2 text-sm transition active:scale-95"
    :class="isSelected
      ? 'border-emerald-500 bg-emerald-500 text-white shadow-sm'
      : 'border-slate-100 bg-slate-50 text-slate-700 hover:border-emerald-200 hover:bg-emerald-50'"
    @click="$emit('toggle')"
  >
    <span v-if="isSelected" class="text-xs">✓</span>
    <span>{{ keyword.zh }}</span>
  </button>
</template>

<script setup>
defineProps({
  keyword: { type: Object, required: true },
  isSelected: { type: Boolean, default: false }
})

defineEmits(['toggle'])
</script>
