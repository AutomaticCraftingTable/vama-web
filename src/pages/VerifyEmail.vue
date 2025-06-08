<script setup lang="ts">
import { ref } from 'vue'
import Header from '@/components/Header.vue'
import axiosInstance from '@/axiosInstance'

const role = ref(localStorage.getItem('userRole') || 'guest')
const email = ref(localStorage.getItem('userEmail') || '')

const handleResendVerification = async () => {
  try {
    await axiosInstance.post('/api/email/verification-notification')
    alert('Link weryfikacyjny został wysłany ponownie')
  } catch (error) {
    console.error('Błąd podczas wysyłania linku weryfikacyjnego:', error)
    alert('Wystąpił błąd podczas wysyłania linku weryfikacyjnego')
  }
}
</script>

<template>
  <Header :role="role" />
  <div class="min-h-screen bg-bg flex items-center justify-center">
    <div class="bg-secondary p-8 rounded-lg shadow-lg max-w-md w-full">
      <h1 class="text-2xl font-bold text-text mb-4">Weryfikacja adresu email</h1>
      <p class="text-text-secondary mb-6">
        Dziękujemy za rejestrację! Wysłaliśmy link weryfikacyjny na adres: <span class="font-semibold">{{ email }}</span>
      </p>
      <p class="text-text-secondary mb-6">
        Prosimy o sprawdzenie skrzynki email i kliknięcie w link weryfikacyjny, aby aktywować swoje konto.
      </p>
      <button 
        @click="handleResendVerification"
        class="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary/90 transition-colors"
      >
        Wyślij link ponownie
      </button>
    </div>
  </div>
</template> 