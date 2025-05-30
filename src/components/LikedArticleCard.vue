<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps<{
  article: {
    id: number;
    title: string;
    logo?: string;
  };
}>();

const emit = defineEmits(['remove-liked']);

const handleRemove = (event: MouseEvent) => {
  event.stopPropagation();
  emit('remove-liked', props.article.id);
};
</script>

<template>
  <router-link 
    :to="`/article-detail/${article.id}`" 
    class="block"
  >
    <div class="flex items-center gap-4 p-4 border border-secondary rounded-md shadow-sm w-full mx-auto hover:bg-secondary transition-colors cursor-pointer">
      <div class="flex-shrink-0 w-20 h-20 bg-secondary flex items-center justify-center rounded-sm overflow-hidden">
        <img 
          v-if="article.logo" 
          :src="article.logo" 
          alt="Article Logo" 
          class="w-full h-full object-cover" 
        />
        <svg 
          v-else 
          class="w-10 h-10 text-text-dimmed" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          ></path>
        </svg>
      </div>
      <div class="flex-grow">
        <h3 class="text-lg font-semibold text-text">{{ article.title }}</h3>
      </div>
      <button @click.stop="handleRemove" class="flex-shrink-0 text-text-dimmed hover:text-danger transition-colors p-2 rounded-full hover:bg-bg">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
  </router-link>
</template>