<template>
  <div class="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
    <div class="border-b border-slate-100 dark:border-slate-700 px-4 py-3">
      <h3 class="text-sm font-bold text-slate-800 dark:text-slate-200">🤖 模型适配器</h3>
      <p class="mt-1 text-xs text-slate-400">针对不同 AI 模型优化输出格式</p>
      <div class="mt-2 flex flex-wrap gap-1">
        <button
          v-for="m in models"
          :key="m.id"
          class="rounded-full px-3 py-1 text-[11px] font-bold transition active:scale-95"
          :class="activeModel === m.id
            ? 'bg-violet-500 text-white shadow-sm'
            : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400'"
          @click="activeModel = m.id"
        >{{ m.icon }} {{ m.name }}</button>
      </div>
    </div>
    <div class="p-4">
      <div v-if="currentOutput" class="space-y-3">
        <!-- SD special: split positive/negative -->
        <div v-if="activeModel === 'stableDiffusion'">
          <div class="mb-2">
            <div class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mb-1">✅ Positive Prompt</div>
            <div class="relative">
              <textarea :value="currentOutput.positive" readonly class="h-24 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 pr-16 text-xs leading-5 text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300" />
              <button class="absolute right-2 top-2 rounded bg-emerald-500 px-2 py-1 text-[10px] font-bold text-white hover:bg-emerald-600" @click="copy(currentOutput.positive)">复制</button>
            </div>
          </div>
          <div>
            <div class="text-[10px] font-bold text-red-600 dark:text-red-400 mb-1">❌ Negative Prompt</div>
            <div class="relative">
              <textarea :value="currentOutput.negative" readonly class="h-20 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 pr-16 text-xs leading-5 text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300" />
              <button class="absolute right-2 top-2 rounded bg-emerald-500 px-2 py-1 text-[10px] font-bold text-white hover:bg-emerald-600" @click="copy(currentOutput.negative)">复制</button>
            </div>
          </div>
        </div>
        <!-- Standard single output -->
        <div v-else class="relative">
          <textarea :value="currentOutput.text" readonly class="h-40 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 pr-20 text-xs leading-5 text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300" />
          <div class="absolute right-2 top-2 flex flex-col gap-1">
            <button class="rounded bg-emerald-500 px-3 py-1.5 text-[10px] font-bold text-white shadow hover:bg-emerald-600" @click="copy(currentOutput.text)">复制</button>
            <button class="rounded bg-slate-200 px-3 py-1.5 text-[10px] font-bold text-slate-600 shadow hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-300" @click="download">下载</button>
          </div>
        </div>
        <div class="text-[10px] text-slate-400">
          {{ modelDescriptions[activeModel] }}
        </div>
      </div>
      <div v-else class="py-6 text-center text-xs text-slate-400">
        生成输出后，可在此切换不同模型格式
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

const activeModel = ref('gptImage')

const models = [
  { id: 'gptImage', name: 'GPT Image', icon: '🖼️' },
  { id: 'midjourney', name: 'Midjourney', icon: '🎨' },
  { id: 'stableDiffusion', name: 'Stable Diffusion', icon: '🖌️' },
  { id: 'flux', name: 'Flux', icon: '⚡' },
  { id: 'chineseGeneric', name: '通用中文', icon: '🇨🇳' },
  { id: 'englishGeneric', name: '通用英文', icon: '🇬🇧' }
]

const modelDescriptions = {
  gptImage: 'GPT Image 适合自然语言导演式描述，保持完整画面叙事',
  midjourney: 'Midjourney 自动追加 --ar 和 --style raw 参数',
  stableDiffusion: 'Stable Diffusion 拆分 positive/negative prompt',
  flux: 'Flux 保持简洁高密度英文描述，关键词优先',
  chineseGeneric: '通用中文格式，适合国内 AI 绘图工具',
  englishGeneric: '通用英文格式，结构化标签输出'
}

const currentOutput = computed(() => props.outputs?.[activeModel.value] || null)

async function copy(text) {
  if (!text) return
  try { await navigator.clipboard.writeText(text) } catch {
    const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.left = '-9999px'
    document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove()
  }
}

function download() {
  if (!currentOutput.value?.text) return
  downloadText(currentOutput.value.text, `prompt_${activeModel.value}_${Date.now()}.txt`)
}
</script>
