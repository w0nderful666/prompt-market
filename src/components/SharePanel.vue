<template>
  <div class="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
    <div class="border-b border-slate-100 dark:border-slate-700 px-4 py-3">
      <h3 class="text-sm font-bold text-slate-800 dark:text-slate-200">🔗 分享链接</h3>
      <p class="mt-1 text-xs text-slate-400">生成分享链接，配置压缩在 URL 中，不上传服务器</p>
    </div>
    <div class="p-4 space-y-3">
      <button
        class="w-full rounded-lg bg-indigo-500 py-2 text-xs font-bold text-white transition hover:bg-indigo-600 active:scale-95"
        @click="generateLink"
      >生成分享链接</button>
      <div v-if="shareUrl" class="space-y-2">
        <div class="relative">
          <input
            :value="shareUrl"
            readonly
            class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 pr-16 text-xs text-slate-600 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-400"
          />
          <button
            class="absolute right-1 top-1 rounded-md bg-emerald-500 px-3 py-1.5 text-[10px] font-bold text-white hover:bg-emerald-600"
            @click="copyLink"
          >{{ copied ? '已复制 ✓' : '复制' }}</button>
        </div>
        <p class="text-[10px] text-slate-400">链接长度：{{ shareUrl.length }} 字符 · 配置已压缩到 URL hash 中</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { createShareUrl } from '../utils/shareLink.js'

const props = defineProps({
  director: { type: Object, default: () => ({}) }
})

const shareUrl = ref('')
const copied = ref(false)

function generateLink() {
  shareUrl.value = createShareUrl(props.director)
  copied.value = false
}

async function copyLink() {
  if (!shareUrl.value) return
  try {
    await navigator.clipboard.writeText(shareUrl.value)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = shareUrl.value
    ta.style.position = 'fixed'
    ta.style.left = '-9999px'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    ta.remove()
  }
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>
