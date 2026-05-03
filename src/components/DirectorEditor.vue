<template>
  <div class="director-editor space-y-4">
    <!-- Toolbar -->
    <div class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
      <div class="flex items-center gap-3">
        <h2 class="text-sm font-black text-slate-800 dark:text-slate-200">🎬 提示词导演工作台</h2>
        <span class="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">结构化编辑</span>
      </div>
      <div class="flex flex-wrap gap-2">
        <button class="toolbar-btn" @click="loadExample">📋 加载示例</button>
        <button class="toolbar-btn" @click="saveScheme">💾 保存方案</button>
        <button class="toolbar-btn" @click="exportJson">📤 导出JSON</button>
        <button class="toolbar-btn" @click="$emit('show-history')">📜 历史记录</button>
        <button class="toolbar-btn primary" @click="generateAll">🚀 生成全部输出</button>
      </div>
    </div>

    <!-- Example selector -->
    <div v-if="showExamples" class="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-700 dark:bg-blue-900/20">
      <div class="mb-2 flex items-center justify-between">
        <span class="text-xs font-bold text-blue-700 dark:text-blue-300">选择示例</span>
        <button class="text-xs text-blue-500" @click="showExamples = false">关闭</button>
      </div>
      <div class="grid gap-2 sm:grid-cols-3">
        <button
          v-for="ex in examples"
          :key="ex.id"
          class="rounded-lg border border-blue-200 bg-white p-3 text-left transition hover:border-blue-400 dark:border-blue-600 dark:bg-slate-800"
          @click="applyExample(ex)"
        >
          <div class="text-xs font-bold text-slate-800 dark:text-slate-200">{{ ex.name }}</div>
          <p class="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{{ ex.description }}</p>
        </button>
      </div>
    </div>

    <!-- Module cards grid -->
    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <DirectorCard
        v-for="mod in modules"
        :key="mod.id"
        v-model="director[mod.id]"
        :title="mod.zh"
        :icon="mod.icon"
        :placeholder="mod.placeholder"
        :locked="locks[mod.id]"
        :presets="getPresetsForModule(mod.id)"
        @toggle-lock="toggleLock(mod.id)"
        @clear="clearModule(mod.id)"
      />
    </div>

    <!-- Quick actions -->
    <div class="flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
      <button class="action-btn" @click="clearAll">🗑️ 清空全部</button>
      <button class="action-btn" @click="toggleAllLocks">{{ allLocked ? '🔓 全部解锁' : '🔒 全部锁定' }}</button>
      <button class="action-btn" @click="showDeconstructor = !showDeconstructor">🔍 拆解提示词</button>
    </div>

    <!-- Deconstructor -->
    <DeconstructorPanel v-if="showDeconstructor" @apply="applyDeconstructed" />

    <!-- Score -->
    <PromptScorePanel :score="promptScore" @score="calculateScore" />

    <!-- Output -->
    <DirectorOutput v-if="hasOutput" :outputs="outputs" />

    <!-- Variants -->
    <VariantsPanel :variants="variants" @generate="generateVariantList" />

    <!-- Save modal -->
    <div v-if="showSaveModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div class="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl dark:bg-slate-800">
        <h3 class="mb-4 font-bold text-slate-900 dark:text-slate-100">保存导演方案</h3>
        <input
          v-model.trim="schemeName"
          class="mb-4 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-400 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
          placeholder="请输入方案名称"
          @keyup.enter="confirmSave"
        />
        <div class="flex gap-2">
          <button class="flex-1 rounded-lg bg-slate-100 py-2 text-sm font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300" @click="showSaveModal = false">取消</button>
          <button class="flex-1 rounded-lg bg-emerald-500 py-2 text-sm font-bold text-white" @click="confirmSave">保存</button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div
      v-if="toast"
      class="fixed left-1/2 top-20 z-[60] -translate-x-1/2 rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-lg"
    >{{ toast }}</div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, watch } from 'vue'
import DirectorCard from './DirectorCard.vue'
import DirectorOutput from './DirectorOutput.vue'
import PromptScorePanel from './PromptScorePanel.vue'
import DeconstructorPanel from './DeconstructorPanel.vue'
import VariantsPanel from './VariantsPanel.vue'
import { buildAllOutputs } from '../utils/directorBuilder.js'
import { scorePrompt } from '../utils/promptScore.js'
import { generateVariants } from '../utils/variantGenerator.js'
import { storage } from '../utils/storage.js'
import directorModules from '../data/directorModules.json'
import presetsData from '../data/presets.json'
import examplesData from '../data/examples.json'

const emit = defineEmits(['show-history', 'toast'])

const modules = directorModules
const examples = examplesData

const director = reactive({
  model: '', subject: '', scene: '', composition: '', expression: '',
  face: '', hair: '', body: '', clothing: '', lighting: '', camera: '',
  background: '', atmosphere: '', caption: '', mustKeep: '', avoid: '', ratio: ''
})

const locks = reactive({})
const outputs = ref({})
const variants = ref([])
const promptScore = ref(null)
const showExamples = ref(false)
const showDeconstructor = ref(false)
const showSaveModal = ref(false)
const schemeName = ref('')
const toast = ref('')

const hasOutput = computed(() => Object.values(outputs.value).some(v => v && v.trim()))
const allLocked = computed(() => modules.every(m => locks[m.id]))

// Load from localStorage
onMounted(() => {
  const saved = storage.getDirectorCurrent()
  if (saved) {
    Object.keys(saved).forEach(key => {
      if (key in director) director[key] = saved[key]
    })
  }
})

// Auto-save
watch(director, () => {
  storage.setDirectorCurrent({ ...director })
}, { deep: true })

function notify(msg) {
  toast.value = msg
  setTimeout(() => { toast.value = '' }, 2000)
}

function toggleLock(id) {
  locks[id] = !locks[id]
}

function toggleAllLocks() {
  const newVal = !allLocked.value
  modules.forEach(m => { locks[m.id] = newVal })
}

function clearModule(id) {
  if (!locks[id]) director[id] = ''
}

function clearAll() {
  if (!confirm('确定清空所有模块？')) return
  modules.forEach(m => {
    if (!locks[m.id]) director[m.id] = ''
  })
  outputs.value = {}
  variants.value = []
  promptScore.value = null
}

function getPresetsForModule(moduleId) {
  if (moduleId === 'scene') return presetsData.scenes
  if (moduleId === 'camera') return presetsData.textures
  if (moduleId === 'composition') return presetsData.compositions
  if (moduleId === 'lighting') return presetsData.lightings
  if (moduleId === 'atmosphere') return presetsData.atmospheres
  return []
}

function loadExample() {
  showExamples.value = !showExamples.value
}

function applyExample(ex) {
  const d = ex.director
  Object.keys(d).forEach(key => {
    if (key in director && !locks[key]) director[key] = d[key] || ''
  })
  showExamples.value = false
  notify(`已加载示例：${ex.name}`)
}

function generateAll() {
  outputs.value = buildAllOutputs(director)
  notify('已生成全部输出')
}

function calculateScore() {
  promptScore.value = scorePrompt(director)
}

function generateVariantList() {
  variants.value = generateVariants(director)
}

function saveScheme() {
  showSaveModal.value = true
}

function confirmSave() {
  if (!schemeName.value) { notify('请输入方案名称'); return }
  storage.saveDirectorScheme(schemeName.value, director, outputs.value)
  schemeName.value = ''
  showSaveModal.value = false
  notify('方案已保存')
}

function exportJson() {
  const data = { director: { ...director }, outputs: outputs.value, exportedAt: new Date().toISOString() }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = `director_${Date.now()}.json`
  document.body.appendChild(a); a.click(); a.remove()
  URL.revokeObjectURL(url)
  notify('已导出JSON')
}

function applyDeconstructed(parsed) {
  Object.keys(parsed).forEach(key => {
    if (key in director && !locks[key] && parsed[key]) {
      director[key] = parsed[key]
    }
  })
  notify('已填入拆解结果')
}
</script>

<style scoped>
.toolbar-btn {
  border-radius: 999px;
  background: #f1f5f9;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 700;
  color: #475569;
}
.toolbar-btn:hover { background: #e2e8f0; }
.toolbar-btn.primary { background: #22c55e; color: white; }
.toolbar-btn.primary:hover { background: #16a34a; }

.action-btn {
  border-radius: 8px;
  background: #f8fafc;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
}
.action-btn:hover { background: #f1f5f9; }

:root.dark .toolbar-btn { background: #334155; color: #cbd5e1; }
:root.dark .toolbar-btn:hover { background: #475569; }
:root.dark .action-btn { background: #1e293b; color: #94a3b8; }
:root.dark .action-btn:hover { background: #334155; }
</style>
