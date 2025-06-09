<script setup lang="ts">
import { ref, watch } from 'vue'
import axiosInstance from '@/axiosInstance'
import RemoveIcon from './Icons/RemoveIcon.vue'
import Alert from './Alert.vue'

const props = defineProps<{ 
  isOpen: boolean 
}>()

const emit = defineEmits<{'close': [], 'profileCreated': []}>()

const nickname = ref('')
const description = ref('')
const logoUrl = ref('')
const alert = ref<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

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
  if (!nickname.value.trim()) {
    alert.value = {
      message: 'Nazwa użytkownika jest wymagana.',
      type: 'error'
    }
    return
  }

  const token = localStorage.getItem('token')
  if (!token) {
    alert.value = {
      message: 'Nie jesteś zalogowany. Zaloguj się ponownie.',
      type: 'error'
    }
    emit('close')
    return
  }

  const storedUserData = localStorage.getItem('user')
  if (storedUserData) {
    const parsedData = JSON.parse(storedUserData)
    if (parsedData.profile) {
      alert.value = {
        message: 'Profil dla tego użytkownika już istnieje. Możesz go edytować w ustawieniach.',
        type: 'error'
      }
      emit('close')
      return
    }
  }

  const formData = new FormData()
  formData.append('nickname', nickname.value)
  if (description.value.trim()) {
    formData.append('description', description.value)
  }
  if (logoUrl.value.trim()) {
    formData.append('logo', logoUrl.value)
  }

  try {
    const response = await axiosInstance.post('/api/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      },
    })
    
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData)
      parsedData.profile = {
        nickname: nickname.value,
        description: description.value,
        logo: response.data.logo || null
      }
      localStorage.setItem('user', JSON.stringify(parsedData))
    }

    alert.value = {
      message: 'Profil został pomyślnie utworzony!',
      type: 'success'
    }

    emit('close')
    setTimeout(() => {
      emit('profileCreated')
    }, 500)
  } catch (error: any) {
    console.error('Błąd podczas tworzenia profilu:', error);
    
    if (error.response?.status === 401) {
      alert.value = {
        message: 'Twoja sesja wygasła. Zaloguj się ponownie.',
        type: 'error'
      }
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    } else if (error.response?.status === 409) {
      if (storedUserData) {
        const parsedData = JSON.parse(storedUserData)
        parsedData.profile = {
          ...parsedData.profile,
          nickname: nickname.value,
          description: description.value
        }
        localStorage.setItem('user', JSON.stringify(parsedData))
      }

      alert.value = {
        message: 'Profil dla tego użytkownika już istnieje. Możesz go edytować w ustawieniach.',
        type: 'error'
      }
      emit('close')
    } else if (error.response?.data?.message) {
      alert.value = {
        message: error.response.data.message,
        type: 'error'
      }
    } else {
      alert.value = {
        message: 'Wystąpił błąd podczas tworzenia profilu. Spróbuj ponownie.',
        type: 'error'
      }
    }
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

