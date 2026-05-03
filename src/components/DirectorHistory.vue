<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
    <div class="flex h-[80vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl dark:bg-slate-800">
      <div class="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-700">
        <h3 class="font-bold text-slate-900 dark:text-slate-100">📜 历史记录 & 收藏</h3>
        <button class="text-slate-400 hover:text-slate-600" @click="$emit('close')">✕</button>
      </div>

      <div class="flex border-b border-slate-100 px-5 dark:border-slate-700">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="border-b-2 px-4 py-2 text-xs font-bold transition"
          :class="activeTab === tab.id ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-400 hover:text-slate-600'"
          @click="activeTab = tab.id"
        >{{ tab.name }} ({{ getCount(tab.id) }})</button>
      </div>

      <div class="flex-1 overflow-y-auto p-5">
        <!-- History -->
        <div v-if="activeTab === 'history'" class="space-y-3">
          <div v-if="!history.length" class="py-10 text-center text-xs text-slate-400">暂无历史记录</div>
          <div
            v-for="item in history"
            :key="item.id"
            class="rounded-xl border border-slate-100 p-3 transition hover:border-emerald-200 dark:border-slate-700"
          >
            <div class="flex items-center justify-between">
              <span class="text-xs text-slate-400">{{ formatDate(item.createdAt) }}</span>
              <div class="flex gap-1">
                <button class="text-xs text-emerald-500 hover:text-emerald-700" @click="$emit('restore', item)">恢复</button>
                <button class="text-xs text-red-400 hover:text-red-600" @click="$emit('delete-history', item.id)">删除</button>
              </div>
            </div>
            <p class="mt-1 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{{ item.outputs?.chineseShort || '无输出' }}</p>
          </div>
        </div>

        <!-- Favorites -->
        <div v-if="activeTab === 'favorites'" class="space-y-3">
          <div v-if="!favorites.length" class="py-10 text-center text-xs text-slate-400">暂无收藏</div>
          <div
            v-for="item in favorites"
            :key="item.id"
            class="rounded-xl border border-slate-100 p-3 transition hover:border-emerald-200 dark:border-slate-700"
          >
            <div class="flex items-center justify-between">
              <span class="text-xs text-slate-400">{{ formatDate(item.createdAt) }}</span>
              <div class="flex gap-1">
                <button class="text-xs text-emerald-500 hover:text-emerald-700" @click="$emit('restore', item)">恢复</button>
                <button class="text-xs text-red-400 hover:text-red-600" @click="$emit('delete-favorite', item.id)">删除</button>
              </div>
            </div>
            <p class="mt-1 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{{ item.outputs?.chineseShort || '无输出' }}</p>
          </div>
        </div>

        <!-- Schemes -->
        <div v-if="activeTab === 'schemes'" class="space-y-3">
          <div v-if="!schemes.length" class="py-10 text-center text-xs text-slate-400">暂无保存的方案</div>
          <div
            v-for="item in schemes"
            :key="item.id"
            class="rounded-xl border border-slate-100 p-3 transition hover:border-emerald-200 dark:border-slate-700"
          >
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-slate-700 dark:text-slate-300">{{ item.name }}</span>
              <div class="flex gap-1">
                <button class="text-xs text-emerald-500 hover:text-emerald-700" @click="$emit('restore-scheme', item)">恢复</button>
                <button class="text-xs text-red-400 hover:text-red-600" @click="$emit('delete-scheme', item.id)">删除</button>
              </div>
            </div>
            <p class="mt-1 text-xs text-slate-400">{{ formatDate(item.createdAt) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  history: { type: Array, default: () => [] },
  favorites: { type: Array, default: () => [] },
  schemes: { type: Array, default: () => [] }
})

defineEmits(['close', 'restore', 'delete-history', 'delete-favorite', 'restore-scheme', 'delete-scheme'])

const activeTab = ref('history')
const tabs = [
  { id: 'history', name: '历史记录' },
  { id: 'favorites', name: '收藏' },
  { id: 'schemes', name: '保存方案' }
]

function getCount(tabId) {
  if (tabId === 'history') return 0
  if (tabId === 'favorites') return 0
  return 0
}

function formatDate(iso) {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
  } catch { return '' }
}
</script>
