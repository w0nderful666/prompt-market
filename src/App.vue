<template>
  <div class="min-h-screen" :class="darkMode ? 'bg-slate-900' : 'bg-[#ecfdf3]'">
    <!-- Header -->
    <AppHeader :dark-mode="darkMode" @toggle-dark="toggleDark">
      <AppNavigation :tabs="navTabs" :active="activeSection" :dark-mode="darkMode" @navigate="switchSection" />
    </AppHeader>

    <!-- Dashboard -->
    <div v-show="activeSection === 'dashboard'">
      <DashboardSection :dark-mode="darkMode" @navigate="switchSection" @load-random="loadRandomExample" />
    </div>

    <!-- Director -->
    <div v-show="activeSection === 'director'" class="mx-auto max-w-7xl p-3">
      <DirectorEditor ref="directorEditorRef" :dark-mode="darkMode" :hide-hero="true" />
    </div>

    <!-- Deconstruct -->
    <div v-show="activeSection === 'deconstruct'" class="mx-auto max-w-3xl p-4">
      <DeconstructorPanel @apply="applyDeconstructed" />
    </div>

    <!-- Showcase -->
    <div v-show="activeSection === 'showcase'" class="mx-auto max-w-7xl p-4">
      <div class="mb-4">
        <h2 class="text-lg font-black" :class="darkMode ? 'text-slate-100' : 'text-slate-900'">🖼️ Showcase</h2>
        <p class="mt-1 text-sm" :class="darkMode ? 'text-slate-400' : 'text-slate-500'">内置 {{ examples.length }} 个完整可用的高级示例，一键加载到 Director</p>
      </div>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="ex in examples" :key="ex.id"
          class="group relative overflow-hidden rounded-xl border transition-all duration-200 hover:shadow-lg"
          :class="darkMode ? 'border-slate-700 bg-slate-800 hover:border-emerald-500/50' : 'border-slate-200 bg-white hover:border-emerald-300'">
          <div class="h-1 w-full" :class="scoreColor(ex.score)"></div>
          <div class="p-4">
            <div class="mb-2 flex items-start justify-between">
              <h4 class="text-sm font-bold" :class="darkMode ? 'text-slate-200' : 'text-slate-800'">{{ ex.name }}</h4>
              <span class="rounded-full px-2 py-0.5 text-[10px] font-bold" :class="scoreBadge(ex.score)">{{ ex.score }}分</span>
            </div>
            <p class="text-xs" :class="darkMode ? 'text-slate-400' : 'text-slate-500'">{{ ex.subtitle }}</p>
            <div class="mt-2 flex flex-wrap gap-1">
              <span v-for="tag in (ex.tags || []).slice(0, 4)" :key="tag"
                class="rounded-full px-2 py-0.5 text-[10px]"
                :class="darkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'">{{ tag }}</span>
            </div>
            <div class="mt-2 flex items-center gap-2 text-[10px]" :class="darkMode ? 'text-slate-500' : 'text-slate-400'">
              <span>推荐模型: {{ ex.model }}</span>
              <span>·</span>
              <span>比例: {{ ex.director?.ratio || '—' }}</span>
            </div>
            <div class="mt-3 flex gap-2">
              <button class="flex-1 rounded-lg py-1.5 text-[11px] font-bold transition active:scale-95"
                :class="darkMode ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'bg-emerald-500 text-white hover:bg-emerald-600'"
                @click="loadShowcaseExample(ex)">加载到 Director</button>
              <button class="rounded-lg px-3 py-1.5 text-[11px] font-bold transition active:scale-95"
                :class="darkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
                @click="copyShowcaseGPT(ex)">复制 GPT</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Snapshots -->
    <div v-show="activeSection === 'snapshots'">
      <SnapshotsPanel
        :dark-mode="darkMode"
        :current-director="currentDirector"
        :current-outputs="currentOutputs"
        :current-score="currentScore"
        :current-safety="currentSafety"
        :current-conflicts="currentConflicts"
        :selected-model="currentDirector?.model || ''"
        @restore="handleSnapshotRestore"
        @toast="notifyFromEvent" />
    </div>

    <!-- Prompt Packs -->
    <div v-show="activeSection === 'packs'">
      <PromptPacksPanel
        :dark-mode="darkMode"
        :current-director="currentDirector"
        :current-outputs="currentOutputs"
        @load-prompt="handlePackLoad"
        @toast="notifyFromEvent" />
    </div>

    <!-- Lab -->
    <div v-show="activeSection === 'lab'">
      <LabSection
        :dark-mode="darkMode"
        :variants="variants"
        :score="promptScore"
        :cleaner-issues="cleanerIssues"
        :director="directorForAnalysis"
        :safety="labSafety"
        @generate-variants="generateVariantList"
        @calculate-score="calculateScore"
        @run-cleaner="runCleaner"
        @polish-apply="handleLabPolish"
        @polish-undo="handleLabPolishUndo"
        @toast="notify"
        @safety-fix="handleLabSafetyFix" />
    </div>

    <!-- Settings -->
    <div v-show="activeSection === 'settings'">
      <SettingsSection
        ref="settingsRef"
        :dark-mode="darkMode"
        @toggle-dark="toggleDark"
        @export-all="handleExportAll"
        @import-all="handleImportAll"
        @export-library="exportLibrary"
        @import-library="openImport"
        @clear-history="handleClearHistory"
        @clear-diff="handleClearDiff"
        @clear-snapshots="handleClearSnapshots"
        @clear-packs="handleClearPacks"
        @reset-settings="handleResetSettings"
        @clear-all="handleClearAll" />
    </div>

    <!-- Import/Export Modal -->
    <ImportExportModal v-if="showImportExportModal"
      :dark-mode="darkMode"
      :mode="importExportMode"
      :usage="storageUsage"
      :export-data="exportData"
      :import-preview="importPreview"
      :import-error="importError"
      :import-result="importResult"
      @close="showImportExportModal = false"
      @confirm-export="doExportAll"
      @import-confirm="doImportAll" />

    <!-- Toast -->
    <div v-if="toast.message" class="fixed left-1/2 top-20 z-[60] -translate-x-1/2 rounded-full px-5 py-2 text-sm font-semibold text-white shadow-lg" :class="toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'">
      {{ toast.message }}
    </div>

    <input ref="fileInput" class="hidden" type="file" accept="application/json,.json" @change="importLibrary" />

    <!-- Footer -->
    <AppFooter :dark-mode="darkMode" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { appMeta } from './config/appMeta.js'
import AppHeader from './components/layout/AppHeader.vue'
import AppNavigation from './components/layout/AppNavigation.vue'
import AppFooter from './components/layout/AppFooter.vue'
import DashboardSection from './sections/DashboardSection.vue'
import LabSection from './sections/LabSection.vue'
import SettingsSection from './sections/SettingsSection.vue'
import DirectorEditor from './components/DirectorEditor.vue'
import DeconstructorPanel from './components/DeconstructorPanel.vue'
import SnapshotsPanel from './components/SnapshotsPanel.vue'
import PromptPacksPanel from './components/PromptPacksPanel.vue'
import ImportExportModal from './components/ImportExportModal.vue'
import defaultPrompts from './data/prompts.json'
import examplesData from './data/examples.json'
import { deleteScheme, downloadJson, importPromptLibrary, storage } from './utils/storage.js'
import { buildModelOutputs } from './utils/modelAdapter.js'
import { scorePrompt } from './utils/promptScore.js'
import { generateVariants } from './utils/variantGenerator.js'
import { cleanPrompt } from './utils/tokenCleaner.js'
import { detectSafety, applySafetyFix } from './utils/safety.js'
import { exportAllData, importAllData, getStorageUsage, clearHistoryData, clearDiffHistory, clearSnapshots, clearUserPacks, resetSettings, clearAllPromptMarketData, safeRead, safeWrite } from './utils/storageManager.js'

const darkMode = ref(false)
const activeSection = ref('dashboard')
const directorEditorRef = ref(null)
const settingsRef = ref(null)
const fileInput = ref(null)

const navTabs = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'director', icon: '🎬', label: 'Director' },
  { id: 'deconstruct', icon: '🔍', label: 'Deconstruct' },
  { id: 'showcase', icon: '🖼️', label: 'Showcase' },
  { id: 'snapshots', icon: '📸', label: 'Snapshots' },
  { id: 'packs', icon: '📦', label: 'Packs' },
  { id: 'lab', icon: '🧪', label: 'Lab' },
  { id: 'settings', icon: '⚙️', label: 'Settings' }
]

const examples = examplesData

// Toast
const toast = ref({ message: '', type: 'success' })
function notify(message, type = 'success') {
  toast.value = { message, type }
  window.setTimeout(() => { toast.value.message = '' }, 2200)
}
function notifyFromEvent(e) {
  if (typeof e === 'string') notify(e)
  else notify(e.message, e.type)
}

// Dark mode
function toggleDark() {
  darkMode.value = !darkMode.value
  document.documentElement.classList.toggle('dark', darkMode.value)
  localStorage.setItem('prompt_market_dark_mode', JSON.stringify(darkMode.value))
}

// Navigation
function switchSection(id) {
  activeSection.value = id
  localStorage.setItem('prompt_market_active_section', id)
}

// Showcase
function loadRandomExample() {
  const ex = examples[Math.floor(Math.random() * examples.length)]
  if (ex) loadShowcaseExample(ex)
}

function loadShowcaseExample(ex) {
  if (directorEditorRef.value?.loadGalleryExample) {
    directorEditorRef.value.loadGalleryExample(ex)
  } else {
    localStorage.setItem('prompt_market_pending_example', JSON.stringify(ex))
  }
  switchSection('director')
  notify(`已加载：${ex.name}`)
}

async function copyShowcaseGPT(ex) {
  if (!ex.director) return
  const outputs = buildModelOutputs(ex.director)
  const text = outputs.gptImage?.text || ''
  if (!text) return
  try { await navigator.clipboard.writeText(text) } catch {
    const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.left = '-9999px'
    document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove()
  }
  notify('已复制 GPT Image 输出')
}

// Deconstruct
function applyDeconstructed(parsed) {
  if (directorEditorRef.value?.applyDeconstructed) {
    directorEditorRef.value.applyDeconstructed(parsed)
  }
  switchSection('director')
  notify('已填入拆解结果')
}

// Director state accessors for Snapshots/Packs
const currentDirector = computed(() => directorEditorRef.value?.director || {})
const currentOutputs = computed(() => directorEditorRef.value?.outputs || {})
const currentScore = computed(() => directorEditorRef.value?.currentScore || null)
const currentSafety = computed(() => directorEditorRef.value?.safetyResult || null)
const currentConflicts = computed(() => directorEditorRef.value?.conflicts || [])

// Snapshots
function handleSnapshotRestore(snap) {
  if (!snap.director) return
  if (directorEditorRef.value?.loadGalleryExample) {
    directorEditorRef.value.loadGalleryExample({ director: snap.director, name: snap.title })
  }
  switchSection('director')
  notify(`已恢复快照：${snap.title}`)
}

// Prompt Packs
function handlePackLoad(prompt) {
  if (!prompt.director) return
  if (directorEditorRef.value?.loadGalleryExample) {
    directorEditorRef.value.loadGalleryExample({ director: prompt.director, name: prompt.title })
  }
  switchSection('director')
  notify(`已加载：${prompt.title}`)
}

// Lab functions
const variants = ref([])
const promptScore = ref(null)
const cleanerIssues = ref([])
const labSafety = ref(null)
const labPolishUndo = ref(null)

const directorForAnalysis = computed(() => directorEditorRef.value?.director || {})

function generateVariantList() {
  const d = directorEditorRef.value?.director
  if (d) variants.value = generateVariants(d)
  else notify('请先在 Director 中填写内容', 'error')
}

function calculateScore() {
  const d = directorEditorRef.value?.director
  if (d) promptScore.value = scorePrompt(d)
  else notify('请先在 Director 中填写内容', 'error')
}

function runCleaner() {
  const d = directorEditorRef.value?.director
  if (!d) { notify('请先在 Director 中填写内容', 'error'); return }
  const result = cleanPrompt(d)
  Object.assign(d, result.cleaned)
  cleanerIssues.value = result.issues
  if (result.issues.length) notify(`清理完成，发现 ${result.issues.length} 个问题`)
  else notify('内容干净，无需清理 ✅')
}

function handleLabSafetyFix(fixIndex) {
  const d = directorEditorRef.value?.director
  if (!d) return
  const newD = applySafetyFix(d, fixIndex)
  Object.assign(d, newD)
  labSafety.value = detectSafety(d)
  promptScore.value = scorePrompt(d)
  notify('已应用安全修复')
}

function handleLabPolish(preview) {
  const d = directorEditorRef.value?.director
  if (!d) return
  labPolishUndo.value = { ...d }
  Object.assign(d, preview)
  promptScore.value = scorePrompt(d)
  notify('已应用润色结果')
}

function handleLabPolishUndo(original) {
  const d = directorEditorRef.value?.director
  if (!d) return
  Object.assign(d, original)
  promptScore.value = scorePrompt(d)
  notify('已撤销润色')
}

// Import/Export All
const showImportExportModal = ref(false)
const importExportMode = ref('export')
const exportData = ref(null)
const importPreview = ref(null)
const importError = ref('')
const importResult = ref(null)
const storageUsage = ref({ formatted: '0 B' })
const pendingImportData = ref(null)

function handleExportAll() {
  exportData.value = exportAllData()
  storageUsage.value = getStorageUsage()
  importExportMode.value = 'export'
  importResult.value = null
  showImportExportModal.value = true
  // Auto-download
  setTimeout(() => {
    downloadJson(exportData.value, `prompt_director_backup_${Date.now()}.json`)
    notify('已导出全部数据')
    showImportExportModal.value = false
  }, 300)
}

function handleImportAll() {
  importExportMode.value = 'import'
  importPreview.value = null
  importError.value = ''
  importResult.value = null
  pendingImportData.value = null
  showImportExportModal.value = true
  // Trigger file input
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result || '{}'))
        const dataCount = data.data ? Object.keys(data.data).length : Object.keys(data).length
        importPreview.value = {
          appVersion: data.appVersion || '未知',
          exportedAt: data.exportedAt || null,
          dataCount
        }
        pendingImportData.value = data
      } catch {
        importError.value = 'JSON 解析失败，请检查文件格式'
      }
    }
    reader.readAsText(file)
  }
  input.click()
}

function doImportAll(mode) {
  if (!pendingImportData.value) return
  importResult.value = importAllData(pendingImportData.value, mode)
  if (importResult.value.success) {
    notify(`导入成功: ${importResult.value.imported} 项`)
    settingsRef.value?.refreshUsage()
  } else {
    notify(`导入部分失败: ${importResult.value.errors?.length} 个错误`, 'error')
  }
}

// Library import/export
function openImport() { fileInput.value?.click() }

async function importLibrary(event) {
  const file = event.target.files?.[0]
  if (!file) return
  try {
    const data = await importPromptLibrary(file)
    safeWrite('prompt_market_custom_prompts', data)
    notify('词库导入成功')
  } catch (error) { notify(error.message || '导入失败', 'error') }
  finally { event.target.value = '' }
}

function exportLibrary() {
  const data = safeRead('prompt_market_custom_prompts', defaultPrompts)
  downloadJson(data, `prompts_${Date.now()}.json`)
  notify('词库已导出')
}

// Clear actions
function handleClearHistory() {
  if (window.confirm('确定清空编辑历史？')) {
    clearHistoryData()
    notify('历史已清空')
    settingsRef.value?.refreshUsage()
  }
}

function handleClearDiff() {
  clearDiffHistory()
  notify('Diff 历史已清空')
  settingsRef.value?.refreshUsage()
}

function handleClearSnapshots() {
  if (window.confirm('确定清空所有快照？')) {
    clearSnapshots()
    notify('快照已清空')
    settingsRef.value?.refreshUsage()
  }
}

function handleClearPacks() {
  if (window.confirm('确定清空用户 Packs？（官方 Pack 保留）')) {
    const count = clearUserPacks()
    notify(`已清空 ${count} 个用户 Pack`)
    settingsRef.value?.refreshUsage()
  }
}

function handleResetSettings() {
  if (window.confirm('确定恢复默认设置？')) {
    resetSettings()
    notify('设置已恢复默认，刷新页面生效')
  }
}

function handleClearAll() {
  if (window.confirm('确定清空所有本地数据？此操作不可恢复。')) {
    clearAllPromptMarketData()
    notify('已清空所有数据')
    location.reload()
  }
}

// Score helpers for Showcase
function scoreColor(score) {
  if (score >= 90) return 'bg-emerald-500'
  if (score >= 70) return 'bg-blue-500'
  if (score >= 50) return 'bg-amber-500'
  return 'bg-red-500'
}

function scoreBadge(score) {
  if (score >= 90) return 'bg-emerald-100 text-emerald-700'
  if (score >= 70) return 'bg-blue-100 text-blue-700'
  if (score >= 50) return 'bg-amber-100 text-amber-700'
  return 'bg-red-100 text-red-700'
}

// Init
onMounted(() => {
  const savedDark = localStorage.getItem('prompt_market_dark_mode')
  if (savedDark !== null) {
    darkMode.value = JSON.parse(savedDark)
    document.documentElement.classList.toggle('dark', darkMode.value)
  }

  const savedSection = localStorage.getItem('prompt_market_active_section')
  if (savedSection && navTabs.some(t => t.id === savedSection)) {
    activeSection.value = savedSection
  }

  // Check for pending example
  const pending = localStorage.getItem('prompt_market_pending_example')
  if (pending) {
    localStorage.removeItem('prompt_market_pending_example')
    try {
      const ex = JSON.parse(pending)
      if (directorEditorRef.value?.loadGalleryExample) directorEditorRef.value.loadGalleryExample(ex)
    } catch {}
  }
})
</script>
