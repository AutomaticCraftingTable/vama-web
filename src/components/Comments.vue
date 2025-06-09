<script setup lang="ts">
import { defineProps, ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import AddComment from './AddComment.vue';
import axiosInstance from '@/axiosInstance';
import Flag from "@/components/Icons/Flag.vue";
import Options from "@/components/Icons/Options.vue";
import Alert from './Alert.vue';

const router = useRouter();

const props = defineProps<{
  comments: {
    id: number;
    causer:{
      account_id: number;
      nickname: string;
      logo: string;
    };
    content: string;
    created_at: string;
  }[];
  articleId: number;
  role?: string;
}>();

const localComments = ref([...props.comments]);
const activeMenuId = ref<number | null>(null);
const alert = ref<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);


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

const handleGuestAction = () => {
  alert.value = { 
    message: 'Aby wykonać tę akcję, musisz się zalogować.', 
    type: 'info' 
  };
};

const isCommentOwner = (comment: any) => {
  const storedUserData = localStorage.getItem('user');
  const userData = storedUserData ? JSON.parse(storedUserData) : null;
  return Number(userData?.id) === Number(comment.causer.account_id);
};

const handleReport = async (commentId: number) => {
  if (props.role === 'guest') {
    alert.value = { 
      message: 'Aby zgłosić komentarz, musisz się zalogować.', 
      type: 'info' 
    };
    return;
  }

  const storedUserData = localStorage.getItem('user')
  if (!storedUserData || !JSON.parse(storedUserData).profile?.nickname) {
    alert.value = { 
      message: 'Aby wykonać tę akcję, musisz utworzyć profil.', 
      type: 'info' 
    };
    return;
  }

  try {
    await axiosInstance.post(`/api/comment/${commentId}/report`, {
      content: 'Naruszenie zasad społeczności'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    activeMenuId.value = null;
    alert.value = { message: 'Komentarz został zgłoszony', type: 'success' };
  } catch (error: any) {
    alert.value = { 
      message: error.response?.data?.message || 'Wystąpił błąd podczas zgłaszania komentarza', 
      type: 'error' 
    };
  }
};

const handleDeleteComment = async (commentId: number) => {
  try {
    const storedUserData = localStorage.getItem('user')
    if (!storedUserData) {
      alert.value = { message: 'Musisz być zalogowany, aby usunąć komentarz.', type: 'error' }
      return
    }
    localComments.value = localComments.value.filter(comment => comment.id !== commentId)
    activeMenuId.value = null
    alert.value = { message: 'Komentarz został pomyślnie usunięty!', type: 'success' }
  } catch (error: any) {
    if (error.response?.status === 404 || error.response?.status === 405) {
      localComments.value = localComments.value.filter(comment => comment.id !== commentId)
      alert.value = { message: 'Komentarz został usunięty lokalnie.', type: 'success' }
    } else {
      alert.value = { message: 'Wystąpił błąd podczas usuwania komentarza.', type: 'error' }
    }
  }
}

const closeMenu = () => {
  activeMenuId.value = null;
};

const navigateToProfile = (nickname: string) => {
  router.push(`/profile/${nickname}`);
};

const handleCommentAdded = (newComment: any) => {
  localComments.value.unshift(newComment);
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
    <AddComment 
      :article-id="articleId" 
      @comment-added="handleCommentAdded" 
    />
    <h2 class="mt-6 text-xl font-semibold text-text">Komentarze: {{ localComments.length }}</h2>
    <div v-if="localComments.length === 0" class="text-text-dimmed">Brak komentarzy.</div>
    <div v-for="comment in localComments" :key="comment.id" class="border-b border-gray-300 py-2 flex items-start gap-2 relative">
      <div 
        class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer hover:opacity-80"
        @click="navigateToProfile(comment.causer.nickname)"
      >
        <img :src="comment.causer.logo ?? ''" alt="Author Logo" class="w-10 h-10 rounded-full object-cover" />
      </div>
      <div class="flex-1">
        <div class="flex items-center gap-2">
          <p 
            class="font-bold text-links cursor-pointer hover:underline"
            @click="navigateToProfile(comment.causer.nickname)"
          >@{{ comment.causer.nickname }}</p>
        </div>
        <p class="text-text-dimmed mt-1">{{ comment.content }}</p>
        <span class="text-text-dimmed text-sm">{{ timeAgo(comment.created_at) }}</span>
      </div>
      <div class="relative" v-if="isCommentOwner(comment)">
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
            class="flex items-center gap-2 w-full px-4 py-2 text-danger hover:bg-secondary" 
            @click.stop="handleDeleteComment(comment.id)"
          >
            Usuń komentarz
          </button>
        </div>
      </div>
      <div class="relative" v-else>
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
            <Flag class="fill-none stroke-text size-5" />
            Zgłoś
          </button>
        </div>
      </div>
    </div>
    <Alert v-if="alert" :message="alert.message" :type="alert.type" :duration="3000" @close="alert = null" />
  </div>
</template>
