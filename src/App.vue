<template>
  <div class="min-h-screen bg-[#ecfdf3]">
    <TopBar
      :version="promptData.version"
      :updated-at="promptData.updatedAt"
      @import="openImport"
      @export-library="exportLibrary"
      @export-schemes="exportSchemes"
      @schemes="showSchemesModal = true"
      @clear="clearAll"
      @reset="resetLibrary"
    />

    <CategoryTabs
      :categories="promptData.categories"
      :current-category="currentCategory"
      @change="changeCategory"
    />

    <main class="mx-auto flex max-w-7xl flex-col gap-3 p-3">
      <section class="min-w-0 overflow-hidden rounded-lg bg-white/60 shadow-sm ring-1 ring-emerald-100">
        <SubTabs
          v-if="currentCategoryData?.tabs?.length"
          :tabs="currentCategoryData.tabs"
          :current-tab="currentTab"
          :tab-counts="tabCounts"
          @change="changeTab"
        />

        <div class="space-y-3 p-3">
          <SearchBox
            :categories="promptData.categories"
            :selected-items="selectedItems"
            :current-category-id="currentCategory"
            @select="selectItem"
            @deselect="deselectItem"
          />

          <div class="flex flex-wrap gap-2">
            <button class="tool-btn" @click="toggleAllGroups">{{ allExpanded ? '收起全部' : '展开全部' }}</button>
            <button class="tool-btn" @click="randomRealistic">真实照片随机</button>
            <button class="tool-btn" @click="randomCurrent">当前分类随机</button>
          </div>

          <div v-if="currentTabData?.groups?.length" class="space-y-3">
            <KeywordGroup
              v-for="group in currentTabData.groups"
              :key="group.id"
              :ref="(el) => setGroupRef(group.id, el)"
              :group="group"
              :selected-items="selectedItems"
              @select="(item) => selectItem(withCurrentMeta(item, group.id))"
              @deselect="(item) => deselectItem(withCurrentMeta(item, group.id))"
            />
          </div>

          <div v-else class="rounded-lg bg-white p-10 text-center text-sm text-slate-400">
            当前分类暂无关键词，后续可以通过导入词库扩展。
          </div>
        </div>
      </section>

      <section>
        <SelectedPanel
          :selected-items="selectedItems"
          :library="promptData"
          :editor-state="editorState"
          :presets="presetSchemes"
          @update:editor-state="editorState = $event"
          @remove="deselectItem"
          @clear-current="clearCurrent"
          @clear-all="clearAll"
          @save="showSaveModal = true"
          @show-schemes="showSchemesModal = true"
          @copy="handleCopy"
          @apply-preset="applyPreset"
          @random-realistic="randomRealistic"
        />
      </section>
    </main>

    <div v-if="showSaveModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div class="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
        <h3 class="mb-4 font-bold text-slate-900">保存方案</h3>
        <input
          v-model.trim="schemeName"
          class="mb-4 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-400"
          placeholder="请输入方案名称"
          @keyup.enter="saveCurrentScheme"
        />
        <div class="flex gap-2">
          <button class="modal-btn" @click="showSaveModal = false">取消</button>
          <button class="modal-btn primary" @click="saveCurrentScheme">保存</button>
        </div>
      </div>
    </div>

    <SavedSchemes
      v-if="showSchemesModal"
      :schemes="savedSchemes"
      @close="showSchemesModal = false"
      @restore="restoreScheme"
      @delete="removeScheme"
    />

    <div
      v-if="toast.message"
      class="fixed left-1/2 top-20 z-[60] -translate-x-1/2 rounded-full px-5 py-2 text-sm font-semibold text-white shadow-lg"
      :class="toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'"
    >
      {{ toast.message }}
    </div>

    <input ref="fileInput" class="hidden" type="file" accept="application/json,.json" @change="importLibrary" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import TopBar from './components/TopBar.vue'
import CategoryTabs from './components/CategoryTabs.vue'
import SubTabs from './components/SubTabs.vue'
import SearchBox from './components/SearchBox.vue'
import KeywordGroup from './components/KeywordGroup.vue'
import SelectedPanel from './components/SelectedPanel.vue'
import SavedSchemes from './components/SavedSchemes.vue'
import defaultPrompts from './data/prompts.json'
import { deleteScheme, downloadJson, importPromptLibrary, saveScheme, storage } from './utils/storage.js'
import { getItemKey, getSelectedCountByTab, randomSelect, randomSelectFromGroups, withMeta } from './utils/promptBuilder.js'

const presetSchemes = [
  {
    id: 'metro_ccd_snapshot',
    name: '地铁 CCD 抓拍',
    description: '真实、随手拍、城市通勤感',
    mode: 'enhanced',
    refs: [
      ['subject', 'female'],
      ['subject', 'young_adult_woman'],
      ['scene', 'subway'],
      ['scene', 'escalator'],
      ['style', 'old_digicam_snapshot'],
      ['style', 'realistic'],
      ['composition', 'top_down'],
      ['camera', 'ccd'],
      ['camera', 'film_grain'],
      ['lighting', 'cold_fluorescent_light'],
      ['quality', 'real_photo_texture'],
      ['negative', 'avoid_ai_plastic']
    ]
  },
  {
    id: 'night_flash_street',
    name: '夜晚直闪街拍',
    description: '夜景、直闪、湿润路面、社交媒体照片',
    mode: 'enhanced',
    refs: [
      ['subject', 'model'],
      ['scene', 'night_street'],
      ['scene', 'wet_pavement'],
      ['style', 'street_photo'],
      ['style', 'candid_street_snap'],
      ['composition', 'near_shot'],
      ['camera', 'phone_flash'],
      ['lighting', 'harsh_flash'],
      ['quality', 'real_photo_texture'],
      ['negative', 'avoid_overprocessed']
    ]
  },
  {
    id: 'film_city_portrait',
    name: '35mm 城市胶片',
    description: '低饱和、自然颗粒、城市纵深',
    mode: 'natural',
    refs: [
      ['subject', 'young_adult'],
      ['scene', 'city_street'],
      ['style', 'film'],
      ['style', 'low_saturation'],
      ['composition', 'center_compose'],
      ['camera', 'lens_35'],
      ['camera', 'film_grain'],
      ['lighting', 'natural_light'],
      ['quality', 'balanced_exposure_color'],
      ['negative', 'avoid_dirty_image']
    ]
  }
]

function createDefaultEditorState() {
  return {
    mode: 'natural',
    language: 'zh',
    templateId: '',
    smartDetails: true,
    usePlaceholders: false,
    positiveText: '',
    negativeText: '',
    dirtyPositive: false,
    dirtyNegative: false
  }
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

const libraryId = computed(() => `${promptData.value.version || '0'}-${promptData.value.updatedAt || 'unknown'}`)

const currentCategoryData = computed(() =>
  promptData.value.categories?.find((category) => category.id === currentCategory.value)
)

const currentTabData = computed(() =>
  currentCategoryData.value?.tabs?.find((tab) => tab.id === currentTab.value)
)

const tabCounts = computed(() =>
  getSelectedCountByTab(selectedItems.value, currentCategory.value, currentCategoryData.value?.tabs || [])
)

function notify(message, type = 'success') {
  toast.value = { message, type }
  window.setTimeout(() => {
    toast.value.message = ''
  }, 2200)
}

function loadEditorState() {
  editorState.value = {
    ...createDefaultEditorState(),
    ...storage.getEditorState(libraryId.value, createDefaultEditorState())
  }
}

function setGroupRef(id, el) {
  if (el) groupRefs.value[id] = el
}

function withCurrentMeta(item, groupId = '') {
  return withMeta(item, currentCategory.value, currentTab.value, groupId)
}

function selectItem(item) {
  const normalized = item.categoryId ? item : withCurrentMeta(item)
  const key = getItemKey(normalized)
  if (!selectedItems.value.some((selected) => getItemKey(selected) === key)) {
    selectedItems.value = [...selectedItems.value, normalized]
  }
}

function deselectItem(item) {
  const key = getItemKey(item.categoryId ? item : withCurrentMeta(item))
  selectedItems.value = selectedItems.value.filter((selected) => getItemKey(selected) !== key)
}

function changeCategory(categoryId) {
  currentCategory.value = categoryId
  storage.setCurrentCategory(categoryId)
  const nextCategory = promptData.value.categories.find((category) => category.id === categoryId)
  currentTab.value = nextCategory?.tabs?.find((tab) => tab.groups?.length)?.id || ''
}

function changeTab(tabId) {
  currentTab.value = tabId
}

function toggleAllGroups() {
  allExpanded.value = !allExpanded.value
  Object.values(groupRefs.value).forEach((group) => {
    allExpanded.value ? group?.expand?.() : group?.collapse?.()
  })
}

function findPromptItem(tabId, itemId) {
  const draw = promptData.value.categories?.find((category) => category.id === 'draw')
  const tab = draw?.tabs?.find((item) => item.id === tabId)
  if (!tab) return null
  for (const group of tab.groups || []) {
    const item = group.items?.find((keyword) => keyword.id === itemId)
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
  editorState.value = {
    ...editorState.value,
    mode: preset.mode || 'enhanced',
    language: 'zh',
    smartDetails: true,
    positiveText: '',
    negativeText: '',
    dirtyPositive: false,
    dirtyNegative: false
  }
  notify(`已套用预设：${preset.name}`)
}

function addRandomItems(category, tab, min = 1, max = 3) {
  randomSelectFromGroups(tab.groups, min, max).forEach((item) => {
    selectItem(withMeta(item, category.id, tab.id, item.groupId))
  })
}

function randomRealistic() {
  const pools = [
    [['subject', 'female'], ['subject', 'male'], ['subject', 'model'], ['subject', 'young_man'], ['subject', 'young_adult_woman']],
    [['scene', 'city_street'], ['scene', 'night_street'], ['scene', 'subway'], ['scene', 'escalator'], ['scene', 'cafe'], ['scene', 'alley']],
    [['style', 'realistic'], ['style', 'film'], ['style', 'street_photo'], ['style', 'old_digicam_snapshot'], ['style', 'amateur_smartphone_photo'], ['style', 'realistic_japanese_photo']],
    [['composition', 'near_shot'], ['composition', 'medium_shot'], ['composition', 'top_down'], ['composition', 'eye_level_portrait'], ['composition', 'subject_off_center']],
    [['lighting', 'natural_light'], ['lighting', 'soft_light'], ['lighting', 'cold_fluorescent_light'], ['lighting', 'golden_hour_backlight'], ['lighting', 'harsh_flash']],
    [['camera', 'lens_35'], ['camera', 'lens_50'], ['camera', 'ccd'], ['camera', 'phone_flash'], ['camera', 'film_grain']],
    [['quality', 'real_photo_texture'], ['quality', 'clean_real_skin'], ['quality', 'balanced_exposure_color'], ['quality', 'sharp_eyes_natural_face']],
    [['negative', 'avoid_ai_plastic'], ['negative', 'avoid_bad_anatomy'], ['negative', 'avoid_text_logo']]
  ]

  const refs = pools.flatMap((pool) => randomSelect(pool, 1, 2))
  applyPromptRefs(refs)
  editorState.value = {
    ...editorState.value,
    mode: 'enhanced',
    language: 'zh',
    smartDetails: true,
    positiveText: '',
    negativeText: '',
    dirtyPositive: false,
    dirtyNegative: false
  }
  notify('已生成克制的真实照片随机方案')
}

function randomCurrent() {
  if (!currentCategoryData.value || !currentTabData.value?.groups?.length) return

  const safeGroups = currentTabData.value.groups.filter((group) => {
    if (currentTab.value === 'subject') return group.id !== 'anime_character'
    if (currentTab.value === 'style') return !['illustration', 'aesthetic_subculture'].includes(group.id)
    return true
  })

  randomSelectFromGroups(safeGroups, 1, 2).forEach((item) => {
    selectItem(withMeta(item, currentCategory.value, currentTab.value, item.groupId))
  })
  notify('已随机添加当前分类关键词')
}

function clearAll() {
  if (!selectedItems.value.length || window.confirm('确定清空所有已选关键词吗？')) {
    selectedItems.value = []
    notify('已清空全部')
  }
}

function clearCurrent() {
  selectedItems.value = selectedItems.value.filter((item) => item.categoryId !== currentCategory.value)
  notify('已清空当前一级分类')
}

function saveCurrentScheme() {
  if (!selectedItems.value.length && !editorState.value.positiveText) {
    notify('请先选择关键词或编辑提示词', 'error')
    return
  }
  if (!schemeName.value) {
    notify('请输入方案名称', 'error')
    return
  }
  saveScheme(schemeName.value, selectedItems.value, editorState.value)
  savedSchemes.value = storage.getSavedSchemes()
  schemeName.value = ''
  showSaveModal.value = false
  notify('方案已保存')
}

function restoreScheme(scheme) {
  selectedItems.value = [...(scheme.prompts || [])]
  editorState.value = {
    ...createDefaultEditorState(),
    ...(scheme.promptState || {})
  }
  showSchemesModal.value = false
  notify('方案已恢复')
}

function removeScheme(id) {
  if (window.confirm('确定删除这个方案吗？')) {
    savedSchemes.value = deleteScheme(id)
    notify('方案已删除')
  }
}

function handleCopy(result) {
  notify(result.success ? '已复制提示词' : '复制失败，请手动选择文本复制', result.success ? 'success' : 'error')
}

function openImport() {
  fileInput.value?.click()
}

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
  } catch (error) {
    notify(error.message || '导入失败，请检查 JSON 格式', 'error')
  } finally {
    event.target.value = ''
  }
}

function exportLibrary() {
  downloadJson(promptData.value, `prompts_${Date.now()}.json`)
  notify('词库已导出')
}

function exportSchemes() {
  downloadJson(savedSchemes.value, `prompt_schemes_${Date.now()}.json`)
  notify('方案已导出')
}

function resetLibrary() {
  if (window.confirm('确定恢复默认词库吗？当前自定义词库和已选关键词会被清除。')) {
    storage.clearCustomPrompts()
    storage.clearSelected()
    promptData.value = defaultPrompts
    selectedItems.value = []
    changeCategory('draw')
    loadEditorState()
    notify('已恢复默认词库')
  }
}

onMounted(() => {
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
})

watch(selectedItems, (items) => storage.setSelectedPrompts(items), { deep: true })
watch(editorState, (state) => storage.setEditorState(libraryId.value, state), { deep: true })
watch(currentTab, (tab) => storage.setCurrentTab(tab))
</script>

<style scoped>
.tool-btn,
.modal-btn {
  border-radius: 8px;
  background: white;
  padding: 9px 12px;
  font-size: 13px;
  font-weight: 700;
  color: #047857;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05);
}

.modal-btn {
  flex: 1;
  background: #f8fafc;
  color: #475569;
}

.modal-btn.primary {
  background: #22c55e;
  color: white;
}
</style>
