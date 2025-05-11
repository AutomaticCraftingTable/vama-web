<script setup lang="ts">
import { ref, onMounted } from 'vue'
import HeaderFullNotLogged from '@/components/HeaderFullNotLogged.vue'
import HeaderFullLogged from '@/components/HeaderFullLogged.vue'
import Article from '@/components/Article.vue'
import SideBar from '@/components/SideBarHome.vue'
import axios from 'axios'

const isLoggedIn = ref(true)
const articles = ref([])

onMounted(() => {
  const url = 'http://127.0.0.1:3658/m1/829899-809617-default/api/home'
  axios.get(url).then(response => {
    articles.value = response.data.articles
  }).catch(error => {
    console.error('Błąd podczas pobierania artykułów:', error)
  })
})
</script>

<template>
  <component :is="isLoggedIn ? HeaderFullLogged : HeaderFullNotLogged" />

  <div class="flex h-screen">
    <SideBar v-if="isLoggedIn" />
    <div :class="['flex flex-row gap-7 mt-7', isLoggedIn ? 'ml-7' : 'ml-7']">
      <Article v-for="(article, index) in articles" :key="index" :article="article" />
    </div>
  </div>
</template>