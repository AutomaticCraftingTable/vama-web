<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}>();

const emit = defineEmits(['close']);

if (props.duration) {
  setTimeout(() => {
    emit('close');
  }, props.duration);
}
</script>

<template>
  <div 
    class="fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg"
    :class="{
      'bg-red-500 text-white': type === 'error',
      'bg-green-500 text-white': type === 'success',
      'bg-blue-500 text-white': type === 'info'
    }"
  >
    {{ message }}
  </div>
</template>