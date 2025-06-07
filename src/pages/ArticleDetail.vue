<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axiosInstance from '@/axiosInstance';
import Header from '@/components/Header.vue';
import SideBar from '@/components/SideBarHome.vue';
import Comments from '@/components/Comments.vue';
import UserInfo from '@/components/UserInfo.vue';
import Heart from '@/components/Icons/Heart.vue';
import Alert from '@/components/Alert.vue';

const route = useRoute();
const article = ref();
const comments = ref<{
  id: number;
  causer:{
    nickname: string;
    logo: string;
  };
  content: string;
  created_at: string;
}[]>([]);
const role = ref('guest');
const currentUser = ref();
const isCurrentUser = ref(false);
const isLiked = ref(false);

const alertState = ref<{ message: string; type: 'success' | 'error' } | null>(null);

onMounted(async () => {
  try {
    const { data } = await axiosInstance.get(`/api/article/${route.params.id}`);
    article.value = data;
    comments.value = data.comments;
    role.value = data.profile.role;
    currentUser.value = data.profile;
    isCurrentUser.value = currentUser.value.account_id === data.author.account_id;
    isLiked.value = data.isLiked;
  } catch (error) {
    console.error('Błąd podczas pobierania danych:', error);
    alertState.value = { message: 'Wystąpił błąd podczas ładowania artykułu.', type: 'error' };
  }
});

const addComment = async (content: string) => {
  try {
    const res = await axiosInstance.post(`/api/article/${article.value.id}/comment`, { content });
    const newComment = {
      id: res.data.id,
      causer: currentUser.value.name,
      content,
      logo: '',
      created_at: new Date().toISOString(),
    };
    comments.value.unshift(newComment);
    alertState.value = { message: 'Komentarz został dodany.', type: 'success' };
  } catch (error) {
    console.error('Błąd podczas dodawania komentarza:', error);
    alertState.value = { message: 'Wystąpił błąd podczas dodawania komentarza.', type: 'error' };
  }
};

const likeArticle = async () => {
  if (!article.value?.id) return;

  try {
    if (isLiked.value) {
      const response = await axiosInstance.delete(`/api/article/${article.value.id}/like`);
      if (response.status === 200) {
        article.value.likes -= 1;
        isLiked.value = false;
        alertState.value = { message: 'Usunięto polubienie.', type: 'success' };
      }
    } else {
      const response = await axiosInstance.post(`/api/article/${article.value.id}/like`);
      if (response.status === 200) {
        article.value.likes += 1;
        isLiked.value = true;
        alertState.value = { message: 'Artykuł polubiony!', type: 'success' };
      }
    }
  } catch (error) {
    console.error('Błąd podczas polubienia/usunięcia polubienia:', error);
    alertState.value = { message: 'Wystąpił błąd podczas zmiany statusu polubienia.', type: 'error' };
  }
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
      <UserInfo :user="article?.author" :isCurrentUser="isCurrentUser" :showBio="false" />
      <div class="font-semibold text-2xl text-text mb-4">{{ article?.title }}</div>
      <div class=" text-text mb-4">{{ article?.content }}</div>
      <button @click="likeArticle" :class="{isLiked}">
        <div class="flex flex-row gap-2 bg-secondary p-2 rounded-sm  text-text">Polub artykuł<Heart :isLiked="isLiked" /></div>
      </button>
      <Comments :comments="comments" :article-id="article?.id" @comment-added="addComment" class="mt-3"/>
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
