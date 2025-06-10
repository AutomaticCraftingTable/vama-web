<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Header from '@/components/Header.vue'
import Article from '@/components/Article.vue'
import SideBar from '@/components/SideBar.vue'
import axiosInstance from '@/axiosInstance'
import Alert from '@/components/Alert.vue'

const articles = ref([])
const role = ref(localStorage.getItem('userRole') || 'guestt')

const alertState = ref<{ message: string; type: 'success' | 'error' } | null>(null)

onMounted(() => {
  const url = '/api/home'
  axiosInstance.get(url).then(response => {
    articles.value = response.data.articles.sort((a: any, b: any) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }).catch(error => {
    alertState.value = { message: 'Wystąpił błąd podczas ładowania artykułów.', type: 'error' }
  })

  const storedAlert = localStorage.getItem('articleAlert')
  if (storedAlert) {
    alertState.value = JSON.parse(storedAlert)
    localStorage.removeItem('articleAlert')
  }
})

const closeAlert = () => {
  alertState.value = null
}
</script>

<template>
  <Header :role="role"></Header>
  <div class="md:flex min-h-screen max-w-screen bg-bg">
    <SideBar v-if="role !== 'guest'" />
    <div class="flex-1 flex justify-center">
      <div class="flex flex-col flex-wrap justify-center items-start gap-7 mt-7 px-4 md:flex-row md:px-0 max-w-[1200px]">
        <Article v-for="(article, index) in articles" :key="index" :article="article" />
      </div>
    </div>
  </div>
  <Alert v-if="alertState" :message="alertState.message" :type="alertState.type" :duration="5000" @close="closeAlert" />
</template>