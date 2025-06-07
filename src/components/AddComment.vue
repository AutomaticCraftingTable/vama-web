<script setup lang="ts">
import { ref } from 'vue';
import axiosInstance from '@/axiosInstance';
import Alert from '@/components/Alert.vue';
import { AxiosError } from 'axios';

const props = defineProps<{
  articleId: number;
}>();

const emit = defineEmits(['comment-added']);
const newComment = ref('');
const role = ref(localStorage.getItem('userRole') || 'guest');

const alertState = ref<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

const addComment = async () => {
  if (role.value === 'guest') {
    alertState.value = { 
      message: 'Do tej akcji, musisz się zalogować', 
      type: 'info' 
    };
    return;
  }

  if (!newComment.value.trim()) return;

  const userData = JSON.parse(localStorage.getItem('user') || '{}');

  const localComment = {
    id: Date.now(),
    causer: {
      nickname: userData.nickname,
      logo: userData.logo,
    },
    content: newComment.value,
    created_at: new Date().toISOString(),
  };

  emit('comment-added', localComment);
  newComment.value = '';

  try {
    const response = await axiosInstance.post(`/api/article/${props.articleId}/comment`, {
      content: localComment.content,
    });

    if (response.status === 200) {
      localComment.id = response.data.id;
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
    ></textarea>
    <button 
      @click="addComment" 
      class="mt-2 bg-secondary text-nowrap text-text rounded px-4 py-2 w-min"
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
