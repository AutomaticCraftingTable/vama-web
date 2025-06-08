<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Header from '@/components/Header.vue'
import RegisterForm from '@/components/RegisterForm.vue'
import axiosInstance from '@/axiosInstance'

const router = useRouter()
const route = useRoute()
const role = ref(localStorage.getItem('userRole') || 'guest')

const handleRegistrationSuccess = async () => {
  try {
    await axiosInstance.post('/api/email/verification-notification')
    router.push('/verify-email')
  } catch (error) {
    console.error('Błąd podczas wysyłania prośby o weryfikację:', error)
    router.push('/verify-email-failed')
  }
}

onMounted(() => {
  if (route.query.id && route.query.hash) {
    router.push(`/verify-email-success/${route.query.id}/${route.query.hash}`)
  }
})
</script>
<template>
  <Header :role="role"></Header>
  <RegisterForm @registration-success="handleRegistrationSuccess" />
</template>
