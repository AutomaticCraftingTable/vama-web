<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Header from '@/components/Header.vue'
import axiosInstance from '@/axiosInstance'

const router = useRouter()
const route = useRoute()
const email = ref(localStorage.getItem('userEmail') || '')

onMounted(async () => {
  const id = route.params.id
  const hash = route.params.hash

  try {
    await axiosInstance.get(`/api/email/verify/${id}/${hash}`)
    setTimeout(() => {
      router.push('/')
    }, 3000)
  } catch (error) {
    console.error('Błąd podczas weryfikacji emaila:', error)
    router.push('/verify-email-failed')
  }
})
</script>
<template>
  <div class="flex flex-1 justify-center items-center min-h-screen bg-bg">
    <div class="flex flex-col bg-bg gap-12 py-12 px-10">
      <div class="bg-Success rounded-sm p-6">
        <p class="text-text-Success font-bold text-3xl">Weryfikacja zakończona sukcesem!</p>
      </div>
        <div class="font-bold">Twój adres email został pomyślnie zweryfikowany.<br>Za chwilę zostaniesz przekierowany na stronę główną.</div>
    <div>
        <div>Możesz teraz korzystać z VAMA</div>
        <div class="font-bold">{{ email }}</div>
    </div>
    </div>
  </div>
</template>
