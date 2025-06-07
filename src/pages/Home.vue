<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Header from '@/components/Header.vue'
import Article from '@/components/Article.vue'
import SideBar from '@/components/SideBarHome.vue'
import axiosInstance from '@/axiosInstance'
import Alert from '@/components/Alert.vue'

const articles = ref([])
const role = ref('guest')

const alertState = ref<{ message: string; type: 'success' | 'error' } | null>(null)

onMounted(() => {
  const url = '/api/home'
  axiosInstance.get(url).then(response => {
    articles.value = response.data.articles
    role.value = response.data.role
  }).catch(error => {
    console.error('Błąd podczas pobierania danych:', error)
    alertState.value = { message: 'Wystąpił błąd podczas ładowania artykułów.', type: 'error' }
  })
})

const closeAlert = () => {
  alertState.value = null
}
</script>

<template>
  <Header></Header>
  <div class="flex h-screen bg-bg">
    <SideBar v-if="role !== 'guest'" />
    <div class="flex flex-row gap-7 mt-7">
      <Article v-for="(article, index) in articles" :key="index" :article="article" />
    </div>
  </div>
  <Alert v-if="alertState" :message="alertState.message" :type="alertState.type" :duration="5000" @close="closeAlert" />
</template>