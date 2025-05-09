<script setup lang="ts">
defineProps<{ label: string }>()
</script>

<template>
  <span
    class="bg-secondary text-text rounded px-3 py-1 text-xs font-bold"
    tabindex="0"
    :aria-label="`Tag: ${label}`"
  >
    #{{ label }}
  </span>
</template> 