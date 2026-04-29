<template>
  <nav class="border-b border-emerald-100 bg-white px-3">
    <div class="mx-auto flex max-w-7xl gap-2 overflow-x-auto py-2">
      <button
        v-for="category in categories"
        :key="category.id"
        class="rounded-full px-5 py-2 text-sm font-semibold transition"
        :class="currentCategory === category.id
          ? 'bg-emerald-500 text-white shadow-sm'
          : 'bg-slate-50 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700'"
        @click="$emit('change', category.id)"
      >
        {{ category.name }}
      </button>
    </div>
  </nav>
</template>

<script setup>
defineProps({
  categories: { type: Array, default: () => [] },
  currentCategory: { type: String, default: 'draw' }
})

defineEmits(['change'])
</script>
