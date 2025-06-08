<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Header from '@/components/Header.vue'
import axiosInstance from '@/axiosInstance'

const router = useRouter()
const route = useRoute()
const role = ref(localStorage.getItem('userRole') || 'guest')

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
  <Header :role="role" />
  <div class="min-h-screen bg-bg flex items-center justify-center">
    <div class="bg-secondary p-8 rounded-lg shadow-lg max-w-md w-full">
      <h1 class="text-2xl font-bold text-text mb-4">Weryfikacja zakończona sukcesem!</h1>
      <p class="text-text-secondary mb-6">
        Twój adres email został pomyślnie zweryfikowany. Za chwilę zostaniesz przekierowany na stronę główną.
      </p>
      <div class="flex justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    </div>
  </div>
</template> 