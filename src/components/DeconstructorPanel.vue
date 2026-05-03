<template>
  <div class="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
    <div class="border-b border-slate-100 dark:border-slate-700 px-4 py-3">
      <h3 class="text-sm font-bold text-slate-800 dark:text-slate-200">🔍 提示词拆解 / Deconstruct</h3>
      <p class="mt-1 text-xs text-slate-400">粘贴一段提示词，自动拆解并填入结构化编辑器</p>
    </div>
    <div class="p-4 space-y-3">
      <textarea
        v-model="inputText"
        class="h-28 w-full resize-none rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm leading-5 outline-none transition focus:border-emerald-400 dark:border-slate-600 dark:text-slate-200"
        placeholder="粘贴一段提示词文本，例如：&#10;夜晚街头，直闪摄影，年轻女性，街拍模特，Y2K穿搭..."
      />
      <div class="flex gap-2">
        <button
          class="rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-600"
          @click="deconstruct"
        >拆解并填入</button>
        <button
          v-if="Object.keys(result).length"
          class="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300"
          @click="result = {}; inputText = ''"
        >清空</button>
      </div>
      <div v-if="Object.keys(result).length" class="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-900/20">
        <div class="mb-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">拆解结果（点击编辑器对应模块查看）</div>
        <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <div v-for="(value, key) in result" :key="key" class="rounded-lg bg-white p-2 dark:bg-slate-800">
            <div class="text-[10px] font-bold text-slate-400">{{ getLabel(key) }}</div>
            <div class="mt-0.5 text-xs text-slate-700 dark:text-slate-300 line-clamp-2">{{ value }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { deconstructPrompt } from '../utils/deconstructor.js'

const emit = defineEmits(['apply'])

const inputText = ref('')
const result = ref({})

const LABELS = {
  model: '模型/用途',
  subject: '主体设定',
  scene: '场景环境',
  composition: '构图与镜头',
  expression: '表情与状态',
  face: '脸部与妆容',
  hair: '发型与细节',
  body: '身体与姿势',
  clothing: '服装与配件',
  lighting: '光线与色彩',
  camera: '摄影/画面质感',
  background: '背景元素',
  atmosphere: '整体氛围',
  caption: 'Caption 感',
  mustKeep: '必须保留',
  avoid: '避免项',
  ratio: '比例/尺寸'
}

function getLabel(key) {
  return LABELS[key] || key
}

function deconstruct() {
  if (!inputText.value.trim()) return
  result.value = deconstructPrompt(inputText.value)
  emit('apply', result.value)
}
</script>
