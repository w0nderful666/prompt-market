<template>
  <footer class="mt-8 border-t py-4 text-center text-[11px]" :class="darkMode ? 'border-slate-700 text-slate-500' : 'border-slate-200 text-slate-400'">
    v{{ appMeta.version }} / Local First / No Backend / No Tracking / GitHub Pages Ready / built {{ appMeta.buildDate }}
  </footer>
</template>

<script setup>
import { appMeta } from '../../config/appMeta.js'

defineProps({
  darkMode: { type: Boolean, default: false }
})
</script>
