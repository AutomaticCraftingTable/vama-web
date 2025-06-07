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
  <div class="md:flex h-screen w-screen bg-bg">
    <SideBar v-if="role !== 'guest'" />
    <div class="flex-1 flex justify-center">
      <div class="flex flex-col flex-wrap justify-center items-start gap-7 mt-7 px-4 md:flex-row md:px-0 max-w-[1200px]">
        <Article v-for="(article, index) in articles" :key="index" :article="article" />
      </div>
    </div>
  </div>
  <Alert v-if="alertState" :message="alertState.message" :type="alertState.type" :duration="5000" @close="closeAlert" />
</template>