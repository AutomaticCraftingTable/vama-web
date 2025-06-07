<script setup lang="ts">
import { ref } from 'vue';
import axiosInstance from '@/axiosInstance';
import Alert from '@/components/Alert.vue';
import { AxiosError } from 'axios';

const props = defineProps<{
  articleId: number;
  role?: string;
}>();

const emit = defineEmits(['comment-added']);
const newComment = ref('');

const alertState = ref<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

const addComment = async () => {
  if (props.role === 'guest') {
    alertState.value = { 
      message: 'Aby dodać komentarz, musisz się zalogować.', 
      type: 'info' 
    };
    return;
  }

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
      alertState.value = { message: 'Komentarz został dodany.', type: 'success' };
    }
  } catch (error) {
    console.error('Błąd podczas dodawania komentarza:', error);
    let errorMessage = 'Wystąpił błąd podczas dodawania komentarza.';
    if (error instanceof AxiosError && error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    alertState.value = { message: errorMessage, type: 'error' };
  }
};

const closeAlert = () => {
  alertState.value = null;
};
</script>

<template>
  <div class="mb-4 flex flex-col items-end">
    <textarea 
      v-model="newComment" 
      placeholder="Dodaj komentarz..." 
      class="text-text border rounded p-2 w-full"
      :disabled="role === 'guest'"
    ></textarea>
    <button 
      @click="addComment" 
      class="mt-2 bg-secondary text-nowrap text-text rounded px-4 py-2 w-min"
      :class="{ 'opacity-50 cursor-not-allowed': role === 'guest' }"
    >
      Dodaj komentarz
    </button>
  </div>
  <Alert 
    v-if="alertState"
    :message="alertState.message"
    :type="alertState.type"
    :duration="5000"
    @close="closeAlert"
  />
</template>
