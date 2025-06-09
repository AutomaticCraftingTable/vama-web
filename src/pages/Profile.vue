<script setup lang="ts">
import { ref, onMounted} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axiosInstance from '@/axiosInstance';
import Header from '@/components/Header.vue';
import SideBar from '@/components/SideBar.vue';
import UserInfo from '@/components/UserInfo.vue';
import ArticleCard from '@/components/ArticleCard.vue';
import Alert from '@/components/Alert.vue';

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

const route = useRoute();
const router = useRouter();
const profile = ref<any>(null);
const role = ref(localStorage.getItem('userRole') || 'guest');
const alertState = ref<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
const articles = ref<Article[]>([]);
const isCurrentUser = ref(false);

onMounted(async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userData);
    const profileId = route.params.id;

    if (!profileId || profileId === user.id.toString()) {
      const { data } = await axiosInstance.get('/api/profile');
      profile.value = data;
      articles.value = data.articles;
      isCurrentUser.value = true;
    } else {
      const { data } = await axiosInstance.get(`/api/profile/${profileId}`);
      profile.value = data;
      articles.value = data.articles;
      isCurrentUser.value = false;
    }
  } catch (error: any) {
    console.error('Błąd podczas pobierania danych:', error);
    if (error.response?.status === 404) {
      alertState.value = {
        message: 'Nie znaleziono profilu użytkownika',
        type: 'error'
      };
    } else {
      alertState.value = {
        message: 'Wystąpił błąd podczas pobierania danych profilu',
        type: 'error'
      };
    }
  }
});

const closeAlert = () => {
  alertState.value = null;
};

const handleDeleteArticle = async (articleId: number) => {
  try {
    await axiosInstance.delete(`/api/article/${articleId}`);
    articles.value = articles.value.filter(article => article.id !== articleId);
    alertState.value = { message: 'Artykuł został pomyślnie usunięty!', type: 'success' };
  } catch (error: any) {
    alertState.value = { 
      message: error.response?.data?.message || 'Wystąpił błąd podczas usuwania artykułu', 
      type: 'error' 
    };
  }
};
</script>
<template>
  <Header :role="role" />
  <div class="flex bg-bg h-screen">
    <SideBar v-if="role !== 'guest'" />
    <div class="flex-1 p-5">
      <div v-if="profile">
        <UserInfo 
          :user="profile" 
          :isCurrentUser="isCurrentUser"
          :showBio="true"
          :role="role"
        />
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ArticleCard
            v-for="article in articles"
            :key="article.id"
            :article="article"
            :is-current-user="isCurrentUser"
            @delete="handleDeleteArticle"
          />
        </div>
      </div>
      <div v-else class="flex items-center justify-center h-full">
        <p class="text-text-dimmed">Ładowanie profilu...</p>
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
