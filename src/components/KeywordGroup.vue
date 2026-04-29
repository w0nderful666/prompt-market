<template>
  <section class="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-emerald-50">
    <button class="flex w-full items-center justify-between px-4 py-3 text-left" @click="expanded = !expanded">
      <span class="flex items-center gap-2">
        <span class="text-xs text-emerald-500">{{ expanded ? '▾' : '▸' }}</span>
        <span class="font-semibold text-slate-800">{{ group.name }}</span>
      </span>
      <span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500">
        {{ selectedCount }}/{{ group.items?.length || 0 }}
      </span>
    </button>

    <div v-show="expanded" class="border-t border-slate-50 px-3 py-3">
      <div class="flex flex-wrap gap-2">
        <KeywordChip
          v-for="item in group.items"
          :key="item.id"
          :keyword="item"
          :is-selected="isSelected(item)"
          @toggle="toggle(item)"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import KeywordChip from './KeywordChip.vue'
import { getItemKey } from '../utils/promptBuilder.js'

const props = defineProps({
  group: { type: Object, required: true },
  selectedItems: { type: Array, default: () => [] }
})

const emit = defineEmits(['select', 'deselect'])
const expanded = ref(true)

const selectedCount = computed(() => (props.group.items || []).filter(isSelected).length)

function isSelected(item) {
  return props.selectedItems.some((selected) => getItemKey(selected) === getItemKey(item) || selected.id === item.id)
}

function toggle(item) {
  emit(isSelected(item) ? 'deselect' : 'select', item)
}

function expand() {
  expanded.value = true
}

function collapse() {
  expanded.value = false
}

defineExpose({ expand, collapse })
</script>
