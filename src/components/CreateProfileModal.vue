<script setup lang="ts">
import { ref, watch } from 'vue'
import axiosInstance from '@/axiosInstance'
import RemoveIcon from './Icons/RemoveIcon.vue'
import Alert from './Alert.vue'

const props = defineProps<{ 
  isOpen: boolean 
}>()

const emit = defineEmits<{'close': [], 'profileCreated': []}>()

const username = ref('')
const description = ref('')
const logoFile = ref<File | null>(null)
const alert = ref<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    username.value = ''
    description.value = ''
    logoFile.value = null
    alert.value = null
  }
})

const handleLogoChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    logoFile.value = target.files[0]
  }
}

const handleSubmit = async () => {
  if (!username.value.trim()) {
    alert.value = {
      message: 'Nazwa użytkownika jest wymagana.',
      type: 'error'
    }
    return
  }

  const formData = new FormData()
  formData.append('username', username.value)
  if (description.value.trim()) {
    formData.append('description', description.value)
  }
  if (logoFile.value) {
    formData.append('logo', logoFile.value)
  }

  try {
    await axiosInstance.post('/api/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    alert.value = {
      message: 'Profil został pomyślnie utworzony!',
      type: 'success'
    }
    emit('profileCreated')
    emit('close')
  } catch (error) {
    alert.value = {
      message: 'Wystąpił błąd podczas tworzenia profilu. Spróbuj ponownie.',
      type: 'error'
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
          <label for="username" class="block text-text text-sm font-bold mb-2">Nazwa użytkownika:</label>
          <input type="text" id="username" v-model="username" required class="shadow appearance-none border rounded w-full py-2 px-3 text-text leading-tight focus:outline-none focus:shadow-outline bg-secondary border-secondary"/>
        </div>
        <div class="mb-4">
          <label for="description" class="block text-text text-sm font-bold mb-2">Opis (opcjonalnie):</label>
          <textarea id="description" v-model="description" rows="3" class="shadow appearance-none border rounded w-full py-2 px-3 text-text leading-tight focus:outline-none focus:shadow-outline bg-secondary border-secondary"></textarea>
        </div>
        <div class="mb-6">
          <label for="logo" class="block text-text text-sm font-bold mb-2">Dodaj Logo (opcjonalnie):</label>
          <input type="file" id="logo" @change="handleLogoChange" accept="image/*" class="block w-full text-sm text-text file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-text-primary file:font-semibold file:bg-primary hover:file:bg-primary-hover"/>
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

