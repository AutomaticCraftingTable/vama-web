<script setup lang="ts">
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';
import Tag from './Tag.vue';
import Edit from './Icons/Edit.vue';
import RemoveIcon from './Icons/RemoveIcon.vue';

const router = useRouter();

interface Article {
  id: number;
  title: string;
  content: string;
  thumbnail: string | null;
  tags: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  user: {
    id: number;
    name: string;
    avatar: string;
  };
}

const props = defineProps<{
  article: Article;
  isCurrentUser: boolean;
}>();

const emit = defineEmits<{
  (e: 'delete', id: number): void
}>();

const handleClick = () => {
  router.push(`/article-detail/${props.article.id}`);
};

const handleEdit = () => {
  if (!props.article.id) return;
  router.push(`/edit-article/${props.article.id}`);
};

const handleDelete = () => {
  if (!props.article.id) return;
  if (confirm('Czy na pewno chcesz usunąć ten artykuł?')) {
    emit('delete', props.article.id);
  }
};
</script>

<template>
  <div 
    class="bg-bg rounded-md p-5 w-[360px] cursor-pointer hover:bg-secondary transition-colors"
    @click="handleClick"
  >
    <div class="relative">
      <p class="text-text font-bold text-lg mb-3 text-left block">{{ article.title }}</p>
      <div v-if="isCurrentUser" class="absolute top-0 right-0 flex gap-2">
        <button
          class="p-1 rounded hover:bg-bg transition-colors"
          @click.stop="handleEdit"
        >
          <Edit class="w-6 h-6 text-text-secondary" />
        </button>
        <button 
          class="p-1 rounded hover:bg-bg transition-colors"
          @click.stop="handleDelete"
        >
          <RemoveIcon class="w-6 h-6 text-text-secondary" />
        </button>
      </div>
    </div>
    <div class="mb-3 w-full h-[220px] bg-secondary rounded overflow-hidden">
      <img 
        :src="article.thumbnail || '/NoImage.png'" 
        :alt="article.title"
        class="w-full h-full object-cover" 
      />
    </div>
    <div class="flex flex-row items-center gap-2 mt-2 min-h-[40px] w-full">
      <div class="flex flex-wrap gap-2">
        <Tag :tags="article.tags" />
      </div>
    </div>
  </div>
</template> 