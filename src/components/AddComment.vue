<script setup lang="ts">
import { ref } from 'vue';
import axiosInstance from '@/axiosInstance';

const props = defineProps<{
  articleId: number;
}>();

const emit = defineEmits(['comment-added']);
const newComment = ref('');

const addComment = async () => {
  if (!newComment.value.trim()) return;

  try {
    const response = await axiosInstance.post(`/api/article/${props.articleId}/comment`, {
      content: newComment.value,
    });

    if (response.status === 200) {
      const addedComment = {
        id: response.data.id,
        causer: 'Ty',
        content: newComment.value,
        logo: '',
        created_at: new Date().toISOString(),
      };
      emit('comment-added', addedComment);
      newComment.value = '';
    }
  } catch (error) {
    console.error('Błąd podczas dodawania komentarza:', error);
  }
};
</script>

<template>
  <div class="mb-4 flex flex-col items-end">
    <textarea v-model="newComment" placeholder="Dodaj komentarz..." class="text-text border rounded p-2 w-full"></textarea>
    <button @click="addComment" class="mt-2 bg-secondary text-nowrap text-text rounded px-4 py-2 w-min">
      Dodaj komentarz
    </button>
  </div>
</template>
