<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axiosInstance from '@/axiosInstance'
import Alert from './Alert.vue'
import CreateProfileModal from './CreateProfileModal.vue'
import Eye from './Icons/Eye.vue'

const router = useRouter()
const alertState = ref<{ message: string; type: 'success' | 'error' } | null>(null)
const isCreateProfileModalOpen = ref(false)
const profileData = ref<{ nickname: string | null; description: string | null; logo: string | null; email: string | null } | null>(null)
const currentDescription = ref('')
const currentLogo = ref<string | null>(null)
const oldPassword = ref('')
const newPassword = ref('')
const newEmail = ref('')
const showOldPassword = ref(false)
const showNewPassword = ref(false)

const closeAlert = () => {
  alertState.value = null
}

const fetchProfileData = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('Brak tokenu autoryzacji')
    }

    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`

    const storedUserData = localStorage.getItem('user')
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData)
      
      if (parsedData.profile?.nickname) {
        try {
          const response = await axiosInstance.get('/api/profile')
          if (response.data) {
            profileData.value = {
              nickname: response.data.nickname || null,
              description: response.data.description || null,
              logo: response.data.logo || null,
              email: parsedData.email || null
            }
            
            if (profileData.value && profileData.value.nickname) {
              currentDescription.value = profileData.value.description || ''
              currentLogo.value = profileData.value.logo
            }
          }
        } catch (error) {
          console.error('Błąd podczas pobierania danych profilu:', error)
          profileData.value = null
          currentDescription.value = ''
          currentLogo.value = null
        }
      } else {
        profileData.value = null
      }
    }
  } catch (error) {
    console.error('Błąd podczas pobierania danych profilu:', error)
    if (error instanceof Error && error.message === 'Brak tokenu autoryzacji') {
      router.push('/login')
      return
    }
    alertState.value = {
      message: 'Wystąpił błąd podczas pobierania danych profilu.',
      type: 'error'
    }
  }
}

onMounted(fetchProfileData)

const handleCreateProfile = () => {
  isCreateProfileModalOpen.value = true
}

const handleCloseCreateProfileModal = () => {
  isCreateProfileModalOpen.value = false
}

const handleProfileCreated = () => {
  alertState.value = {
    message: 'Profil został pomyślnie utworzony.',
    type: 'success'
  }
  setTimeout(() => {
    fetchProfileData()
  }, 1000)
}

const handleLogoChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  currentLogo.value = target.value
}

const handleUpdateProfile = async () => {
  const formData = new FormData()
  formData.append('description', currentDescription.value)
  if (currentLogo.value) {
    formData.append('logo', currentLogo.value)
  }

  try {
    await axiosInstance.put('/api/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    alertState.value = { message: 'Profil zaktualizowany pomyślnie!', type: 'success' }
    fetchProfileData()
  } catch (error) {
    alertState.value = { message: 'Wystąpił błąd podczas aktualizacji profilu. Spróbuj ponownie.', type: 'error' }
  }
}

const handleChangePassword = async () => {
  if (!oldPassword.value || !newPassword.value) {
    alertState.value = { message: 'Oba pola hasła są wymagane.', type: 'error' }
    return
  }

  try {
    await axiosInstance.patch('/api/account', {
      old_password: oldPassword.value,
      new_password: newPassword.value
    })
    alertState.value = { message: 'Hasło zmienione pomyślnie!', type: 'success' }
    oldPassword.value = ''
    newPassword.value = ''
  } catch (error) {
    alertState.value = { message: 'Wystąpił błąd podczas zmiany hasła. Sprawdź stare hasło.', type: 'error' }
  }
}

const handleChangeEmail = async () => {
  if (!newEmail.value.trim()) {
    alertState.value = { message: 'Adres e-mail jest wymagany.', type: 'error' }
    return
  }

  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
  if (!emailRegex.test(newEmail.value)) {
    alertState.value = { message: 'Wprowadź poprawny adres e-mail.', type: 'error' }
    return
  }

  try {
    await axiosInstance.patch('/api/account', { email: newEmail.value })
    alertState.value = { message: 'Adres e-mail został zmieniony pomyślnie!', type: 'success' }
  } catch (error) {
    alertState.value = { message: 'Wystąpił błąd podczas zmiany adresu e-mail. Spróbuj ponownie.', type: 'error' }
  }
}

const toggleOldPasswordVisibility = () => {
  showOldPassword.value = !showOldPassword.value
}

const toggleNewPasswordVisibility = () => {
  showNewPassword.value = !showNewPassword.value
}

const handleDeleteProfile = async () => {
  const isConfirmed = confirm('Czy na pewno chcesz usunąć swój profil? Tej operacji nie można cofnąć.')

  if (!isConfirmed) {
    return
  }

  try {
    await axiosInstance.delete('/api/profile')
    localStorage.removeItem('user')
    alertState.value = { message: 'Profil został pomyślnie usunięty.', type: 'success' }
    router.go(0)
  } catch (error) {
    alertState.value = {
      message: 'Wystąpił błąd podczas usuwania profilu. Spróbuj ponownie.',
      type: 'error'
    }
  }
}

const handleDeleteAccount = async () => {
  const isConfirmed = confirm('Czy na pewno chcesz usunąć swoje konto? Tej operacji nie można cofnąć.')

  if (!isConfirmed) {
    return
  }

  try {
    await axiosInstance.delete('/api/account')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('userRole')
    delete axiosInstance.defaults.headers.common['Authorization']
    router.push('/login') 
  } catch (error) {
    alertState.value = {
      message: 'Wystąpił błąd podczas usuwania konta.',
      type: 'error'
    }
  }
}
</script>

<template>
  <div class="flex flex-col p-6 w-full pb-20">
    <template v-if="!profileData || !profileData.nickname">
      <h1 class="text-base font-bold text-text-dimmed mb-6">Profil</h1>
      <div class="mb-8">
        <button 
          @click="handleCreateProfile"
          @keydown.enter="handleCreateProfile"
          tabindex="0"
          aria-label="Utwórz profil"
          class="w-full bg-primary hover:bg-primary-hover text-text-primary font-bold text-lg py-6 rounded-sm cursor-pointer"
        >
          Utwórz Profil
        </button>
      </div>
    </template>

    <template v-else>
      <h1 class="text-base font-bold text-text-dimmed mb-6">Profil</h1>
      <div class="p-6 rounded-lg shadow-xl mb-8 border border-secondary">
        <h2 class="text-xl font-semibold text-text mb-4">Zdjęcie</h2>
        <div class="flex items-center gap-4 mb-6">
          <div class="relative w-24 h-24 rounded-full overflow-hidden border border-secondary">
            <img v-if="profileData.logo" :src="profileData.logo" alt="Profile Logo" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full bg-secondary flex items-center justify-center text-text-dimmed">Brak logo</div>
          </div>
        </div>

        <div class="mb-6">
          <label for="logo-url" class="block text-text text-sm font-bold mb-2">URL zdjęcia:</label>
          <input
            type="url"
            id="logo-url"
            v-model="currentLogo"
            placeholder="Wklej URL zdjęcia"
            class="shadow appearance-none border rounded w-full py-3 px-4 text-text leading-tight focus:outline-none focus:shadow-outline bg-secondary border-secondary"
          />
        </div>

        <h2 class="text-xl font-semibold text-text mb-4">Nick</h2>
        <div class="mb-6">
          <div class="shadow appearance-none border rounded py-3 px-4 text-text leading-tight focus:outline-none focus:shadow-outline bg-secondary border-secondary opacity-50">
            {{profileData.nickname}}
          </div>
        </div>

        <h2 class="text-xl font-semibold text-text mb-4">Opis</h2>
        <div class="mb-6">
          <textarea
            v-model="currentDescription"
            rows="4"
            class="shadow appearance-none border rounded w-full py-3 px-4 text-text leading-tight focus:outline-none focus:shadow-outline bg-secondary border-secondary"
          ></textarea>
        </div>
        <button
          @click="handleUpdateProfile"
          class="bg-primary text-text-primary py-3 px-6 rounded-md hover:bg-primary-hover transition-colors duration-200 font-bold"
        >
          Zapisz zmiany profilu
        </button>
      </div>

      <h1 class="text-base font-bold text-text-dimmed mb-6">Konto</h1>
      <div class="p-6 rounded-lg shadow-xl mb-8 border border-secondary">
        <h2 class="text-xl font-semibold text-text mb-4">Email</h2>
        <div class="mb-6">
          <input
            type="email"
            v-model="newEmail"
            :placeholder="profileData.email || 'Obecny email'"
            class="shadow appearance-none border rounded w-full py-3 px-4 text-text leading-tight focus:outline-none focus:shadow-outline bg-secondary border-secondary"
          />
        </div>
        <button
          @click="handleChangeEmail"
          class="bg-primary text-text-primary py-3 px-6 rounded-md hover:bg-primary-hover transition-colors duration-200 font-bold mb-6"
        >
          Zmień Email
        </button>

        <h2 class="text-xl font-semibold text-text mb-4">Hasło</h2>
        <div class="mb-4 relative">
          <input
            :type="showOldPassword ? 'text' : 'password'"
            v-model="oldPassword"
            class="shadow appearance-none border rounded w-full py-3 px-4 text-text leading-tight focus:outline-none focus:shadow-outline bg-secondary border-secondary pr-10"
            placeholder="Stare hasło"
          />
          <button 
            type="button"
            @click="toggleOldPasswordVisibility"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-text-dimmed hover:text-text"
          >
            <Eye class="h-5 w-5" />
          </button>
        </div>
        <div class="mb-6 relative">
          <input
            :type="showNewPassword ? 'text' : 'password'"
            v-model="newPassword"
            class="shadow appearance-none border rounded w-full py-3 px-4 text-text leading-tight focus:outline-none focus:shadow-outline bg-secondary border-secondary pr-10"
            placeholder="Nowe hasło"
          />
          <button 
            type="button"
            @click="toggleNewPasswordVisibility"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-text-dimmed hover:text-text"
          >
            <Eye class="h-5 w-5" />
          </button>
        </div>
        <button
          @click="handleChangePassword"
          class="bg-primary text-text-primary py-3 px-6 rounded-md hover:bg-primary-hover transition-colors duration-200 font-bold"
        >
          Zmień hasło
        </button>
      </div>
    </template>

    <div class="border-t border-secondary pt-6">
      <h2 class="text-base font-bold text-text-dimmed mb-4">Strefa niebezpieczna</h2>
      <div class="flex gap-2">
        <button v-if="profileData && profileData.nickname" @click="handleDeleteProfile" tabindex="0" class="bg-danger text-text-primary px-5 py-3 rounded-sm font-bold text-lg hover:bg-red-700 cursor-pointer">
          Usuń profil
        </button>
        <button @click="handleDeleteAccount" tabindex="0" class="bg-danger text-text-primary px-5 py-3 rounded-sm font-bold text-lg hover:bg-red-700 cursor-pointer">
          Usuń konto
        </button>
      </div>
    </div>
    <Alert 
      v-if="alertState"
      :message="alertState.message"
      :type="alertState.type"
      :duration="5000"
      @close="closeAlert"
    />

    <CreateProfileModal 
      :is-open="isCreateProfileModalOpen"
      @close="handleCloseCreateProfileModal"
      @profile-created="handleProfileCreated"
    />
  </div>
</template>