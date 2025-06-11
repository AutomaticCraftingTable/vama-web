<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Header from '@/components/Header.vue'
import Article from '@/components/Article.vue'
import SideBar from '@/components/SideBar.vue'
import axiosInstance from '@/axiosInstance'
import Alert from '@/components/Alert.vue'

const route = useRoute()
const router = useRouter()
const articles = ref([])
const role = ref(localStorage.getItem('userRole') || 'guest')
const alertState = ref<{ message: string; type: 'success' | 'error' } | null>(null)
const isLoading = ref(true)

onMounted(async () => {
  try {
    const query = route.query.q as string
    if (!query) {
      router.push('/')
      return
    }

    const token = localStorage.getItem('token')
    if (token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }

    const response = await axiosInstance.post('/api/home/search', 
      { query },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    )

    if (!response.data || !response.data.articles) {
      throw new Error('Nieprawidłowa odpowiedź z serwera')
    }

    articles.value = response.data.articles.sort((a: any, b: any) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
  } catch (error: any) {
    if (error.response?.status === 401) {
      alertState.value = { 
        message: 'Sesja wygasła. Zaloguj się ponownie.', 
        type: 'error' 
      }
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } else if (error.response?.status === 403) {
      alertState.value = { 
        message: 'Brak uprawnień do wyszukiwania.', 
        type: 'error' 
      }
    } else {
      alertState.value = { 
        message: 'Wystąpił błąd podczas wyszukiwania artykułów. Spróbuj ponownie później.', 
        type: 'error' 
      }
    }
  } finally {
    isLoading.value = false
  }
})

const closeAlert = () => {
  alertState.value = null
}
</script>

<template>
  <Header :role="role" :search-query="route.query.q as string" />
  <div class="md:flex min-h-screen max-w-screen bg-bg">
    <SideBar v-if="role !== 'guest'" />
    <div class="flex-1 flex justify-center">
      <div class="flex flex-col flex-wrap justify-center items-start gap-7 mt-7 px-4 md:flex-row md:px-0 max-w-[1200px]">
        <template v-if="isLoading">
          <div class="w-full text-center text-text-dimmed">
            Wyszukiwanie...
          </div>
        </template>
        <template v-else-if="articles.length === 0">
          <div class="w-full text-center text-text-dimmed">
            Nie znaleziono artykułów pasujących do wyszukiwanej frazy.
          </div>
        </template>
        <template v-else>
          <Article v-for="(article, index) in articles" :key="index" :article="article" />
        </template>
      </div>
    </div>
  </div>
  <Alert v-if="alertState" :message="alertState.message" :type="alertState.type" :duration="5000" @close="closeAlert" />
</template> 