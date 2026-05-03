<template>
  <div class="director-editor">
    <!-- Toolbar -->
    <div class="flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 mb-4"
      :class="darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'">
      <div class="flex items-center gap-3">
        <h2 class="text-sm font-black" :class="darkMode ? 'text-slate-200' : 'text-slate-800'">🎬 结构化编辑器</h2>
        <span class="rounded-full px-2 py-0.5 text-[10px] font-bold"
          :class="darkMode ? 'bg-emerald-900/40 text-emerald-300' : 'bg-emerald-100 text-emerald-700'">
          {{ filledCount }}/{{ modules.length }} 模块
        </span>
        <span v-if="currentScore" class="rounded-full px-2 py-0.5 text-[10px] font-bold"
          :class="scoreBadgeClass">
          {{ currentScore.score }}分
        </span>
      </div>
      <div class="flex flex-wrap gap-2">
        <button class="toolbar-btn" :class="darkMode ? 'toolbar-btn-dark' : ''" @click="saveRecipe">💾 保存配方</button>
        <button class="toolbar-btn" :class="darkMode ? 'toolbar-btn-dark' : ''" @click="exportJson">📤 导出</button>
        <button class="toolbar-btn primary" @click="generateAll">🚀 生成输出</button>
      </div>
    </div>

    <!-- Conflict Detector -->
    <ConflictPanel v-if="conflicts.length" :conflicts="conflicts"
      @dismiss="conflicts = []"
      @remove-word="handleRemoveWord" />

    <!-- Safety Panel -->
    <div v-if="safetyResult && safetyResult.hits.length" class="mb-4">
      <SafetyPanel :safety="safetyResult" :dark-mode="darkMode" @apply-fix="handleSafetyFix" />
    </div>

    <!-- Module Groups -->
    <div class="space-y-4 mb-4">
      <div v-for="group in moduleGroups" :key="group.id"
        class="rounded-xl border overflow-hidden"
        :class="darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'">
        <!-- Group Header -->
        <button class="flex w-full items-center justify-between px-4 py-3 transition"
          :class="darkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'"
          @click="toggleGroup(group.id)">
          <div class="flex items-center gap-2">
            <span class="text-base">{{ group.icon }}</span>
            <span class="text-sm font-bold" :class="darkMode ? 'text-slate-200' : 'text-slate-800'">{{ group.label }}</span>
            <span class="text-[10px]" :class="darkMode ? 'text-slate-500' : 'text-slate-400'">{{ group.sublabel }}</span>
            <span class="rounded-full px-1.5 py-0.5 text-[10px] font-bold"
              :class="darkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'">
              {{ groupFilledCount(group.modules) }}/{{ group.modules.length }}
            </span>
          </div>
          <span class="text-xs" :class="darkMode ? 'text-slate-500' : 'text-slate-400'">{{ expandedGroups[group.id] ? '▼' : '▶' }}</span>
        </button>
        <!-- Group Modules -->
        <div v-show="expandedGroups[group.id]" class="px-4 pb-4">
          <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <DirectorCard
              v-for="mod in group.modules"
              :key="mod.id"
              v-model="director[mod.id]"
              :title="mod.zh"
              :icon="mod.icon"
              :placeholder="mod.placeholder"
              :locked="locks[mod.id]"
              :presets="getPresetsForModule(mod.id)"
              :dark-mode="darkMode"
              @toggle-lock="toggleLock(mod.id)"
              @clear="clearModule(mod.id)"
            />
          </div>
          <!-- Inline Safety & Conflict in Control group -->
          <div v-if="group.id === 'control'" class="mt-3 space-y-3">
            <SafetyPanel :safety="safetyResult" :dark-mode="darkMode" @apply-fix="handleSafetyFix" />
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions Row -->
    <div class="flex flex-wrap gap-2 rounded-xl border px-4 py-3 mb-4"
      :class="darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'">
      <button class="action-btn" :class="darkMode ? 'action-btn-dark' : ''" @click="clearAll">🗑️ 清空全部</button>
      <button class="action-btn" :class="darkMode ? 'action-btn-dark' : ''" @click="toggleAllLocks">
        {{ allLocked ? '🔓 全部解锁' : '🔒 全部锁定' }}
      </button>
      <button class="action-btn" :class="darkMode ? 'action-btn-dark' : ''" @click="showDeconstructor = !showDeconstructor">🔍 拆解提示词</button>
      <button class="action-btn" :class="darkMode ? 'action-btn-dark' : ''" @click="runCleaner">🧹 一键清理</button>
      <button class="action-btn" :class="darkMode ? 'action-btn-dark' : ''" @click="detectConflictsNow">⚠️ 检测冲突</button>
      <button class="action-btn" :class="darkMode ? 'action-btn-dark' : ''" @click="runSafetyCheck">🛡️ 安全检查</button>
      <button class="action-btn" :class="darkMode ? 'action-btn-dark' : ''" @click="expandAllGroups">{{ allGroupsExpanded ? '收起全部组' : '展开全部组' }}</button>
    </div>

    <!-- Polisher Panel -->
    <div class="mb-4">
      <PolisherPanel :director="director" :dark-mode="darkMode"
        @apply="handlePolishApply"
        @undo="handlePolishUndo" />
    </div>

    <!-- Deconstructor -->
    <DeconstructorPanel v-if="showDeconstructor" @apply="applyDeconstructed" />

    <!-- Output Section -->
    <div class="space-y-4">
      <!-- Score Panel -->
      <PromptScorePanel :score="currentScore" :dark-mode="darkMode" @score="runScore" />

      <!-- Model Adapter -->
      <ModelAdapterPanel :outputs="modelOutputs" />

      <!-- Classic Output -->
      <DirectorOutput v-if="hasOutput" :outputs="outputs" />

      <!-- Recipes -->
      <div v-if="recipes.length" class="rounded-xl border px-4 py-3"
        :class="darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'">
        <div class="mb-3 flex items-center justify-between">
          <h3 class="text-sm font-bold" :class="darkMode ? 'text-slate-200' : 'text-slate-800'">📋 我的配方 ({{ recipes.length }})</h3>
        </div>
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <RecipeCard v-for="recipe in recipes" :key="recipe.id" :recipe="recipe" :dark-mode="darkMode"
            @load="loadRecipe" @copy="copyRecipe" @export="exportRecipe" />
        </div>
      </div>

      <!-- Share -->
      <SharePanel :director="director" />
    </div>

    <!-- Save Recipe Modal -->
    <div v-if="showSaveModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div class="w-full max-w-sm rounded-2xl p-5 shadow-xl" :class="darkMode ? 'bg-slate-800' : 'bg-white'">
        <h3 class="mb-4 font-bold" :class="darkMode ? 'text-slate-100' : 'text-slate-900'">保存配方</h3>
        <input v-model.trim="recipeName" class="mb-4 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-emerald-400"
          :class="darkMode ? 'border-slate-600 bg-slate-700 text-slate-200' : 'border-slate-200'" placeholder="输入配方名称" @keyup.enter="confirmSaveRecipe" />
        <div class="flex gap-2">
          <button class="flex-1 rounded-lg py-2 text-sm font-bold" :class="darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'" @click="showSaveModal = false">取消</button>
          <button class="flex-1 rounded-lg bg-emerald-500 py-2 text-sm font-bold text-white" @click="confirmSaveRecipe">保存</button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div v-if="toastMsg" class="fixed left-1/2 top-20 z-[60] -translate-x-1/2 rounded-full px-5 py-2 text-sm font-semibold text-white shadow-lg"
      :class="toastType === 'error' ? 'bg-red-500' : 'bg-emerald-500'">{{ toastMsg }}</div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, watch } from 'vue'
import DirectorCard from './DirectorCard.vue'
import DirectorOutput from './DirectorOutput.vue'
import DeconstructorPanel from './DeconstructorPanel.vue'
import ConflictPanel from './ConflictPanel.vue'
import SafetyPanel from './SafetyPanel.vue'
import PolisherPanel from './PolisherPanel.vue'
import PromptScorePanel from './PromptScorePanel.vue'
import ModelAdapterPanel from './ModelAdapterPanel.vue'
import RecipeCard from './RecipeCard.vue'
import SharePanel from './SharePanel.vue'
import { buildAllOutputs } from '../utils/directorBuilder.js'
import { buildModelOutputs } from '../utils/modelAdapter.js'
import { scorePrompt } from '../utils/promptScore.js'
import { detectConflicts, removeConflictWord } from '../utils/conflictDetector.js'
import { detectSafety, applySafetyFix } from '../utils/safety.js'
import { cleanPrompt } from '../utils/tokenCleaner.js'
import { importFromUrl } from '../utils/shareLink.js'
import { storage, downloadJson } from '../utils/storage.js'
import directorModulesData from '../data/directorModules.json'
import presetsData from '../data/presets.json'

const props = defineProps({
  darkMode: { type: Boolean, default: false },
  hideHero: { type: Boolean, default: false }
})

const modules = directorModulesData

// Define module groups
const moduleGroups = [
  {
    id: 'foundation', icon: '🏗️', label: 'Foundation', sublabel: '基础设定',
    modules: modules.filter(m => m.group === 'foundation')
  },
  {
    id: 'visual', icon: '🎬', label: 'Visual Direction', sublabel: '视觉导演',
    modules: modules.filter(m => m.group === 'visual')
  },
  {
    id: 'subject', icon: '👤', label: 'Subject Details', sublabel: '主体细节',
    modules: modules.filter(m => m.group === 'subject')
  },
  {
    id: 'atmosphere', icon: '✨', label: 'Atmosphere', sublabel: '氛围叙事',
    modules: modules.filter(m => m.group === 'atmosphere')
  },
  {
    id: 'control', icon: '🎛️', label: 'Control', sublabel: '控制项',
    modules: modules.filter(m => m.group === 'control')
  }
]

const director = reactive({
  model: '', subject: '', scene: '', composition: '', expression: '',
  face: '', hair: '', body: '', clothing: '', lighting: '', camera: '',
  depthOfField: '', background: '', atmosphere: '', caption: '', mustKeep: '', avoid: '', ratio: ''
})

const locks = reactive({})
const outputs = ref({})
const modelOutputs = ref({})
const conflicts = ref([])
const safetyResult = ref(null)
const currentScore = ref(null)
const recipes = ref([])
const showDeconstructor = ref(false)
const showSaveModal = ref(false)
const recipeName = ref('')
const toastMsg = ref('')
const toastType = ref('success')
const expandedGroups = reactive({
  foundation: true, visual: true, subject: true, atmosphere: true, control: true
})

const hasOutput = computed(() => Object.values(outputs.value).some(v => v && typeof v === 'string' && v.trim()))
const allLocked = computed(() => modules.every(m => locks[m.id]))
const filledCount = computed(() => modules.filter(m => director[m.id]?.trim()).length)
const allGroupsExpanded = computed(() => Object.values(expandedGroups).every(Boolean))

const scoreBadgeClass = computed(() => {
  if (!currentScore.value) return ''
  const s = currentScore.value.score
  if (s >= 90) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
  if (s >= 70) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
  if (s >= 50) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
  return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
})

onMounted(() => {
  const saved = storage.getDirectorCurrent()
  if (saved) {
    Object.keys(saved).forEach(key => { if (key in director) director[key] = saved[key] || '' })
  }
  recipes.value = storage.getDirectorSchemes()
  const shared = importFromUrl()
  if (shared) {
    Object.keys(shared).forEach(key => { if (key in director) director[key] = shared[key] || '' })
    notify('已从分享链接加载配置')
  }
  // Auto-run safety and score on load
  updateAnalysis()
})

// Watch director changes and auto-update analysis
let analysisTimer = null
watch(director, () => {
  storage.setDirectorCurrent({ ...director })
  // Debounce analysis updates
  clearTimeout(analysisTimer)
  analysisTimer = setTimeout(() => { updateAnalysis() }, 500)
}, { deep: true })

function updateAnalysis() {
  safetyResult.value = detectSafety(director)
  conflicts.value = detectConflicts(director)
  currentScore.value = scorePrompt(director)
}

function notify(msg, type = 'success') {
  toastMsg.value = msg; toastType.value = type
  setTimeout(() => { toastMsg.value = '' }, 2200)
}

function toggleLock(id) { locks[id] = !locks[id] }
function toggleAllLocks() { const v = !allLocked.value; modules.forEach(m => { locks[m.id] = v }) }
function clearModule(id) { if (!locks[id]) director[id] = '' }

function clearAll() {
  if (!confirm('确定清空所有模块？')) return
  modules.forEach(m => { if (!locks[m.id]) director[m.id] = '' })
  outputs.value = {}; modelOutputs.value = {}; conflicts.value = []
}

function toggleGroup(groupId) { expandedGroups[groupId] = !expandedGroups[groupId] }
function expandAllGroups() {
  const v = !allGroupsExpanded.value
  Object.keys(expandedGroups).forEach(k => { expandedGroups[k] = v })
}

function groupFilledCount(groupModules) {
  return groupModules.filter(m => director[m.id]?.trim()).length
}

function getPresetsForModule(moduleId) {
  if (moduleId === 'scene') return presetsData.scenes
  if (moduleId === 'camera') return presetsData.textures
  if (moduleId === 'composition') return presetsData.compositions
  if (moduleId === 'lighting') return presetsData.lightings
  if (moduleId === 'atmosphere') return presetsData.atmospheres
  return []
}

function loadGalleryExample(ex) {
  const d = ex.director
  Object.keys(d).forEach(key => { if (key in director && !locks[key]) director[key] = d[key] || '' })
  notify(`已加载：${ex.name}`)
}

function applyDeconstructed(parsed) {
  Object.keys(parsed).forEach(key => { if (key in director && !locks[key] && parsed[key]) director[key] = parsed[key] })
  notify('已填入拆解结果')
}

function generateAll() {
  outputs.value = buildAllOutputs(director)
  modelOutputs.value = buildModelOutputs(director)
  notify('已生成全部输出')
}

function detectConflictsNow() {
  conflicts.value = detectConflicts(director)
  if (conflicts.value.length) notify(`检测到 ${conflicts.value.length} 个冲突`, 'error')
  else notify('未检测到冲突 ✅')
}

function runSafetyCheck() {
  safetyResult.value = detectSafety(director)
  if (safetyResult.value.level === 'Safe') notify('安全检查通过 ✅')
  else notify(`检测到 ${safetyResult.value.hits.length} 项安全提示`, 'error')
}

function runScore() {
  currentScore.value = scorePrompt(director)
}

function runCleaner() {
  const result = cleanPrompt(director)
  Object.assign(director, result.cleaned)
  if (result.issues.length) notify(`清理完成，发现 ${result.issues.length} 个问题`)
  else notify('内容干净，无需清理 ✅')
}

function handleRemoveWord(word) {
  const newDirector = removeConflictWord(director, word)
  Object.keys(newDirector).forEach(key => { if (key in director) director[key] = newDirector[key] })
  // Re-run analysis
  setTimeout(() => {
    conflicts.value = detectConflicts(director)
    currentScore.value = scorePrompt(director)
  }, 100)
  notify(`已移除：${word}`)
}

function handleSafetyFix(fixIndex) {
  const newDirector = applySafetyFix(director, fixIndex)
  Object.keys(newDirector).forEach(key => { if (key in director) director[key] = newDirector[key] })
  setTimeout(() => {
    safetyResult.value = detectSafety(director)
    currentScore.value = scorePrompt(director)
  }, 100)
  notify('已应用安全修复')
}

function handlePolishApply(preview) {
  Object.keys(preview).forEach(key => { if (key in director) director[key] = preview[key] })
  notify('已应用润色结果')
}

function handlePolishUndo(original) {
  Object.keys(original).forEach(key => { if (key in director) director[key] = original[key] })
  notify('已撤销上次润色')
}

function saveRecipe() { showSaveModal.value = true }

function confirmSaveRecipe() {
  if (!recipeName.value) { notify('请输入配方名称', 'error'); return }
  storage.saveDirectorScheme(recipeName.value, director, outputs.value)
  recipes.value = storage.getDirectorSchemes()
  recipeName.value = ''
  showSaveModal.value = false
  notify('配方已保存')
}

function loadRecipe(recipe) {
  const d = recipe.director
  if (!d) return
  Object.keys(d).forEach(key => { if (key in director && !locks[key]) director[key] = d[key] || '' })
  if (recipe.outputs && Object.keys(recipe.outputs).length) outputs.value = recipe.outputs
  notify(`已加载配方：${recipe.name}`)
}

async function copyRecipe(recipe) {
  const text = recipe.outputs?.chineseDirector || recipe.outputs?.chineseShort || ''
  if (!text) { notify('无可复制内容', 'error'); return }
  try { await navigator.clipboard.writeText(text) } catch {
    const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.left = '-9999px'
    document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove()
  }
  notify('已复制配方输出')
}

function exportRecipe(recipe) {
  downloadJson(recipe, `recipe_${recipe.name || 'unnamed'}_${Date.now()}.json`)
  notify('已导出配方')
}

function exportJson() {
  const data = { director: { ...director }, outputs: outputs.value, modelOutputs: modelOutputs.value, exportedAt: new Date().toISOString() }
  downloadJson(data, `director_${Date.now()}.json`)
  notify('已导出JSON')
}

// Expose methods for parent (App.vue)
defineExpose({ loadGalleryExample, applyDeconstructed, director })
</script>

<style scoped>
.toolbar-btn {
  border-radius: 999px; background: #f1f5f9; padding: 6px 12px;
  font-size: 12px; font-weight: 700; color: #475569; transition: all 0.15s;
}
.toolbar-btn:hover { background: #e2e8f0; }
.toolbar-btn:active { transform: scale(0.95); }
.toolbar-btn.primary { background: #22c55e; color: white; }
.toolbar-btn.primary:hover { background: #16a34a; }
.toolbar-btn-dark { background: #334155; color: #cbd5e1; }
.toolbar-btn-dark:hover { background: #475569; }

.action-btn {
  border-radius: 8px; background: #f8fafc; padding: 8px 12px;
  font-size: 12px; font-weight: 600; color: #475569; transition: all 0.15s;
}
.action-btn:hover { background: #f1f5f9; }
.action-btn:active { transform: scale(0.95); }
.action-btn-dark { background: #1e293b; color: #94a3b8; }
.action-btn-dark:hover { background: #334155; }
</style>
