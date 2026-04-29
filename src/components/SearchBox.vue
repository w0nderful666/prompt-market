<template>
  <div class="relative">
    <div class="flex items-center gap-2 rounded-lg bg-white px-3 py-2 shadow-sm ring-1 ring-emerald-50">
      <span class="text-slate-400">⌕</span>
      <input
        v-model="keyword"
        class="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
        placeholder="搜索关键词，支持中文或英文"
        @focus="open = true"
      />
      <label class="flex items-center gap-1 whitespace-nowrap text-xs text-slate-500">
        <input v-model="searchAll" type="checkbox" class="accent-emerald-500" />
        全部
      </label>
      <button v-if="keyword" class="text-sm text-slate-400" @click="keyword = ''">×</button>
    </div>

    <div
      v-if="open && keyword"
      class="absolute left-0 right-0 top-full z-30 mt-2 max-h-[420px] overflow-y-auto rounded-lg bg-white p-3 shadow-xl ring-1 ring-slate-100"
    >
      <div v-if="results.length" class="space-y-4">
        <div v-for="result in results" :key="`${result.categoryId}-${result.tabId}-${result.groupId}`">
          <div class="mb-2 flex items-center gap-2 text-xs">
            <span class="rounded bg-emerald-50 px-2 py-1 font-semibold text-emerald-700">{{ result.tabName }}</span>
            <span class="text-slate-500">{{ result.groupName }}</span>
          </div>
          <div class="flex flex-wrap gap-2">
            <KeywordChip
              v-for="item in result.items"
              :key="`${result.categoryId}-${result.tabId}-${item.id}`"
              :keyword="item"
              :is-selected="isSelected(item)"
              @toggle="$emit(isSelected(item) ? 'deselect' : 'select', item)"
            />
          </div>
        </div>
      </div>
      <div v-else class="py-8 text-center text-sm text-slate-400">未找到匹配的关键词</div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import KeywordChip from './KeywordChip.vue'
import { getItemKey, searchPrompts } from '../utils/promptBuilder.js'

const props = defineProps({
  categories: { type: Array, default: () => [] },
  selectedItems: { type: Array, default: () => [] },
  currentCategoryId: { type: String, default: '' }
})

defineEmits(['select', 'deselect'])

const keyword = ref('')
const open = ref(false)
const searchAll = ref(false)

const results = computed(() => {
  return searchPrompts(props.categories, keyword.value, searchAll.value ? '' : props.currentCategoryId)
})

function isSelected(item) {
  return props.selectedItems.some((selected) => getItemKey(selected) === getItemKey(item))
}
</script>
