<template>
  <div class="space-y-3 rounded-lg bg-slate-50 p-3">
    <div class="grid grid-cols-2 gap-2">
      <button
        v-for="mode in modes"
        :key="mode.id"
        class="rounded-lg px-3 py-2 text-xs font-bold transition"
        :class="modelValue.mode === mode.id ? 'bg-emerald-500 text-white' : 'bg-white text-slate-600'"
        @click="patch({ mode: mode.id })"
      >
        {{ mode.name }}
      </button>
    </div>

    <div class="grid grid-cols-2 gap-2">
      <label class="field-label">
        语言
        <select class="field-control" :value="modelValue.language" @change="patch({ language: $event.target.value })">
          <option value="zh">中文</option>
          <option value="en">英文</option>
        </select>
      </label>
      <label class="field-label">
        智能补充
        <select class="field-control" :value="String(modelValue.smartDetails)" @change="patch({ smartDetails: $event.target.value === 'true' })">
          <option value="true">开启</option>
          <option value="false">关闭</option>
        </select>
      </label>
    </div>

    <label v-if="modelValue.mode === 'template'" class="flex items-center gap-2 text-xs text-slate-500">
      <input
        type="checkbox"
        class="accent-emerald-500"
        :checked="modelValue.usePlaceholders"
        @change="patch({ usePlaceholders: $event.target.checked })"
      />
      未选择变量时显示可编辑占位符
    </label>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Object, required: true }
})

const emit = defineEmits(['update:modelValue'])

const modes = [
  { id: 'keywords', name: '关键词模式' },
  { id: 'natural', name: '自然语言' },
  { id: 'enhanced', name: '增强描述' },
  { id: 'template', name: '模板填充' }
]

function patch(next) {
  emit('update:modelValue', { ...props.modelValue, ...next })
}
</script>

<style scoped>
.field-label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: #64748b;
}

.field-control {
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: white;
  padding: 7px 8px;
  color: #334155;
  outline: none;
}
</style>
