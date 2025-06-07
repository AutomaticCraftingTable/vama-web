<script setup lang="ts">
import { defineProps, ref, onMounted, onUnmounted } from 'vue';
import AddComment from './AddComment.vue';
import axiosInstance from '@/axiosInstance';
import Flag from "@/components/Icons/Flag.vue";
import Options from "@/components/Icons/Options.vue";
import Alert from './Alert.vue';

const props = defineProps<{
  comments: {
    id: number;
    causer: string;
    content: string;
    logo: string;
    created_at: string;
  }[];
  articleId: number;
}>();

const activeMenuId = ref<number | null>(null);
const alert = ref<{ message: string; type: 'success' | 'error' } | null>(null);

const timeAgo = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) return `Utworz. ${interval} lata temu`;

  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return `Utworz. ${interval} miesiące temu`;

  interval = Math.floor(seconds / 86400);
  if (interval > 1) return `Utworz. ${interval} dni temu`;

  interval = Math.floor(seconds / 3600);
  if (interval > 1) return `Utworz. ${interval} godziny temu`;

  interval = Math.floor(seconds / 60);
  if (interval > 1) return `Utworz. ${interval} minuty temu`;

  return `Utworz. ${seconds} sekund temu`;
};

const toggleMenu = (commentId: number) => {
  activeMenuId.value = activeMenuId.value === commentId ? null : commentId;
};

const handleReport = async (commentId: number) => {
  try {
    await axiosInstance.post(`/api/comment/${commentId}/report`);
    activeMenuId.value = null;
    alert.value = { message: 'Komentarz został zgłoszony', type: 'success' };
  } catch (error) {
    console.error('Błąd podczas zgłaszania komentarza:', error);
    alert.value = { message: 'Wystąpił błąd podczas zgłaszania komentarza', type: 'error' };
  }
};

const closeMenu = () => {
  activeMenuId.value = null;
};

onMounted(() => {
  document.addEventListener('click', closeMenu);
});

onUnmounted(() => {
  document.removeEventListener('click', closeMenu);
});
</script>

<template>
  <div class="comments">
    <AddComment :article-id="articleId" />
    <h2 class="mt-6 text-xl font-semibold text-text">Komentarze: {{ comments.length }}</h2>
    <div v-if="comments.length === 0" class="text-gray-500">Brak komentarzy.</div>
    <div v-for="comment in comments" :key="comment.id" class="border-b border-gray-300 py-2 flex items-start gap-2 relative">
      <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
        <img :src="comment.causer.logo ?? ''" alt="Author Logo" class="w-10 h-10 rounded-full object-cover" />
      </div>
      <div class="flex-1">
        <p class="font-bold text-links">@{{ comment.causer.nickname }}</p>
        <p class="text-text-dimmed">{{ comment.content }}</p>
        <div class="flex items-center text-text-dimmed text-sm">
          <span>{{ timeAgo(comment.created_at) }}</span>
        </div>
      </div>
      <div class="relative">
        <button 
          @click.stop="toggleMenu(comment.id)" 
          class="p-2 hover:bg-secondary rounded-full"
        >
          <Options class="fill-none stroke-text size-6" />
        </button>
        <div 
          v-if="activeMenuId === comment.id" 
          class="absolute right-0 mt-2 min-w-40 bg-bg border border-secondary rounded shadow z-10 text-nowrap"
        >
          <button 
            class="flex items-center gap-2 w-full px-4 py-2 text-text hover:bg-secondary" 
            @click.stop="handleReport(comment.id)"
          >
            <Flag class="fill-none stroke-text size-6"/>
            Zgłoś komentarz
          </button>
        </div>
      </div>
    </div>
    <Alert v-if="alert" :message="alert.message" :type="alert.type" :duration="3000" @close="alert = null" />
  </div>
</template>
