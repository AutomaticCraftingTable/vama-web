<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { useRouter } from 'vue-router';
import ArticleIcon from './Icons/ArticleIcon.vue';
import RemoveIcon from './Icons/RemoveIcon.vue';

const props = defineProps<{
  article: {
    id: number;
    title: string;
    logo?: string;
  };
}>();

const emit = defineEmits(['remove-liked']);
const router = useRouter();

const handleRemove = (event: MouseEvent) => {
  event.stopPropagation();
  emit('remove-liked', props.article.id);
};

const handleClick = () => {
  router.push(`/article-detail/${props.article.id}`);
};
</script>

<template>
  <div 
    @click="handleClick"
    class="flex items-center gap-4 p-4 border border-secondary rounded-md shadow-sm w-full mx-auto hover:bg-secondary transition-colors cursor-pointer"
  >
    <div class="flex-shrink-0 w-20 h-20 bg-secondary flex items-center justify-center rounded-sm overflow-hidden">
      <img 
        v-if="article.logo" 
        :src="article.logo" 
        :alt="article.title" 
        class="w-full h-full object-cover" 
      />
      <ArticleIcon v-else class="w-10 h-10 text-text-dimmed" />
    </div>
    <div class="flex-grow">
      <h3 class="text-lg font-semibold text-text">{{ article.title }}</h3>
    </div>
    <button 
      @click.stop="handleRemove" 
      class="flex-shrink-0 text-text-dimmed hover:text-danger transition-colors p-2 rounded-full hover:bg-bg"
      aria-label="Usuń z polubionych"
    >
      <RemoveIcon class="h-5 w-5" />
    </button>
  </div>
</template>