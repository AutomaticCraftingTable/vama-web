<script setup lang="ts">
import { ref, watch } from 'vue'
import axiosInstance from '@/axiosInstance'
import RemoveIcon from './Icons/RemoveIcon.vue'
import Alert from './Alert.vue'
import { useRouter } from 'vue-router'

const props = defineProps<{ 
  isOpen: boolean 
}>()

const emit = defineEmits<{'close': [], 'profileCreated': []}>()

const nickname = ref('')
const description = ref('')
const logoUrl = ref('')
const alert = ref<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
const isSubmitting = ref(false)
const router = useRouter()

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    nickname.value = ''
    description.value = ''
    logoUrl.value = ''
    alert.value = null
  }
})

const handleLogoChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    logoUrl.value = URL.createObjectURL(target.files[0])
  }
}

const handleSubmit = async () => {
  if (isSubmitting.value) return
  isSubmitting.value = true
  
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('Brak tokenu autoryzacji')
    }

    if (!nickname.value.trim()) {
      alert.value = {
        message: 'Nazwa użytkownika jest wymagana.',
        type: 'error'
      }
      return
    }

    const response = await axiosInstance.post('/api/profile', {
      nickname: nickname.value,
      description: description.value,
      logo: logoUrl.value
    }, {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.data?.profile) {
      const storedUserData = localStorage.getItem('user')
      if (storedUserData) {
        const parsedData = JSON.parse(storedUserData)
        parsedData.profile = {
          ...response.data.profile,
          state: 'hasProfile'
        }
        localStorage.setItem('user', JSON.stringify(parsedData))
      }

      alert.value = { 
        message: 'Profil utworzony pomyślnie!', 
        type: 'success' 
      }
      emit('profileCreated')
      emit('close')
    }
  } catch (error: any) {
    if (error.response) {
      switch (error.response.status) {
        case 409:
          try {
            const profileResponse = await axiosInstance.get('/api/profile')
            if (profileResponse.data?.profile) {
              const storedUserData = localStorage.getItem('user')
              if (storedUserData) {
                const parsedData = JSON.parse(storedUserData)
                parsedData.profile = {
                  ...profileResponse.data.profile,
                  state: 'hasProfile'
                }
                localStorage.setItem('user', JSON.stringify(parsedData))
              }
              alert.value = { 
                message: 'Profil już istnieje. Możesz go edytować w ustawieniach.', 
                type: 'info' 
              }
              emit('profileCreated')
              emit('close')
            }
          } catch (profileError) {
            alert.value = { 
              message: 'Wystąpił błąd podczas pobierania danych profilu.', 
              type: 'error' 
            }
          }
          break
        case 401:
          localStorage.removeItem('token')
          router.push('/login')
          break
        case 422:
          alert.value = { 
            message: error.response.data?.message || 'Nieprawidłowe dane wejściowe.', 
            type: 'error' 
          }
          break
        default:
          alert.value = { 
            message: 'Wystąpił błąd podczas tworzenia profilu. Spróbuj ponownie.', 
            type: 'error' 
          }
      }
    } else {
      alert.value = { 
        message: 'Wystąpił błąd podczas tworzenia profilu. Spróbuj ponownie.', 
        type: 'error' 
      }
    }
  } finally {
    isSubmitting.value = false
  }
}

const handleClose = () => {
  emit('close')
}
</script> 
<template>
  <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center z-50">
    <div class="bg-bg p-8 rounded-lg shadow-xl w-full max-w-md mx-4 relative border border-secondary">
      <button @click="handleClose" class="absolute top-4 right-4 text-text-dimmed hover:text-danger transition-colors p-2 rounded-full hover:bg-bg">
        <RemoveIcon class="h-5 w-5" />
      </button>
      <h2 class="text-2xl font-semibold text-text mb-6">Utwórz Profil</h2>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label for="nickname" class="block text-text text-sm font-bold mb-2">Nazwa użytkownika:</label>
          <input type="text" id="nickname" v-model="nickname" required class="shadow appearance-none border rounded w-full py-2 px-3 text-text leading-tight focus:outline-none focus:shadow-outline bg-secondary border-secondary"/>
        </div>
        <div class="mb-4">
          <label for="description" class="block text-text text-sm font-bold mb-2">Opis (opcjonalnie):</label>
          <textarea id="description" v-model="description" rows="3" class="shadow appearance-none border rounded w-full py-2 px-3 text-text leading-tight focus:outline-none focus:shadow-outline bg-secondary border-secondary"></textarea>
        </div>
        <div class="mb-6">
          <label for="logo-url" class="block text-text text-sm font-bold mb-2">URL zdjęcia (opcjonalnie):</label>
          <input 
            type="url" 
            id="logo-url" 
            v-model="logoUrl" 
            placeholder="Wklej URL zdjęcia"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-text leading-tight focus:outline-none focus:shadow-outline bg-secondary border-secondary"
          />
        </div>
        <div class="flex justify-end gap-3">
          <button type="button" @click="handleClose" class="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors duration-200">
            Anuluj
          </button>
          <button type="submit" class="bg-primary text-text-primary py-2 px-4 rounded-md hover:bg-primary-hover transition-colors duration-200">
            Utwórz Profil
          </button>
        </div>
      </form>
    </div>
  </div>
  <Alert 
    v-if="alert"
    :message="alert.message"
    :type="alert.type"
    :duration="3000"
    @close="alert = null"
  />
</template>

