<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Header from '@/components/Header.vue'
import RegisterForm from '@/components/RegisterForm.vue'
import axiosInstance from '@/axiosInstance'
import Alert from '@/components/Alert.vue'

const router = useRouter()
const route = useRoute()
const role = ref(localStorage.getItem('userRole') || 'guest')
const alertState = ref<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

const verifyEmail = async (id: string, hash: string) => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      alertState.value = { 
        message: 'Nie znaleziono tokenu autoryzacji. Zaloguj się ponownie.', 
        type: 'error' 
      }
      setTimeout(() => {
        router.push('/login')
      }, 2000)
      return
    }

    await axiosInstance.post(`/api/email/verify/${id}/${hash}`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    alertState.value = { 
      message: 'Email został pomyślnie zweryfikowany!', 
      type: 'success' 
    }
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (error: any) {
    console.error('Błąd podczas weryfikacji email:', error)
    let errorMessage = 'Wystąpił błąd podczas weryfikacji email.'
    
    if (error.response?.status === 401) {
      errorMessage = 'Sesja wygasła. Zaloguj się ponownie.'
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    }
    
    alertState.value = { 
      message: errorMessage, 
      type: 'error' 
    }
    setTimeout(() => {
      router.push('/verify-email-failed')
    }, 2000)
  }
}

const closeAlert = () => {
  alertState.value = null
}

onMounted(async () => {
  if (route.query.id && route.query.hash) {
    await verifyEmail(route.query.id as string, route.query.hash as string)
  }
})
</script>
<template>
  <Header :role="role"></Header>
  <RegisterForm />
  <Alert 
    v-if="alertState"
    :message="alertState.message"
    :type="alertState.type"
    :duration="3000"
    @close="closeAlert"
  />
</template>

