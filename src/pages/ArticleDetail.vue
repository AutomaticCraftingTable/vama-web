<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axiosNewInstance from '@/axiosInstance';
import Header from '@/components/Header.vue';
import SideBar from '@/components/SideBar.vue';
import Comments from '@/components/Comments.vue';
import UserInfo from '@/components/UserInfo.vue';
import Heart from '@/components/Icons/Heart.vue';
import Alert from '@/components/Alert.vue';

const route = useRoute();
const router = useRouter();
const article = ref<any>(null);
const comments = ref<{
  id: number;
  causer:{
    nickname: string;
    logo: string;
    account_id: number;
  };
  content: string;
  created_at: string;
}[]>([]);
const role = ref(localStorage.getItem('userRole') || 'guest');
const currentUser = ref<any>(null);
const isCurrentUser = ref(false);
const isLiked = ref(false);

const alertState = ref<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

onMounted(async () => {
  try {
    const { data } = await axiosNewInstance.get(`/api/article/${route.params.id}`);
    
    if (!data) {
      throw new Error('Nie znaleziono artykułu');
    }

    article.value = data;
    comments.value = (data.comments || []).sort((a: { created_at: string }, b: { created_at: string }) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    currentUser.value = data.profile;
    
    const storedUserData = localStorage.getItem('user');
    const userData = storedUserData ? JSON.parse(storedUserData) : null;
    isCurrentUser.value = Number(userData?.id) === Number(data.author?.account_id);
    
    const userLiked = data.likes?.some((like: any) => Number(like.causer) === Number(userData?.id));
    isLiked.value = userLiked || false;

  } catch (error) {
    alertState.value = { 
      message: 'Wystąpił błąd podczas ładowania artykułu. Spróbuj odświeżyć stronę.', 
      type: 'error' 
    };
    setTimeout(() => {
      router.push('/');
    }, 3000);
  }
});

const likeArticle = async () => {
  const storedUserData = localStorage.getItem('user');
  const userData = storedUserData ? JSON.parse(storedUserData) : null;

  if (!userData || userData.role === 'guest') {
    alertState.value = { 
      message: 'Aby polubić artykuł, musisz się zalogować.', 
      type: 'info' 
    };
    return;
  }


  try {
    if (isLiked.value) {
      await axiosNewInstance.delete(`/api/article/${article.value.id}/like`);
      
      isLiked.value = false;
      if (article.value) {
        article.value.likes = article.value.likes.filter((like: any) => Number(like.causer) !== Number(userData.id));
      }
      alertState.value = { message: 'Usunięto polubienie artykułu', type: 'success' };
    } else {
      const response = await axiosNewInstance.post(`/api/article/${article.value.id}/like`);
      
      isLiked.value = true;
      if (article.value) {
        article.value.likes = article.value.likes || [];
        article.value.likes.push({
          id: response.data.id,
          causer: Number(userData.id),
          article_id: article.value.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
      alertState.value = { message: 'Artykuł został polubiony!', type: 'success' };
    }
  } catch (error: any) {
    
    if (error.response?.status === 409) {
      isLiked.value = true;
      alertState.value = { message: 'Już polubiłeś ten artykuł!', type: 'info' };
    } else {
      alertState.value = { 
        message: `Wystąpił błąd podczas ${isLiked.value ? 'usuwania' : 'dodawania'} polubienia artykułu`, 
        type: 'error' 
      };
    }
  }
  console.groupEnd();
};

const closeAlert = () => {
  alertState.value = null;
};
</script>

<template>
  <Header :role="role" />
  <div class="flex bg-bg h-screen">
    <SideBar v-if="role !== 'guest'" />
    <div class="flex-1 p-5">
      <div v-if="article">
        <UserInfo 
          :user="article.author" 
          :isCurrentUser="isCurrentUser" 
          :showBio="false" 
          :role="role"
          :hideActions="isCurrentUser"
        />
        <div class="font-semibold text-2xl text-text mb-4">{{ article.title }}</div>
        <div class="text-text mb-4">{{ article.content }}</div>
        <div class="flex items-center gap-2 p-2 rounded-sm text-text-dimmed text-nowrap bg-secondary w-min">
          <span>Polubień: {{ article.likes?.length || 0 }}</span>
          <button 
            v-if="!isCurrentUser"
            @click="likeArticle" 
            :class="{isLiked}"
            :disabled="isCurrentUser"
            class="disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div class="flex flex-row gap-2 text-text">
              <Heart :class="isLiked ? 'fill-like' : 'stroke-text fill-none'"/>
            </div>
          </button>
        </div>
        <Comments :comments="article.comments" :article-id="article.id" :role="role" class="mt-3"/>
      </div>
      <div v-else class="flex items-center justify-center h-full">
        <p class="text-text-dimmed">Ładowanie artykułu...</p>
      </div>
    </div>
  </div>
  <Alert 
    v-if="alertState"
    :message="alertState.message"
    :type="alertState.type"
    :duration="5000"
    @close="closeAlert"
  />
</template>