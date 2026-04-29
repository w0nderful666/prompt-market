<template>
  <div class="space-y-2">
    <div class="text-sm font-bold text-slate-700">追加一句</div>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="option in options"
        :key="option.id"
        class="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
        @click="$emit('append', option.text)"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { QUICK_APPEND_OPTIONS } from '../utils/promptTextTools.js'

defineEmits(['append'])

const options = QUICK_APPEND_OPTIONS
</script>
