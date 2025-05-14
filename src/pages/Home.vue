<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Header from '@/components/Header.vue'
import Article from '@/components/Article.vue'
import SideBar from '@/components/SideBarHome.vue'
import axiosInstance from '@/axiosInstance'

const articles = ref([])
const role = ref('guest')

onMounted(() => {
  const url = '/api/home'
  axiosInstance.get(url).then(response => {
    articles.value = response.data.articles
    role.value = response.data.role
  }).catch(error => {
    console.error('Błąd podczas pobierania danych:', error)
  })
})
</script>

<template>
  <Header></Header>
  <div class="flex h-screen">
    <SideBar v-if="role !== 'guest'" />
    <div class="flex flex-row gap-7 mt-7">
      <Article v-for="(article, index) in articles" :key="index" :article="article" />
    </div>
  </div>
</template>