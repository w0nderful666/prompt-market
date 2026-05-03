<template>
  <div
    class="director-card group relative rounded-xl border transition-all duration-200"
    :class="[
      locked ? 'border-amber-300 bg-amber-50/50 dark:border-amber-600 dark:bg-amber-900/20' : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800',
      'hover:shadow-md dark:hover:shadow-lg'
    ]"
  >
    <div class="flex items-center justify-between border-b px-3 py-2"
      :class="locked ? 'border-amber-200 dark:border-amber-700' : 'border-slate-100 dark:border-slate-700'"
    >
      <div class="flex items-center gap-2">
        <span class="text-base">{{ icon }}</span>
        <span class="text-xs font-bold" :class="locked ? 'text-amber-700 dark:text-amber-300' : 'text-slate-700 dark:text-slate-300'">{{ title }}</span>
        <span v-if="locked" class="rounded bg-amber-200 px-1.5 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-700 dark:text-amber-200">🔒 已锁定</span>
        <span v-if="modelValue && modelValue.trim()" class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
      </div>
      <div class="flex items-center gap-1">
        <button
          class="rounded p-1 text-xs text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
          @click="$emit('toggle-lock')"
          :title="locked ? '解锁' : '锁定'"
        >{{ locked ? '🔓' : '🔒' }}</button>
        <button
          class="rounded p-1 text-xs text-slate-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/30"
          @click="$emit('clear')"
          title="清空"
        >✕</button>
      </div>
    </div>
    <div class="p-3">
      <textarea
        class="w-full resize-none rounded-lg border bg-transparent px-3 py-2 text-sm leading-5 outline-none transition dark:text-slate-200"
        :class="locked
          ? 'border-amber-200 bg-amber-50/30 dark:border-amber-700 dark:bg-amber-900/10 cursor-not-allowed'
          : 'border-slate-200 focus:border-emerald-400 dark:border-slate-600 dark:focus:border-emerald-500'"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="locked"
        rows="2"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <div v-if="presets && presets.length" class="mt-2 flex flex-wrap gap-1">
        <button
          v-for="preset in presets"
          :key="preset.id"
          class="rounded-full border px-2 py-0.5 text-[11px] font-medium transition"
          :class="locked
            ? 'cursor-not-allowed border-amber-200 text-amber-400 dark:border-amber-700'
            : 'border-slate-200 text-slate-500 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-600 dark:text-slate-400 dark:hover:border-emerald-500 dark:hover:bg-emerald-900/30'"
          :disabled="locked"
          @click="insertPreset(preset)"
        >{{ preset.zh }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: String, default: '' },
  title: { type: String, default: '' },
  icon: { type: String, default: '📝' },
  placeholder: { type: String, default: '' },
  locked: { type: Boolean, default: false },
  presets: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:modelValue', 'toggle-lock', 'clear'])

function insertPreset(preset) {
  if (props.locked) return
  const current = props.modelValue || ''
  const separator = current && !current.endsWith('，') && !current.endsWith(', ') ? '，' : ''
  emit('update:modelValue', current + separator + preset.zh)
}
</script>
