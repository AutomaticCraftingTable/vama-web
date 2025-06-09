<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axiosInstance from '@/axiosInstance'
import Alert from '@/components/Alert.vue'

const email = ref(localStorage.getItem('userEmail') || '')
const alertState = ref<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

onMounted(() => {
  const token = localStorage.getItem('token')
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }
})

const handleResendVerification = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      alertState.value = { 
        message: 'Nie znaleziono tokenu autoryzacji. Zaloguj się ponownie.', 
        type: 'error' 
      }
      return
    }

    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
    const response = await axiosInstance.post('/api/email/verification-notification')
    
    if (response.status === 200) {
      alertState.value = { 
        message: 'Link weryfikacyjny został wysłany ponownie. Sprawdź swoją skrzynkę email.', 
        type: 'success' 
      }
    }
  } catch (error: any) {
    let errorMessage = 'Wystąpił błąd podczas wysyłania linku weryfikacyjnego'
    
    if (error.response?.status === 401) {
      errorMessage = 'Sesja wygasła. Zaloguj się ponownie.'
      localStorage.removeItem('token')
      delete axiosInstance.defaults.headers.common['Authorization']
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    }
    
    alertState.value = { 
      message: errorMessage, 
      type: 'error' 
    }
  }
}

const closeAlert = () => {
  alertState.value = null
}
</script>

<template>
  <div class="flex flex-1 justify-center items-center min-h-screen bg-bg">
    <div class="flex flex-col bg-bg text-text gap-12 py-12 px-10">
      <div>
        <p class="font-bold text-3xl">Weryfikacja adresu email</p>
      </div>
      <div>
        <div>Już prawie koniec! Został ostatni krok</div>
        <div class="font-bold text-2xl">{{ email }}</div>
      </div>
      <div>
        <div>Prosimy o sprawdzenie skrzynki email i kliknięcie w link weryfikacyjny, aby aktywować swoje konto.</div>
      </div>
      <button @click="handleResendVerification" class="bg-primary hover:bg-primary-hover text-text-primary font-bold text-xl cursor-pointer py-6 px-14 rounded-sm">
        Wyślij link ponownie
      </button>
    </div>
  </div>
  <Alert 
    v-if="alertState"
    :message="alertState.message"
    :type="alertState.type"
    :duration="3000"
    @close="closeAlert"
  />
</template>
