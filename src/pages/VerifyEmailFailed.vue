<script setup lang="ts">
import { useRouter } from 'vue-router'
import axiosInstance from '@/axiosInstance'

const router = useRouter()

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
  <div class="flex flex-1 justify-center items-center min-h-screen bg-bg">
    <div class="flex flex-col bg-bg gap-12 py-12 px-10">
      <div class="bg-failure rounded-sm p-6">
        <p class="text-text-failure font-bold text-3xl">Oops...</p>
      </div>
        <div class="font-bold">Weryfikacja nie powiodła się...</div>
    <div>
        <div>Wystąpił problem podczas weryfikacji Twojego adresu email.</div>
        <div>Link weryfikacyjny mógł wygasnąć lub być nieprawidłowy.</div>
    </div>
        <button @click="handleResendVerification" class="bg-primary hover:bg-primary-hover text-text-primary font-bold text-xl cursor-pointer py-6 px-14 rounded-sm">
          Wyślij link ponownie
        </button>
    </div>
  </div>
</template>
