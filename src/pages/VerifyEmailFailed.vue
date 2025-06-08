<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/components/Header.vue'
import axiosInstance from '@/axiosInstance'

const router = useRouter()
const role = ref(localStorage.getItem('userRole') || 'guest')

const handleResendVerification = async () => {
  try {
    await axiosInstance.post('/api/email/verification-notification')
    alert('Link weryfikacyjny został wysłany ponownie')
  } catch (error) {
    console.error('Błąd podczas wysyłania linku weryfikacyjnego:', error)
    alert('Wystąpił błąd podczas wysyłania linku weryfikacyjnego')
  }
}

const handleGoToHome = () => {
  router.push('/')
}
</script>

<template>
  <Header :role="role" />
  <div class="min-h-screen bg-bg flex items-center justify-center">
    <div class="bg-secondary p-8 rounded-lg shadow-lg max-w-md w-full">
      <h1 class="text-2xl font-bold text-text mb-4">Weryfikacja nie powiodła się</h1>
      <p class="text-text-secondary mb-6">
        Wystąpił problem podczas weryfikacji Twojego adresu email. Link weryfikacyjny mógł wygasnąć lub być nieprawidłowy.
      </p>
      <div class="flex flex-col gap-4">
        <button 
          @click="handleResendVerification"
          class="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary/90 transition-colors"
        >
          Wyślij link ponownie
        </button>
        <button 
          @click="handleGoToHome"
          class="w-full bg-secondary text-text py-2 px-4 rounded hover:bg-secondary/90 transition-colors border border-primary"
        >
          Wróć na stronę główną
        </button>
      </div>
    </div>
  </div>
</template> 