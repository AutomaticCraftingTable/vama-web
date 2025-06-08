<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Header from '@/components/Header.vue'
import SideBar from '@/components/SideBar.vue'
import LikedArticleCard from '@/components/LikedArticleCard.vue'
import axiosInstance from '@/axiosInstance'
import Alert from '@/components/Alert.vue'

interface LikedArticle {
  id: number;
  title: string;
  logo?: string;
}

const articles = ref<LikedArticle[]>([]);
const role = ref(localStorage.getItem('userRole') || 'guest');
const alert = ref<{ message: string; type: 'success' | 'error' } | null>(null);

onMounted(async () => {
  try {
    const url = '/api/home/liked';
    const response = await axiosInstance.get(url);
    articles.value = response.data.articles;
  } catch (error) {
    console.error('Błąd podczas pobierania danych:', error);
  }
});

const handleRemoveLiked = async (articleId: number) => {
  try {
    await axiosInstance.delete(`/api/article/${articleId}/like`);
    articles.value = articles.value.filter((article: LikedArticle) => article.id !== articleId);
    alert.value = { message: 'Usunięto z polubionych', type: 'success' };
  } catch (error) {
    console.error('Błąd podczas usuwania polubienia:', error);
    alert.value = { message: 'Wystąpił błąd podczas usuwania polubienia', type: 'error' };
  }
};
</script>

<template>
  <Header :role="role"></Header>
  <div class="flex h-screen bg-bg">
    <SideBar v-if="role !== 'guest'" />
    <div class="flex flex-col gap-4 mt-4 p-4 flex-grow">
      <LikedArticleCard
        v-for="article in articles"
        :key="article.id"
        :article="article"
        @remove-liked="handleRemoveLiked"
      />
      <div v-if="articles.length === 0" class="text-text-dimmed text-center w-full">
        Brak polubionych artykułów.
      </div>
    </div>
  </div>
  <Alert v-if="alert" :message="alert.message" :type="alert.type" :duration="3000" @close="alert = null" />
</template>