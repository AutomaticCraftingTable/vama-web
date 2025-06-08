<script setup lang="ts">
import { ref } from 'vue'
import axiosInstance from '@/axiosInstance'

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
</template>
