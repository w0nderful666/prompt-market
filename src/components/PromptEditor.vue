<template>
  <div class="space-y-2">
    <div class="flex flex-wrap items-center gap-2 text-xs text-slate-500">
      <span class="rounded bg-slate-100 px-2 py-1">{{ title }}</span>
      <span>{{ text.length }} 字</span>
      <span>{{ keywordCount }} 个关键词</span>
      <span>{{ modeLabel }}</span>
      <span :class="dirty ? 'text-amber-600' : 'text-emerald-600'">{{ dirty ? '已手动编辑' : '自动生成' }}</span>
    </div>

    <div v-if="pending" class="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
      <p class="mb-2">检测到你已经手动编辑过提示词，是否用最新选择重新生成？</p>
      <div class="flex gap-2">
        <button class="mini-btn primary" @click="$emit('regenerate')">重新生成</button>
        <button class="mini-btn" @click="$emit('keep')">保留手动内容</button>
      </div>
    </div>

    <textarea
      class="h-36 w-full resize-none rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm leading-6 text-slate-700 outline-none focus:border-emerald-300"
      :value="text"
      :placeholder="placeholder"
      @input="$emit('update:text', $event.target.value)"
    />

    <div class="grid grid-cols-2 gap-2">
      <button class="editor-btn primary" @click="$emit('copy')">复制当前内容</button>
      <button class="editor-btn" @click="$emit('restore')">恢复自动生成</button>
      <button class="editor-btn" @click="$emit('clear')">清空编辑内容</button>
      <button class="editor-btn" @click="$emit('rewrite')">改写为更自然</button>
      <button class="editor-btn" @click="$emit('compress')">压缩提示词</button>
      <button class="editor-btn" @click="$emit('expand')">展开提示词</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: '正向提示词' },
  text: { type: String, default: '' },
  dirty: { type: Boolean, default: false },
  pending: { type: Boolean, default: false },
  keywordCount: { type: Number, default: 0 },
  modeLabel: { type: String, default: '' },
  placeholder: { type: String, default: '暂无内容' }
})

defineEmits(['update:text', 'copy', 'restore', 'clear', 'rewrite', 'compress', 'expand', 'regenerate', 'keep'])
</script>

<style scoped>
.editor-btn,
.mini-btn {
  border-radius: 8px;
  background: white;
  padding: 8px;
  font-size: 12px;
  font-weight: 700;
  color: #475569;
}

.editor-btn.primary,
.mini-btn.primary {
  background: #22c55e;
  color: white;
}
</style>
