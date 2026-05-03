<template>
  <div class="min-h-screen" :class="darkMode ? 'bg-slate-900' : 'bg-[#ecfdf3]'">
    <!-- Top Navigation Bar -->
    <header class="sticky top-0 z-40 border-b backdrop-blur" :class="darkMode ? 'border-slate-700 bg-slate-800/95' : 'border-emerald-100 bg-white/95'">
      <div class="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2">
        <div class="flex items-center gap-3">
          <h1 class="text-base font-black sm:text-lg" :class="darkMode ? 'text-slate-100' : 'text-slate-900'">
            🎬 Prompt Director Studio
          </h1>
          <span class="hidden sm:inline rounded-full px-2 py-0.5 text-[10px] font-bold" :class="darkMode ? 'bg-emerald-900/40 text-emerald-300' : 'bg-emerald-100 text-emerald-700'">v{{ appMeta.version }}</span>
        </div>
        <div class="flex items-center gap-2">
          <button class="top-btn" :class="darkMode ? 'dark' : ''" @click="toggleDark">{{ darkMode ? '☀️' : '🌙' }}</button>
        </div>
      </div>
      <!-- Nav Tabs -->
      <div class="mx-auto max-w-7xl overflow-x-auto px-4 pb-2">
        <div class="flex gap-1">
          <button
            v-for="tab in navTabs"
            :key="tab.id"
            class="nav-tab whitespace-nowrap"
            :class="activeSection === tab.id
              ? (darkMode ? 'nav-tab-active-dark' : 'nav-tab-active')
              : (darkMode ? 'nav-tab-dark' : '')"
            @click="switchSection(tab.id)"
          >{{ tab.icon }} {{ tab.label }}</button>
        </div>
      </div>
    </header>

    <!-- Dashboard Section -->
    <div v-show="activeSection === 'dashboard'">
      <div class="mx-auto max-w-7xl px-4 py-8 sm:py-12">
        <!-- Hero -->
        <section class="relative overflow-hidden rounded-2xl border mb-8"
          :class="darkMode ? 'border-slate-700 bg-gradient-to-br from-slate-800 via-slate-800 to-violet-900/30' : 'border-emerald-200 bg-gradient-to-br from-white via-emerald-50/50 to-violet-50'">
          <div class="relative z-10 px-6 py-8 sm:px-10 sm:py-12">
            <h1 class="text-2xl sm:text-3xl font-black tracking-tight" :class="darkMode ? 'text-white' : 'text-slate-900'">
              Prompt Director Studio
            </h1>
            <p class="mt-2 text-sm sm:text-base max-w-lg" :class="darkMode ? 'text-slate-400' : 'text-slate-600'">
              从一句灵感，到一份可控的导演级 AI 图像提示词。
            </p>
            <div class="mt-4 flex flex-wrap gap-2">
              <span class="badge" :class="darkMode ? 'badge-dark' : 'badge-green'">🏠 Local First</span>
              <span class="badge" :class="darkMode ? 'badge-dark' : 'badge-blue'">🚫 No Backend</span>
              <span class="badge" :class="darkMode ? 'badge-dark' : 'badge-purple'">🔒 Privacy Friendly</span>
              <span class="badge" :class="darkMode ? 'badge-dark' : 'badge-amber'">🖼️ GPT Image Ready</span>
              <span class="badge" :class="darkMode ? 'badge-dark' : 'badge-orange'">📦 GitHub Pages Ready</span>
            </div>
            <div class="mt-6 flex flex-wrap gap-3">
              <button class="hero-btn primary" @click="switchSection('director')">✍️ 从一句话开始</button>
              <button class="hero-btn" :class="darkMode ? 'hero-btn-dark' : ''" @click="switchSection('deconstruct')">🔍 粘贴提示词拆解</button>
              <button class="hero-btn" :class="darkMode ? 'hero-btn-dark' : ''" @click="switchSection('showcase')">🖼️ 浏览 Showcase</button>
              <button class="hero-btn" :class="darkMode ? 'hero-btn-dark' : ''" @click="loadRandomExample">⚡ 加载官方示例</button>
            </div>
          </div>
          <div class="absolute -right-20 -top-20 h-60 w-60 rounded-full opacity-10" :class="darkMode ? 'bg-violet-500' : 'bg-emerald-400'"></div>
          <div class="absolute -bottom-10 -left-10 h-40 w-40 rounded-full opacity-10" :class="darkMode ? 'bg-blue-500' : 'bg-violet-400'"></div>
        </section>

        <!-- Stats -->
        <section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div v-for="stat in stats" :key="stat.label" class="rounded-xl border p-4" :class="darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'">
            <div class="text-2xl">{{ stat.icon }}</div>
            <div class="mt-1 text-lg font-black" :class="darkMode ? 'text-slate-100' : 'text-slate-800'">{{ stat.value }}</div>
            <div class="text-xs" :class="darkMode ? 'text-slate-400' : 'text-slate-500'">{{ stat.label }}</div>
          </div>
        </section>

        <!-- Quick access cards -->
        <section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="card in quickCards" :key="card.section"
            class="cursor-pointer rounded-xl border p-5 transition-all hover:shadow-md"
            :class="darkMode ? 'border-slate-700 bg-slate-800 hover:border-emerald-500/50' : 'border-slate-200 bg-white hover:border-emerald-300'"
            @click="switchSection(card.section)">
            <div class="text-2xl">{{ card.icon }}</div>
            <h3 class="mt-2 text-sm font-bold" :class="darkMode ? 'text-slate-200' : 'text-slate-800'">{{ card.title }}</h3>
            <p class="mt-1 text-xs" :class="darkMode ? 'text-slate-400' : 'text-slate-500'">{{ card.desc }}</p>
          </div>
        </section>
      </div>
    </div>

    <!-- Director Section -->
    <div v-show="activeSection === 'director'" class="mx-auto max-w-7xl p-3">
      <DirectorEditor ref="directorEditorRef" :dark-mode="darkMode" :hide-hero="true" />
    </div>

    <!-- Deconstruct Section -->
    <div v-show="activeSection === 'deconstruct'" class="mx-auto max-w-3xl p-4">
      <DeconstructorPanel @apply="applyDeconstructed" />
    </div>

    <!-- Showcase Section -->
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

    <!-- Lab Section -->
    <div v-show="activeSection === 'lab'" class="mx-auto max-w-7xl p-4">
      <div class="grid gap-4 lg:grid-cols-2">
        <VariantsPanel :variants="variants" @generate="generateVariantList" />
        <PromptScorePanel :score="promptScore" :dark-mode="darkMode" @score="calculateScore" />
        <TokenCleanerPanel :issues="cleanerIssues" @clean="runCleaner" />
        <PolisherPanel :director="directorForAnalysis" :dark-mode="darkMode"
          @apply="handleLabPolish" @undo="handleLabPolishUndo" />
        <PromptDiffPanel :dark-mode="darkMode" @toast="notify" />
        <SafetyPanel :safety="labSafety" :dark-mode="darkMode" @apply-fix="handleLabSafetyFix" />
      </div>
    </div>

    <!-- Settings Section -->
    <div v-show="activeSection === 'settings'" class="mx-auto max-w-3xl p-4">
      <div class="rounded-xl border p-5" :class="darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'">
        <h3 class="text-sm font-bold mb-4" :class="darkMode ? 'text-slate-200' : 'text-slate-800'">⚙️ 设置</h3>

        <!-- Dark mode toggle -->
        <div class="flex items-center justify-between py-3 border-b" :class="darkMode ? 'border-slate-700' : 'border-slate-100'">
          <div>
            <div class="text-sm font-semibold" :class="darkMode ? 'text-slate-200' : 'text-slate-700'">🌙 深色模式</div>
            <div class="text-xs" :class="darkMode ? 'text-slate-400' : 'text-slate-500'">切换亮色/暗色主题</div>
          </div>
          <button class="rounded-full px-4 py-1.5 text-xs font-bold transition"
            :class="darkMode ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'"
            @click="toggleDark">{{ darkMode ? '已开启' : '已关闭' }}</button>
        </div>

        <!-- Import/Export -->
        <div class="py-3 border-b" :class="darkMode ? 'border-slate-700' : 'border-slate-100'">
          <div class="text-sm font-semibold mb-2" :class="darkMode ? 'text-slate-200' : 'text-slate-700'">📤 数据管理</div>
          <div class="flex flex-wrap gap-2">
            <button class="settings-btn" :class="darkMode ? 'settings-btn-dark' : ''" @click="openImport">📥 导入词库</button>
            <button class="settings-btn" :class="darkMode ? 'settings-btn-dark' : ''" @click="exportLibrary">📤 导出词库</button>
            <button class="settings-btn" :class="darkMode ? 'settings-btn-dark' : ''" @click="exportSchemes">📋 导出方案</button>
            <button class="settings-btn danger" :class="darkMode ? 'settings-btn-dark' : ''" @click="clearAllData">🗑️ 清空所有</button>
            <button class="settings-btn" :class="darkMode ? 'settings-btn-dark' : ''" @click="resetLibrary">🔄 重置词库</button>
          </div>
        </div>

        <!-- About -->
        <div class="py-3">
          <div class="text-sm font-semibold mb-1" :class="darkMode ? 'text-slate-200' : 'text-slate-700'">ℹ️ 关于</div>
          <div class="text-xs space-y-1" :class="darkMode ? 'text-slate-400' : 'text-slate-500'">
            <p>Prompt Director Studio v{{ appMeta.version }}</p>
            <p>{{ appMeta.tagline }}</p>
            <p>所有数据保存在浏览器 localStorage，不上传服务器。</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Classic Mode (accessible via Director header link) -->
    <!-- Hidden but kept for backward compat -->
    <div v-show="activeSection === 'classic'" class="hidden">
      <CategoryTabs :categories="promptData.categories" :current-category="currentCategory" @change="changeCategory" />
      <main class="mx-auto flex max-w-7xl flex-col gap-3 p-3">
        <section class="min-w-0 overflow-hidden rounded-lg shadow-sm ring-1" :class="darkMode ? 'bg-slate-800/60 ring-slate-700' : 'bg-white/60 ring-emerald-100'">
          <SubTabs v-if="currentCategoryData?.tabs?.length" :tabs="currentCategoryData.tabs" :current-tab="currentTab" :tab-counts="tabCounts" @change="changeTab" />
          <div class="space-y-3 p-3">
            <SearchBox :categories="promptData.categories" :selected-items="selectedItems" :current-category-id="currentCategory" @select="selectItem" @deselect="deselectItem" />
            <div class="flex flex-wrap gap-2">
              <button class="tool-btn" :class="darkMode ? 'dark' : ''" @click="toggleAllGroups">{{ allExpanded ? '收起全部' : '展开全部' }}</button>
              <button class="tool-btn" :class="darkMode ? 'dark' : ''" @click="randomRealistic">真实照片随机</button>
              <button class="tool-btn" :class="darkMode ? 'dark' : ''" @click="randomCurrent">当前分类随机</button>
            </div>
            <div v-if="currentTabData?.groups?.length" class="space-y-3">
              <KeywordGroup v-for="group in currentTabData.groups" :key="group.id" :ref="(el) => setGroupRef(group.id, el)" :group="group" :selected-items="selectedItems" @select="(item) => selectItem(withCurrentMeta(item, group.id))" @deselect="(item) => deselectItem(withCurrentMeta(item, group.id))" />
            </div>
            <div v-else class="rounded-lg p-10 text-center text-sm" :class="darkMode ? 'bg-slate-800 text-slate-500' : 'bg-white text-slate-400'">当前分类暂无关键词</div>
          </div>
        </section>
        <section>
          <SelectedPanel :selected-items="selectedItems" :library="promptData" :editor-state="editorState" :presets="presetSchemes" @update:editor-state="editorState = $event" @remove="deselectItem" @clear-current="clearCurrent" @clear-all="clearAllClassic" @save="showSaveModal = true" @show-schemes="showSchemesModal = true" @copy="handleCopy" @apply-preset="applyPreset" @random-realistic="randomRealistic" />
        </section>
      </main>
    </div>

    <!-- Save modal -->
    <div v-if="showSaveModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div class="w-full max-w-sm rounded-2xl p-5 shadow-xl" :class="darkMode ? 'bg-slate-800' : 'bg-white'">
        <h3 class="mb-4 font-bold" :class="darkMode ? 'text-slate-100' : 'text-slate-900'">保存方案</h3>
        <input v-model.trim="schemeName" class="mb-4 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-emerald-400" :class="darkMode ? 'border-slate-600 bg-slate-700 text-slate-200' : 'border-slate-200'" placeholder="请输入方案名称" @keyup.enter="saveCurrentScheme" />
        <div class="flex gap-2">
          <button class="modal-btn" :class="darkMode ? 'dark' : ''" @click="showSaveModal = false">取消</button>
          <button class="modal-btn primary" @click="saveCurrentScheme">保存</button>
        </div>
      </div>
    </div>

    <!-- Schemes modal -->
    <SavedSchemes v-if="showSchemesModal" :schemes="savedSchemes" @close="showSchemesModal = false" @restore="restoreScheme" @delete="removeScheme" />

    <!-- Toast -->
    <div v-if="toast.message" class="fixed left-1/2 top-20 z-[60] -translate-x-1/2 rounded-full px-5 py-2 text-sm font-semibold text-white shadow-lg" :class="toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'">
      {{ toast.message }}
    </div>

    <input ref="fileInput" class="hidden" type="file" accept="application/json,.json" @change="importLibrary" />

    <!-- Footer -->
    <footer class="mt-8 border-t py-4 text-center text-[11px]" :class="darkMode ? 'border-slate-700 text-slate-500' : 'border-slate-200 text-slate-400'">
      v{{ appMeta.version }} / Local First / No Backend / No Tracking / GitHub Pages Ready / built {{ appMeta.buildDate }}
    </footer>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { appMeta } from './config/appMeta.js'
import CategoryTabs from './components/CategoryTabs.vue'
import SubTabs from './components/SubTabs.vue'
import SearchBox from './components/SearchBox.vue'
import KeywordGroup from './components/KeywordGroup.vue'
import SelectedPanel from './components/SelectedPanel.vue'
import SavedSchemes from './components/SavedSchemes.vue'
import DirectorEditor from './components/DirectorEditor.vue'
import DeconstructorPanel from './components/DeconstructorPanel.vue'
import VariantsPanel from './components/VariantsPanel.vue'
import PromptScorePanel from './components/PromptScorePanel.vue'
import TokenCleanerPanel from './components/TokenCleanerPanel.vue'
import PolisherPanel from './components/PolisherPanel.vue'
import PromptDiffPanel from './components/PromptDiffPanel.vue'
import SafetyPanel from './components/SafetyPanel.vue'
import defaultPrompts from './data/prompts.json'
import examplesData from './data/examples.json'
import { deleteScheme, downloadJson, importPromptLibrary, saveScheme, storage } from './utils/storage.js'
import { getItemKey, getSelectedCountByTab, randomSelect, randomSelectFromGroups, withMeta } from './utils/promptBuilder.js'
import { buildModelOutputs } from './utils/modelAdapter.js'
import { scorePrompt } from './utils/promptScore.js'
import { generateVariants } from './utils/variantGenerator.js'
import { cleanPrompt } from './utils/tokenCleaner.js'
import { detectSafety, applySafetyFix } from './utils/safety.js'

const darkMode = ref(false)
const activeSection = ref('dashboard')
const directorEditorRef = ref(null)

const navTabs = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'director', icon: '🎬', label: 'Director' },
  { id: 'deconstruct', icon: '🔍', label: 'Deconstruct' },
  { id: 'showcase', icon: '🖼️', label: 'Showcase' },
  { id: 'lab', icon: '🧪', label: 'Lab' },
  { id: 'settings', icon: '⚙️', label: 'Settings' }
]

const stats = [
  { icon: '🎬', value: '17', label: '结构化模块' },
  { icon: '🤖', value: '6', label: '模型适配器' },
  { icon: '🖼️', value: examplesData.length.toString(), label: '内置示例' },
  { icon: '🔒', value: '100%', label: '隐私本地' }
]

const quickCards = [
  { icon: '✍️', section: 'director', title: 'Director 编辑器', desc: '结构化填写 17 个模块，一键生成多模型提示词' },
  { icon: '🔍', section: 'deconstruct', title: 'Deconstruct 拆解', desc: '粘贴一段提示词，自动拆解为结构化模块' },
  { icon: '🖼️', section: 'showcase', title: 'Showcase 展示', desc: '浏览内置高级示例，一键加载体验' },
  { icon: '🧪', section: 'lab', title: 'Lab 实验室', desc: '变体生成、质量评分、Token 清理' },
  { icon: '⚙️', section: 'settings', title: 'Settings 设置', desc: '深色模式、导入导出、数据管理' }
]

const examples = examplesData

// Classic mode state (preserved)
const presetSchemes = [
  {
    id: 'metro_ccd_snapshot', name: '地铁 CCD 抓拍', description: '真实、随手拍、城市通勤感', mode: 'enhanced',
    refs: [['subject', 'female'], ['subject', 'young_adult_woman'], ['scene', 'subway'], ['scene', 'escalator'], ['style', 'old_digicam_snapshot'], ['style', 'realistic'], ['composition', 'top_down'], ['camera', 'ccd'], ['camera', 'film_grain'], ['lighting', 'cold_fluorescent_light'], ['quality', 'real_photo_texture'], ['negative', 'avoid_ai_plastic']]
  },
  {
    id: 'night_flash_street', name: '夜晚直闪街拍', description: '夜景、直闪、湿润路面', mode: 'enhanced',
    refs: [['subject', 'model'], ['scene', 'night_street'], ['scene', 'wet_pavement'], ['style', 'street_photo'], ['style', 'candid_street_snap'], ['composition', 'near_shot'], ['camera', 'phone_flash'], ['lighting', 'harsh_flash'], ['quality', 'real_photo_texture'], ['negative', 'avoid_overprocessed']]
  },
  {
    id: 'film_city_portrait', name: '35mm 城市胶片', description: '低饱和、自然颗粒', mode: 'natural',
    refs: [['subject', 'young_adult'], ['scene', 'city_street'], ['style', 'film'], ['style', 'low_saturation'], ['composition', 'center_compose'], ['camera', 'lens_35'], ['camera', 'film_grain'], ['lighting', 'natural_light'], ['quality', 'balanced_exposure_color'], ['negative', 'avoid_dirty_image']]
  }
]

function createDefaultEditorState() {
  return { mode: 'natural', language: 'zh', templateId: '', smartDetails: true, usePlaceholders: false, positiveText: '', negativeText: '', dirtyPositive: false, dirtyNegative: false }
}

const promptData = ref(defaultPrompts)
const selectedItems = ref([])
const savedSchemes = ref([])
const editorState = ref(createDefaultEditorState())
const currentCategory = ref('draw')
const currentTab = ref('subject')
const allExpanded = ref(true)
const groupRefs = ref({})
const fileInput = ref(null)
const showSaveModal = ref(false)
const showSchemesModal = ref(false)
const schemeName = ref('')
const toast = ref({ message: '', type: 'success' })

// Lab state
const variants = ref([])
const promptScore = ref(null)
const cleanerIssues = ref([])
const labSafety = ref(null)
const labPolishUndo = ref(null)

const libraryId = computed(() => `${promptData.value.version || '0'}-${promptData.value.updatedAt || 'unknown'}`)
const currentCategoryData = computed(() => promptData.value.categories?.find((c) => c.id === currentCategory.value))
const currentTabData = computed(() => currentCategoryData.value?.tabs?.find((t) => t.id === currentTab.value))
const tabCounts = computed(() => getSelectedCountByTab(selectedItems.value, currentCategory.value, currentCategoryData.value?.tabs || []))

function notify(message, type = 'success') {
  toast.value = { message, type }
  window.setTimeout(() => { toast.value.message = '' }, 2200)
}

function toggleDark() {
  darkMode.value = !darkMode.value
  document.documentElement.classList.toggle('dark', darkMode.value)
  localStorage.setItem('prompt_market_dark_mode', JSON.stringify(darkMode.value))
}

function switchSection(id) {
  activeSection.value = id
  localStorage.setItem('prompt_market_active_section', id)
}

function loadRandomExample() {
  const ex = examples[Math.floor(Math.random() * examples.length)]
  if (ex) loadShowcaseExample(ex)
}

function loadShowcaseExample(ex) {
  if (directorEditorRef.value?.loadGalleryExample) {
    directorEditorRef.value.loadGalleryExample(ex)
  } else {
    // Fallback: store and switch
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

function applyDeconstructed(parsed) {
  if (directorEditorRef.value?.applyDeconstructed) {
    directorEditorRef.value.applyDeconstructed(parsed)
  }
  switchSection('director')
  notify('已填入拆解结果')
}

// Lab functions
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

// Director reference for Lab panels
const directorForAnalysis = computed(() => directorEditorRef.value?.director || {})

// Lab safety
function updateLabSafety() {
  const d = directorEditorRef.value?.director
  if (d) labSafety.value = detectSafety(d)
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

// Classic mode functions (preserved)
function loadEditorState() {
  editorState.value = { ...createDefaultEditorState(), ...storage.getEditorState(libraryId.value, createDefaultEditorState()) }
}

function setGroupRef(id, el) { if (el) groupRefs.value[id] = el }
function withCurrentMeta(item, groupId = '') { return withMeta(item, currentCategory.value, currentTab.value, groupId) }

function selectItem(item) {
  const normalized = item.categoryId ? item : withCurrentMeta(item)
  const key = getItemKey(normalized)
  if (!selectedItems.value.some((s) => getItemKey(s) === key)) selectedItems.value = [...selectedItems.value, normalized]
}

function deselectItem(item) {
  const key = getItemKey(item.categoryId ? item : withCurrentMeta(item))
  selectedItems.value = selectedItems.value.filter((s) => getItemKey(s) !== key)
}

function changeCategory(categoryId) {
  currentCategory.value = categoryId
  storage.setCurrentCategory(categoryId)
  const nextCategory = promptData.value.categories.find((c) => c.id === categoryId)
  currentTab.value = nextCategory?.tabs?.find((t) => t.groups?.length)?.id || ''
}

function changeTab(tabId) { currentTab.value = tabId }

function toggleAllGroups() {
  allExpanded.value = !allExpanded.value
  Object.values(groupRefs.value).forEach((g) => { allExpanded.value ? g?.expand?.() : g?.collapse?.() })
}

function findPromptItem(tabId, itemId) {
  const draw = promptData.value.categories?.find((c) => c.id === 'draw')
  const tab = draw?.tabs?.find((t) => t.id === tabId)
  if (!tab) return null
  for (const group of tab.groups || []) {
    const item = group.items?.find((kw) => kw.id === itemId)
    if (item) return withMeta(item, 'draw', tab.id, group.id)
  }
  return null
}

function applyPromptRefs(refs, replace = true) {
  const items = refs.map(([tabId, itemId]) => findPromptItem(tabId, itemId)).filter(Boolean)
  selectedItems.value = replace ? [] : selectedItems.value
  items.forEach(selectItem)
}

function applyPreset(preset) {
  applyPromptRefs(preset.refs)
  editorState.value = { ...editorState.value, mode: preset.mode || 'enhanced', language: 'zh', smartDetails: true, positiveText: '', negativeText: '', dirtyPositive: false, dirtyNegative: false }
  notify(`已套用预设：${preset.name}`)
}

function randomRealistic() {
  const pools = [
    [['subject', 'female'], ['subject', 'male'], ['subject', 'model']],
    [['scene', 'city_street'], ['scene', 'night_street'], ['scene', 'subway']],
    [['style', 'realistic'], ['style', 'film'], ['style', 'street_photo']],
    [['composition', 'near_shot'], ['composition', 'medium_shot']],
    [['lighting', 'natural_light'], ['lighting', 'soft_light']],
    [['camera', 'lens_35'], ['camera', 'ccd']],
    [['quality', 'real_photo_texture'], ['quality', 'balanced_exposure_color']],
    [['negative', 'avoid_ai_plastic'], ['negative', 'avoid_bad_anatomy']]
  ]
  const refs = pools.flatMap((pool) => randomSelect(pool, 1, 2))
  applyPromptRefs(refs)
  editorState.value = { ...editorState.value, mode: 'enhanced', language: 'zh', smartDetails: true, positiveText: '', negativeText: '', dirtyPositive: false, dirtyNegative: false }
  notify('已生成随机方案')
}

function randomCurrent() {
  if (!currentCategoryData.value || !currentTabData.value?.groups?.length) return
  randomSelectFromGroups(currentTabData.value.groups, 1, 2).forEach((item) => {
    selectItem(withMeta(item, currentCategory.value, currentTab.value, item.groupId))
  })
  notify('已随机添加关键词')
}

function clearAllClassic() {
  if (!selectedItems.value.length || window.confirm('确定清空所有已选关键词吗？')) {
    selectedItems.value = []
    notify('已清空全部')
  }
}

function clearCurrent() {
  selectedItems.value = selectedItems.value.filter((item) => item.categoryId !== currentCategory.value)
  notify('已清空当前分类')
}

function saveCurrentScheme() {
  if (!selectedItems.value.length && !editorState.value.positiveText) { notify('请先选择关键词', 'error'); return }
  if (!schemeName.value) { notify('请输入方案名称', 'error'); return }
  saveScheme(schemeName.value, selectedItems.value, editorState.value)
  savedSchemes.value = storage.getSavedSchemes()
  schemeName.value = ''
  showSaveModal.value = false
  notify('方案已保存')
}

function restoreScheme(scheme) {
  selectedItems.value = [...(scheme.prompts || [])]
  editorState.value = { ...createDefaultEditorState(), ...(scheme.promptState || {}) }
  showSchemesModal.value = false
  notify('方案已恢复')
}

function removeScheme(id) {
  if (window.confirm('确定删除方案？')) { savedSchemes.value = deleteScheme(id); notify('已删除') }
}

function handleCopy(result) { notify(result.success ? '已复制' : '复制失败', result.success ? 'success' : 'error') }
function openImport() { fileInput.value?.click() }

async function importLibrary(event) {
  const file = event.target.files?.[0]
  if (!file) return
  try {
    const data = await importPromptLibrary(file)
    storage.setCustomPrompts(data)
    promptData.value = data
    selectedItems.value = []
    changeCategory(data.categories[0]?.id || 'draw')
    loadEditorState()
    notify('词库导入成功')
  } catch (error) { notify(error.message || '导入失败', 'error') }
  finally { event.target.value = '' }
}

function exportLibrary() { downloadJson(promptData.value, `prompts_${Date.now()}.json`); notify('词库已导出') }
function exportSchemes() { downloadJson(savedSchemes.value, `schemes_${Date.now()}.json`); notify('方案已导出') }

function clearAllData() {
  if (window.confirm('确定清空所有本地数据？此操作不可恢复。')) {
    localStorage.clear()
    notify('已清空所有数据')
    location.reload()
  }
}

function resetLibrary() {
  if (window.confirm('确定恢复默认词库？')) {
    storage.clearCustomPrompts(); storage.clearSelected()
    promptData.value = defaultPrompts; selectedItems.value = []
    changeCategory('draw'); loadEditorState(); notify('已恢复默认词库')
  }
}

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

onMounted(() => {
  // Restore dark mode
  const savedDark = localStorage.getItem('prompt_market_dark_mode')
  if (savedDark !== null) {
    darkMode.value = JSON.parse(savedDark)
    document.documentElement.classList.toggle('dark', darkMode.value)
  }

  // Restore active section
  const savedSection = localStorage.getItem('prompt_market_active_section')
  if (savedSection && navTabs.some(t => t.id === savedSection)) {
    activeSection.value = savedSection
  }

  // Load classic mode data
  promptData.value = storage.getCustomPrompts() || defaultPrompts
  selectedItems.value = storage.getSelectedPrompts()
  savedSchemes.value = storage.getSavedSchemes()
  loadEditorState()

  const savedCategory = storage.getCurrentCategory()
  const category = promptData.value.categories.find((item) => item.id === savedCategory) || promptData.value.categories[0]
  currentCategory.value = category?.id || 'draw'
  const savedTab = storage.getCurrentTab()
  const tab = category?.tabs?.find((item) => item.id === savedTab && item.groups?.length) || category?.tabs?.find((item) => item.groups?.length)
  currentTab.value = tab?.id || ''

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

watch(selectedItems, (items) => storage.setSelectedPrompts(items), { deep: true })
watch(editorState, (state) => storage.setEditorState(libraryId.value, state), { deep: true })
watch(currentTab, (tab) => storage.setCurrentTab(tab))
</script>

<style scoped>
.nav-tab {
  border-radius: 8px; padding: 6px 14px; font-size: 12px; font-weight: 700;
  color: #64748b; transition: all 0.15s;
}
.nav-tab:hover { background: #f1f5f9; }
.nav-tab-active { background: #22c55e; color: white; }
.nav-tab-dark { color: #94a3b8; }
.nav-tab-dark:hover { background: #334155; }
.nav-tab-active-dark { background: #22c55e; color: white; }

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

.badge {
  display: inline-flex; align-items: center; border-radius: 999px; padding: 4px 10px;
  font-size: 11px; font-weight: 700; letter-spacing: -0.01em;
}
.badge-green { background: #dcfce7; color: #15803d; }
.badge-blue { background: #dbeafe; color: #1d4ed8; }
.badge-purple { background: #ede9fe; color: #6d28d9; }
.badge-amber { background: #fef3c7; color: #b45309; }
.badge-orange { background: #ffedd5; color: #c2410c; }
.badge-dark { background: #334155; color: #94a3b8; }

.tool-btn {
  border-radius: 8px; background: white; padding: 9px 12px; font-size: 13px; font-weight: 700; color: #047857;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05);
}
.tool-btn.dark { background: #334155; color: #86efac; }

.modal-btn {
  flex: 1; border-radius: 8px; background: #f8fafc; padding: 9px 12px;
  font-size: 13px; font-weight: 700; color: #475569;
}
.modal-btn.dark { background: #334155; color: #94a3b8; }
.modal-btn.primary { background: #22c55e; color: white; }

.top-btn {
  white-space: nowrap; border-radius: 999px; border: 1px solid #d1fae5;
  background: #f0fdf4; padding: 7px 11px; font-size: 12px; font-weight: 600; color: #047857;
}
.top-btn:hover { background: #dcfce7; }
.top-btn.dark { border-color: #334155; background: #1e293b; color: #86efac; }
.top-btn.dark:hover { background: #334155; }

.settings-btn {
  border-radius: 8px; background: #f1f5f9; padding: 8px 14px;
  font-size: 12px; font-weight: 700; color: #475569; transition: all 0.15s;
}
.settings-btn:hover { background: #e2e8f0; }
.settings-btn.dark { background: #334155; color: #cbd5e1; }
.settings-btn.dark:hover { background: #475569; }
.settings-btn.danger { background: #fef2f2; color: #dc2626; }
.settings-btn.danger:hover { background: #fee2e2; }
.settings-btn.danger.dark { background: #450a0a; color: #fca5a5; }
</style>
