<template>
  <button class="w-full py-3 bg-black text-white font-bold rounded-md"
          aria-label="Opublikuj"
          tabindex="0"
          @click="handlePublish">
    Opublikuj
  </button>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue';

const emit = defineEmits(['publish']);

const handlePublish = () => {
  emit('publish');
};
</script>