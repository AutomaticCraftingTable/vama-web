<script setup lang="ts">
import Header from "@/components/Header.vue"
import SideBar from "@/components/SideBarHome.vue";
import UserInfo from '@/components/UserInfo.vue';
import ArticleCard from '@/components/ArticleCard.vue';
import { onMounted, ref } from "vue";
import axiosInstance from "@/axiosInstance";

const role = ref('guest')
const user = ref({
  logo: '',
  nickname: '',
  followers: 0,
  bio: '',
  link: ''
})
const articles = ref([])

onMounted(async () => {
  try {
    const { data } = await axiosInstance.get('/api/profile')
    user.value = {
      logo: data.profile.logo,
      nickname: data.profile.nickname,
      followers: data.profile.followers,
      bio: data.profile.description,
      link: data.profile.link
    }
    articles.value = data.articles
    role.value = data.role
  } catch (error) {
    console.error('Błąd podczas pobierania danych:', error)
  }
})
</script>

<template>
  <Header />
  <div class="flex h-screen">
    <SideBar v-if="role !== 'guest'" />
    <div class="flex flex-col w-full gap-4 mt-4">
      <UserInfo :user="user" />
      <ArticleCard
        v-for="(article, idx) in articles"
        :key="idx"
        :article="article"
      />
    </div>
  </div>
</template>
