<template>
  <div class="director-editor">
    <!-- Hero Section -->
    <section v-if="!hideHero" class="relative mb-6 overflow-hidden rounded-2xl border"
      :class="darkMode ? 'border-slate-700 bg-gradient-to-br from-slate-800 via-slate-800 to-violet-900/30' : 'border-emerald-200 bg-gradient-to-br from-white via-emerald-50/50 to-violet-50'"
    >
      <div class="relative z-10 px-6 py-8 sm:px-10 sm:py-12">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 class="text-2xl sm:text-3xl font-black tracking-tight" :class="darkMode ? 'text-white' : 'text-slate-900'">
              🎬 Prompt Director
            </h1>
            <p class="mt-2 text-sm sm:text-base max-w-lg" :class="darkMode ? 'text-slate-400' : 'text-slate-600'">
              结构化 AI 图像提示词导演工作台 — 模块化填写、多模型适配、质量评分、一键变体
            </p>
            <div class="mt-4 flex flex-wrap gap-2">
              <span class="badge" :class="darkMode ? 'badge-dark' : 'badge-green'">🏠 Local First</span>
              <span class="badge" :class="darkMode ? 'badge-dark' : 'badge-blue'">🚫 No Backend</span>
              <span class="badge" :class="darkMode ? 'badge-dark' : 'badge-purple'">🔒 Privacy Friendly</span>
              <span class="badge" :class="darkMode ? 'badge-dark' : 'badge-orange'">📦 GitHub Pages Ready</span>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <button class="hero-btn primary" @click="showGallery = !showGallery">
              🖼️ Prompt Gallery
            </button>
            <button class="hero-btn" :class="darkMode ? 'hero-btn-dark' : ''" @click="loadQuickExample">
              ⚡ 快速体验
            </button>
          </div>
        </div>
      </div>
      <!-- Decorative -->
      <div class="absolute -right-20 -top-20 h-60 w-60 rounded-full opacity-10" :class="darkMode ? 'bg-violet-500' : 'bg-emerald-400'"></div>
      <div class="absolute -bottom-10 -left-10 h-40 w-40 rounded-full opacity-10" :class="darkMode ? 'bg-blue-500' : 'bg-violet-400'"></div>
    </section>

    <!-- Gallery -->
    <PromptGallery
      v-if="showGallery"
      :examples="examples"
      :dark-mode="darkMode"
      @load="loadGalleryExample"
      @close="showGallery = false"
    />

    <!-- Main Layout: Editor + Sticky Output -->
    <div class="flex flex-col lg:flex-row gap-4">
      <!-- Left: Editor -->
      <div class="flex-1 min-w-0 space-y-4">
        <!-- Toolbar -->
        <div class="flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3"
          :class="darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'">
          <div class="flex items-center gap-3">
            <h2 class="text-sm font-black" :class="darkMode ? 'text-slate-200' : 'text-slate-800'">结构化编辑器</h2>
            <span class="rounded-full px-2 py-0.5 text-[10px] font-bold"
              :class="darkMode ? 'bg-emerald-900/40 text-emerald-300' : 'bg-emerald-100 text-emerald-700'">
              {{ filledCount }}/{{ modules.length }} 模块
            </span>
          </div>
          <div class="flex flex-wrap gap-2">
            <button class="toolbar-btn" :class="darkMode ? 'toolbar-btn-dark' : ''" @click="showGallery = !showGallery">🖼️ Gallery</button>
            <button class="toolbar-btn" :class="darkMode ? 'toolbar-btn-dark' : ''" @click="saveRecipe">💾 保存配方</button>
            <button class="toolbar-btn" :class="darkMode ? 'toolbar-btn-dark' : ''" @click="exportJson">📤 导出</button>
            <button class="toolbar-btn primary" :class="darkMode ? '' : ''" @click="generateAll">🚀 生成输出</button>
          </div>
        </div>

        <!-- Conflict Detector -->
        <ConflictPanel v-if="conflicts.length" :conflicts="conflicts" @dismiss="conflicts = []" />

        <!-- Module Cards -->
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
            :dark-mode="darkMode"
            @toggle-lock="toggleLock(mod.id)"
            @clear="clearModule(mod.id)"
          />
        </div>

        <!-- Quick Actions Row -->
        <div class="flex flex-wrap gap-2 rounded-xl border px-4 py-3"
          :class="darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'">
          <button class="action-btn" :class="darkMode ? 'action-btn-dark' : ''" @click="clearAll">🗑️ 清空全部</button>
          <button class="action-btn" :class="darkMode ? 'action-btn-dark' : ''" @click="toggleAllLocks">
            {{ allLocked ? '🔓 全部解锁' : '🔒 全部锁定' }}
          </button>
          <button class="action-btn" :class="darkMode ? 'action-btn-dark' : ''" @click="showDeconstructor = !showDeconstructor">🔍 拆解提示词</button>
          <button class="action-btn" :class="darkMode ? 'action-btn-dark' : ''" @click="runCleaner">🧹 一键清理</button>
          <button class="action-btn" :class="darkMode ? 'action-btn-dark' : ''" @click="detectConflictsNow">⚠️ 检测冲突</button>
        </div>

        <!-- Deconstructor -->
        <DeconstructorPanel v-if="showDeconstructor" @apply="applyDeconstructed" />

        <!-- Token Cleaner -->
        <TokenCleanerPanel :issues="cleanerIssues" @clean="runCleaner" />

        <!-- Score -->
        <PromptScorePanel :score="promptScore" @score="calculateScore" />

        <!-- Recipes -->
        <div v-if="recipes.length" class="rounded-xl border px-4 py-3"
          :class="darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'">
          <div class="mb-3 flex items-center justify-between">
            <h3 class="text-sm font-bold" :class="darkMode ? 'text-slate-200' : 'text-slate-800'">📋 我的配方 ({{ recipes.length }})</h3>
          </div>
          <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <RecipeCard
              v-for="recipe in recipes"
              :key="recipe.id"
              :recipe="recipe"
              :dark-mode="darkMode"
              @load="loadRecipe"
              @copy="copyRecipe"
              @export="exportRecipe"
            />
          </div>
        </div>

        <!-- Share -->
        <SharePanel :director="director" />
      </div>

      <!-- Right: Sticky Output -->
      <div class="lg:w-[420px] lg:sticky lg:top-20 lg:self-start space-y-4">
        <!-- Model Adapter -->
        <ModelAdapterPanel :outputs="modelOutputs" />

        <!-- Classic Output -->
        <DirectorOutput v-if="hasOutput" :outputs="outputs" />

        <!-- Variants -->
        <VariantsPanel :variants="variants" @generate="generateVariantList" />
      </div>
    </div>

    <!-- Save Recipe Modal -->
    <div v-if="showSaveModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div class="w-full max-w-sm rounded-2xl p-5 shadow-xl" :class="darkMode ? 'bg-slate-800' : 'bg-white'">
        <h3 class="mb-4 font-bold" :class="darkMode ? 'text-slate-100' : 'text-slate-900'">保存配方</h3>
        <input
          v-model.trim="recipeName"
          class="mb-4 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-emerald-400"
          :class="darkMode ? 'border-slate-600 bg-slate-700 text-slate-200' : 'border-slate-200'"
          placeholder="输入配方名称"
          @keyup.enter="confirmSaveRecipe"
        />
        <div class="flex gap-2">
          <button class="flex-1 rounded-lg py-2 text-sm font-bold" :class="darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'" @click="showSaveModal = false">取消</button>
          <button class="flex-1 rounded-lg bg-emerald-500 py-2 text-sm font-bold text-white" @click="confirmSaveRecipe">保存</button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div v-if="toastMsg" class="fixed left-1/2 top-20 z-[60] -translate-x-1/2 rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-lg transition-all"
      :class="toastType === 'error' ? 'bg-red-500' : ''"
    >{{ toastMsg }}</div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, watch } from 'vue'
import DirectorCard from './DirectorCard.vue'
import DirectorOutput from './DirectorOutput.vue'
import PromptScorePanel from './PromptScorePanel.vue'
import DeconstructorPanel from './DeconstructorPanel.vue'
import VariantsPanel from './VariantsPanel.vue'
import ConflictPanel from './ConflictPanel.vue'
import TokenCleanerPanel from './TokenCleanerPanel.vue'
import ModelAdapterPanel from './ModelAdapterPanel.vue'
import RecipeCard from './RecipeCard.vue'
import SharePanel from './SharePanel.vue'
import PromptGallery from './PromptGallery.vue'
import { buildAllOutputs } from '../utils/directorBuilder.js'
import { buildModelOutputs } from '../utils/modelAdapter.js'
import { scorePrompt } from '../utils/promptScore.js'
import { generateVariants } from '../utils/variantGenerator.js'
import { detectConflicts } from '../utils/conflictDetector.js'
import { cleanPrompt } from '../utils/tokenCleaner.js'
import { importFromUrl } from '../utils/shareLink.js'
import { storage, downloadJson, downloadText } from '../utils/storage.js'
import directorModules from '../data/directorModules.json'
import presetsData from '../data/presets.json'
import examplesData from '../data/examples.json'

const props = defineProps({
  darkMode: { type: Boolean, default: false },
  hideHero: { type: Boolean, default: false }
})

const emit = defineEmits(['toast'])

const modules = directorModules
const examples = examplesData

const director = reactive({
  model: '', subject: '', scene: '', composition: '', expression: '',
  face: '', hair: '', body: '', clothing: '', lighting: '', camera: '',
  background: '', atmosphere: '', caption: '', mustKeep: '', avoid: '', ratio: ''
})

const locks = reactive({})
const outputs = ref({})
const modelOutputs = ref({})
const variants = ref([])
const promptScore = ref(null)
const conflicts = ref([])
const cleanerIssues = ref([])
const recipes = ref([])
const showGallery = ref(false)
const showDeconstructor = ref(false)
const showSaveModal = ref(false)
const recipeName = ref('')
const toastMsg = ref('')
const toastType = ref('success')

const hasOutput = computed(() => Object.values(outputs.value).some(v => v && v.trim()))
const allLocked = computed(() => modules.every(m => locks[m.id]))
const filledCount = computed(() => modules.filter(m => director[m.id]?.trim()).length)

onMounted(() => {
  // Load saved director
  const saved = storage.getDirectorCurrent()
  if (saved) {
    Object.keys(saved).forEach(key => { if (key in director) director[key] = saved[key] || '' })
  }
  // Load recipes
  recipes.value = storage.getDirectorSchemes()
  // Check URL hash for shared config
  const shared = importFromUrl()
  if (shared) {
    Object.keys(shared).forEach(key => { if (key in director) director[key] = shared[key] || '' })
    notify('已从分享链接加载配置')
  }
})

watch(director, () => { storage.setDirectorCurrent({ ...director }) }, { deep: true })

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
  outputs.value = {}; modelOutputs.value = {}; variants.value = []; promptScore.value = null; conflicts.value = []
}

function getPresetsForModule(moduleId) {
  if (moduleId === 'scene') return presetsData.scenes
  if (moduleId === 'camera') return presetsData.textures
  if (moduleId === 'composition') return presetsData.compositions
  if (moduleId === 'lighting') return presetsData.lightings
  if (moduleId === 'atmosphere') return presetsData.atmospheres
  return []
}

function loadQuickExample() {
  const ex = examples[0]
  if (ex) loadGalleryExample(ex)
}

function loadGalleryExample(ex) {
  const d = ex.director
  Object.keys(d).forEach(key => { if (key in director && !locks[key]) director[key] = d[key] || '' })
  showGallery.value = false
  notify(`已加载：${ex.name}`)
}

function generateAll() {
  outputs.value = buildAllOutputs(director)
  modelOutputs.value = buildModelOutputs(director)
  notify('已生成全部输出')
}

function calculateScore() {
  promptScore.value = scorePrompt(director)
}

function generateVariantList() {
  variants.value = generateVariants(director)
}

function detectConflictsNow() {
  conflicts.value = detectConflicts(director)
  if (conflicts.value.length) {
    notify(`检测到 ${conflicts.value.length} 个冲突`, 'error')
  } else {
    notify('未检测到冲突 ✅')
  }
}

function runCleaner() {
  const result = cleanPrompt(director)
  Object.assign(director, result.cleaned)
  cleanerIssues.value = result.issues
  if (result.issues.length) {
    notify(`清理完成，发现 ${result.issues.length} 个问题`)
  } else {
    notify('内容干净，无需清理 ✅')
  }
}

function saveRecipe() { showSaveModal.value = true }

function confirmSaveRecipe() {
  if (!recipeName.value) { notify('请输入配方名称', 'error'); return }
  const score = scorePrompt(director)
  const entry = {
    name: recipeName.value,
    director: { ...director },
    outputs: outputs.value,
    score: score.score,
    model: director.model || '未指定',
    tags: [director.scene, director.camera, director.atmosphere].filter(Boolean).slice(0, 3),
    ratio: director.ratio || '',
    updatedAt: new Date().toISOString()
  }
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

function applyDeconstructed(parsed) {
  Object.keys(parsed).forEach(key => { if (key in director && !locks[key] && parsed[key]) director[key] = parsed[key] })
  notify('已填入拆解结果')
}
</script>

<style scoped>
.badge {
  display: inline-flex; align-items: center; border-radius: 999px; padding: 4px 10px;
  font-size: 11px; font-weight: 700; letter-spacing: -0.01em;
}
.badge-green { background: #dcfce7; color: #15803d; }
.badge-blue { background: #dbeafe; color: #1d4ed8; }
.badge-purple { background: #ede9fe; color: #6d28d9; }
.badge-orange { background: #ffedd5; color: #c2410c; }
.badge-dark { background: #334155; color: #94a3b8; }

.hero-btn {
  border-radius: 12px; padding: 10px 20px; font-size: 13px; font-weight: 700;
  transition: all 0.15s; border: 1px solid transparent;
}
.hero-btn.primary { background: #22c55e; color: white; }
.hero-btn.primary:hover { background: #16a34a; transform: translateY(-1px); }
.hero-btn.primary:active { transform: scale(0.97); }
.hero-btn:not(.primary) { background: white; color: #475569; border-color: #e2e8f0; }
.hero-btn:not(.primary):hover { background: #f8fafc; border-color: #cbd5e1; }
.hero-btn-dark:not(.primary) { background: #334155; color: #cbd5e1; border-color: #475569; }
.hero-btn-dark:not(.primary):hover { background: #475569; }

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
