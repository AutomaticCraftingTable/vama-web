<script setup lang="ts">
import { defineProps, withDefaults, computed } from 'vue'

const props = withDefaults(defineProps<{
  tags: string | null
}>(), {
  tags: ''
})

const tagArray = computed(() => {
  if (!props.tags) return []
  return props.tags.split(',').filter(tag => tag.trim() !== '').map(tag => `#${tag.trim()}`)
})
</script>

<template>
  <div class="flex flex-wrap gap-2 mt-2">
    <span
      v-for="(tag, index) in tagArray"
      :key="index"
      class="bg-secondary text-text rounded px-3 py-1 text-xs font-bold"
      tabindex="0"
    >
      {{ tag }}
    </span>
  </div>
</template>