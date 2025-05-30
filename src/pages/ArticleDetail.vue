<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axiosInstance from '@/axiosInstance';
import Header from '@/components/Header.vue';
import SideBar from '@/components/SideBarHome.vue';
import Comments from '@/components/Comments.vue';
import UserInfo from '@/components/UserInfo.vue';
import Heart from '@/components/Icons/Heart.vue';

const route = useRoute();
const article = ref();
const comments = ref<{
  id: number;
  causer: string;
  content: string;
  logo: string;
  created_at: string;
}[]>([]);
const role = ref('guest');
const currentUser = ref();
const isCurrentUser = ref(false);
const isLiked = ref(false);

onMounted(async () => {
  const { data } = await axiosInstance.get(`/api/article/${route.params.id}`);
  article.value = data;
  comments.value = data.comments;
  role.value = data.profile.role;
  currentUser.value = data.profile;
  isCurrentUser.value = currentUser.value.account_id === data.author.account_id;
  isLiked.value = data.isLiked;
});

const addComment = async (content: string) => {
  const res = await axiosInstance.post(`/api/article/${article.value.id}/comment`, { content });
  const newComment = {
    id: res.data.id,
    causer: currentUser.value.name,
    content,
    logo: '',
    created_at: new Date().toISOString(),
  };
  comments.value.unshift(newComment);
};

const likeArticle = async () => {
  if (isLiked.value) {

    try {
      const response = await axiosInstance.delete(`/api/article/${article.value.id}/like`);
      if (response.status === 200) {
        article.value.likes -= 1;
        isLiked.value = false;
      }
    } catch (error) {
      console.error('Błąd podczas usuwania polubienia:', error);
    }
  } else {
   
    try {
      const response = await axiosInstance.post(`/api/article/${article.value.id}/like`);
      if (response.status === 200) {
        article.value.likes += 1;
        isLiked.value = true;
      }
    } catch (error) {
      console.error('Błąd podczas polubienia artykułu:', error);
    }
  }
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
</template>
