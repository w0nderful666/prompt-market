<template>
  <div class="mx-auto max-w-7xl p-4">
    <div class="grid gap-4 lg:grid-cols-2">
      <VariantsPanel :variants="variants" @generate="$emit('generate-variants')" />
      <PromptScorePanel :score="score" :dark-mode="darkMode" @score="$emit('calculate-score')" />
      <TokenCleanerPanel :issues="cleanerIssues" @clean="$emit('run-cleaner')" />
      <PolisherPanel :director="director" :dark-mode="darkMode"
        @apply="$emit('polish-apply', $event)" @undo="$emit('polish-undo', $event)" />
      <PromptDiffPanel :dark-mode="darkMode" @toast="$emit('toast', $event)" />
      <SafetyPanel :safety="safety" :dark-mode="darkMode" @apply-fix="$emit('safety-fix', $event)" />
    </div>
  </div>
</template>

<script setup>
import VariantsPanel from '../components/VariantsPanel.vue'
import PromptScorePanel from '../components/PromptScorePanel.vue'
import TokenCleanerPanel from '../components/TokenCleanerPanel.vue'
import PolisherPanel from '../components/PolisherPanel.vue'
import PromptDiffPanel from '../components/PromptDiffPanel.vue'
import SafetyPanel from '../components/SafetyPanel.vue'

defineProps({
  darkMode: { type: Boolean, default: false },
  variants: { type: Array, default: () => [] },
  score: { type: Object, default: null },
  cleanerIssues: { type: Array, default: () => [] },
  director: { type: Object, default: () => ({}) },
  safety: { type: Object, default: null }
})

defineEmits(['generate-variants', 'calculate-score', 'run-cleaner', 'polish-apply', 'polish-undo', 'toast', 'safety-fix'])
</script>
