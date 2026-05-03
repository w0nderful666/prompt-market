<template>
  <div class="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
    <div class="border-b border-slate-100 dark:border-slate-700 px-4 py-3">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-bold text-slate-800 dark:text-slate-200">🎲 变体生成</h3>
        <button
          class="rounded-full bg-violet-500 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-violet-600"
          @click="$emit('generate')"
        >生成变体</button>
      </div>
    </div>
    <div v-if="variants && variants.length" class="max-h-96 divide-y divide-slate-100 overflow-y-auto dark:divide-slate-700">
      <div v-for="variant in variants" :key="variant.id" class="p-3">
        <div class="mb-2 flex items-center justify-between">
          <span class="text-xs font-bold text-slate-700 dark:text-slate-300">{{ variant.name_zh }}</span>
          <div class="flex gap-1">
            <button
              class="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 transition hover:bg-emerald-100 hover:text-emerald-700 dark:bg-slate-700 dark:text-slate-400"
              @click="copyText(variant.text_zh)"
            >复制中文</button>
            <button
              class="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 transition hover:bg-emerald-100 hover:text-emerald-700 dark:bg-slate-700 dark:text-slate-400"
              @click="copyText(variant.text_en)"
            >复制英文</button>
          </div>
        </div>
        <p class="text-xs leading-5 text-slate-500 dark:text-slate-400 line-clamp-3">{{ variant.text_zh }}</p>
      </div>
    </div>
    <div v-else class="p-6 text-center text-xs text-slate-400">
      填写结构化模块后，点击"生成变体"获取多种风格方向
    </div>
  </div>
</template>

<script setup>
defineProps({
  variants: { type: Array, default: () => [] }
})

defineEmits(['generate'])

async function copyText(text) {
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
</script>
