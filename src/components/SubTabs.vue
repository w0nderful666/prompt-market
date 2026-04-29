<template>
  <div class="bg-[#f5fbf7] px-3 py-2">
    <div class="flex gap-2 overflow-x-auto">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="flex shrink-0 items-center gap-1 rounded-full border px-4 py-2 text-sm transition"
        :class="[
          currentTab === tab.id ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-white bg-white text-slate-600',
          !hasGroups(tab) ? 'opacity-40' : 'hover:border-emerald-200 hover:text-emerald-700'
        ]"
        :disabled="!hasGroups(tab)"
        @click="$emit('change', tab.id)"
      >
        {{ tab.name }}
        <span v-if="tabCounts[tab.id]" class="rounded-full bg-white/25 px-1.5 text-[11px]">
          {{ tabCounts[tab.id] }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  tabs: { type: Array, default: () => [] },
  currentTab: { type: String, default: '' },
  tabCounts: { type: Object, default: () => ({}) }
})

defineEmits(['change'])

function hasGroups(tab) {
  return Array.isArray(tab.groups) && tab.groups.length > 0
}
</script>
