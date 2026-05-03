<template>
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
          <button class="hero-btn primary" @click="$emit('navigate', 'director')">✍️ 从一句话开始</button>
          <button class="hero-btn" :class="darkMode ? 'hero-btn-dark' : ''" @click="$emit('navigate', 'deconstruct')">🔍 粘贴提示词拆解</button>
          <button class="hero-btn" :class="darkMode ? 'hero-btn-dark' : ''" @click="$emit('navigate', 'showcase')">🖼️ 浏览 Showcase</button>
          <button class="hero-btn" :class="darkMode ? 'hero-btn-dark' : ''" @click="$emit('load-random')">⚡ 加载官方示例</button>
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
        @click="$emit('navigate', card.section)">
        <div class="text-2xl">{{ card.icon }}</div>
        <h3 class="mt-2 text-sm font-bold" :class="darkMode ? 'text-slate-200' : 'text-slate-800'">{{ card.title }}</h3>
        <p class="mt-1 text-xs" :class="darkMode ? 'text-slate-400' : 'text-slate-500'">{{ card.desc }}</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import examplesData from '../data/examples.json'

defineProps({
  darkMode: { type: Boolean, default: false }
})

defineEmits(['navigate', 'load-random'])

const stats = [
  { icon: '🎬', value: '18', label: '结构化模块' },
  { icon: '🤖', value: '6', label: '模型适配器' },
  { icon: '🖼️', value: examplesData.length.toString(), label: '内置示例' },
  { icon: '🔒', value: '100%', label: '隐私本地' }
]

const quickCards = [
  { icon: '✍️', section: 'director', title: 'Director 编辑器', desc: '结构化填写 18 个模块，一键生成多模型提示词' },
  { icon: '🔍', section: 'deconstruct', title: 'Deconstruct 拆解', desc: '粘贴一段提示词，自动拆解为结构化模块' },
  { icon: '🖼️', section: 'showcase', title: 'Showcase 展示', desc: '浏览内置高级示例，一键加载体验' },
  { icon: '📸', section: 'snapshots', title: 'Snapshots 快照', desc: '保存和恢复提示词状态快照' },
  { icon: '📦', section: 'packs', title: 'Prompt Packs', desc: '管理提示词模板包，导入导出' },
  { icon: '🧪', section: 'lab', title: 'Lab 实验室', desc: '变体生成、质量评分、Token 清理' },
  { icon: '⚙️', section: 'settings', title: 'Settings 设置', desc: '深色模式、导入导出、数据管理' }
]
</script>

<style scoped>
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
</style>
