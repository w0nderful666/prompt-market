<template>
  <div class="mx-auto max-w-7xl overflow-x-auto px-4 pb-2">
    <div class="flex gap-1">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="nav-tab whitespace-nowrap"
        :class="active === tab.id
          ? (darkMode ? 'nav-tab-active-dark' : 'nav-tab-active')
          : (darkMode ? 'nav-tab-dark' : '')"
        @click="$emit('navigate', tab.id)"
      >{{ tab.icon }} {{ tab.label }}</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  tabs: { type: Array, default: () => [] },
  active: { type: String, default: '' },
  darkMode: { type: Boolean, default: false }
})

defineEmits(['navigate'])
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
</style>
