<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
  message: string;
  type: 'success' | 'error';
  duration?: number;
}>();

const emit = defineEmits(['close']);
const isVisible = ref(true);

onMounted(() => {
  if (props.duration) {
    setTimeout(() => {
      isVisible.value = false;
      emit('close');
    }, props.duration);
  }
});

onUnmounted(() => {
  clearTimeout(props.duration);
});
</script>

<template>
  <div
    v-if="isVisible"
    :class="[
      'fixed top-4 right-4 p-4 rounded shadow-lg z-50 transition-opacity duration-300',
      type === 'success' ? 'bg-success text-text-success' : 'bg-danger text-text-primary'
    ]"
  >
    {{ message }}
  </div>
</template>