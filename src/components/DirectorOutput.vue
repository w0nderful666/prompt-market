<template>
  <div class="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
    <div class="border-b border-slate-100 dark:border-slate-700 px-4 py-3">
      <h3 class="text-sm font-bold text-slate-800 dark:text-slate-200">📤 输出结果</h3>
      <div class="mt-2 flex flex-wrap gap-1">
        <button
          v-for="tab in outputTabs"
          :key="tab.id"
          class="rounded-full px-3 py-1 text-[11px] font-bold transition"
          :class="activeTab === tab.id
            ? 'bg-emerald-500 text-white'
            : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400'"
          @click="activeTab = tab.id"
        >{{ tab.name }}</button>
      </div>
    </div>
    <div class="p-4">
      <div class="relative">
        <textarea
          :value="currentText"
          class="h-48 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 pr-20 text-sm leading-6 text-slate-700 outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300"
          readonly
        />
        <div class="absolute right-2 top-2 flex flex-col gap-1">
          <button
            class="rounded-lg bg-emerald-500 px-3 py-1.5 text-[11px] font-bold text-white shadow transition hover:bg-emerald-600"
            @click="copyText(currentText)"
          >复制</button>
          <button
            class="rounded-lg bg-slate-200 px-3 py-1.5 text-[11px] font-bold text-slate-600 shadow transition hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-300"
            @click="downloadTxt"
          >下载</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { downloadText } from '../utils/storage.js'

const props = defineProps({
  outputs: { type: Object, default: () => ({}) }
})

const activeTab = ref('chineseDirector')

const outputTabs = [
  { id: 'chineseShort', name: '中文简短' },
  { id: 'chineseStandard', name: '中文标准' },
  { id: 'chineseDirector', name: '中文导演版' },
  { id: 'englishStandard', name: '英文标准' },
  { id: 'avoidPrompt', name: '负面提示词' }
]

const currentText = computed(() => {
  return props.outputs?.[activeTab.value] || ''
})

async function copyText(text) {
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.left = '-9999px'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    ta.remove()
  }
}

function downloadTxt() {
  if (!currentText.value) return
  const tab = outputTabs.find(t => t.id === activeTab.value)
  downloadText(currentText.value, `prompt_${tab?.name || 'output'}_${Date.now()}.txt`)
}
</script>
