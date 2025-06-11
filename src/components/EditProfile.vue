<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axiosInstance from '@/axiosInstance'
import Alert from './Alert.vue'
import CreateProfileModal from './CreateProfileModal.vue'
import Eye from './Icons/Eye.vue'

const router = useRouter()
const alertState = ref<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
const isCreateProfileModalOpen = ref(false)
const profileData = ref<{ nickname: string | null; description: string | null; logo: string | null; email: string | null } | null>(null)
const currentDescription = ref('')
const currentLogo = ref<string | null>(null)
const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const newEmail = ref('')
const showOldPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(true)
const isUpdating = ref(false)

const closeAlert = () => {
  alertState.value = null
}

const initializeData = () => {
  const storedUserData = localStorage.getItem('user')
  if (storedUserData) {
    try {
      const parsedData = JSON.parse(storedUserData)
      profileData.value = {
        nickname: parsedData.profile?.nickname || null,
        description: parsedData.profile?.description || null,
        logo: parsedData.profile?.logo || null,
        email: parsedData.email || null
      }
      currentDescription.value = profileData.value.description || ''
      currentLogo.value = profileData.value.logo || null
    } catch (error) {
      profileData.value = null
      currentDescription.value = ''
      currentLogo.value = null
    }
  }
}

onMounted(() => {
  initializeData()
  fetchProfileData()
})

const fetchProfileData = async () => {
  if (isLoading.value) return
  isLoading.value = true
  
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    const response = await axiosInstance.get('/api/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    if (response.data?.profile) {
      profileData.value = {
        ...response.data.profile,
        email: profileData.value?.email || null
      }
      currentDescription.value = response.data.profile.description || ''
      currentLogo.value = response.data.profile.logo || null
      
      const storedUserData = localStorage.getItem('user')
      if (storedUserData) {
        const parsedData = JSON.parse(storedUserData)
        parsedData.profile = response.data.profile
        localStorage.setItem('user', JSON.stringify(parsedData))
      }
    } else {
      alertState.value = { 
        message: 'Nie udało się pobrać danych profilu.', 
        type: 'error' 
      }
    }
  } catch (error: any) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      router.push('/login')
    } else if (error.response?.status === 404) {
      alertState.value = { 
        message: 'Nie posiadasz jeszcze profilu utwórz go!', 
        type: 'info' 
      }
    } else {
      alertState.value = { 
        message: 'Wystąpił błąd podczas pobierania danych profilu.', 
        type: 'error' 
      }
    }
  } finally {
    isLoading.value = false
  }
}

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

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/Avatar.png'
}

const handleLogoChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.value) {
    try {
      const url = new URL(target.value)
      const dozwoloneDomeny = [
        'i.imgur.com',
        'res.cloudinary.com',
        's3.amazonaws.com',
        'storage.googleapis.com'
      ]

      if (!dozwoloneDomeny.includes(url.hostname)) {
        alertState.value = { 
          message: 'Niedozwolona domena obrazu. Dozwolone domeny: i.imgur.com, res.cloudinary.com, s3.amazonaws.com, storage.googleapis.com', 
          type: 'error' 
        }
        currentLogo.value = ''
        return
      }

      if (url.hostname === 'i.imgur.com') {
        const imgurId = target.value.split('/').pop()?.split('.')[0]
        if (imgurId) {
          currentLogo.value = `https://i.imgur.com/${imgurId}.jpeg?${Date.now()}`
        } else {
          currentLogo.value = target.value
        }
      } else {
        currentLogo.value = target.value
      }
    } catch (error) {
      alertState.value = { 
        message: 'Nieprawidłowy URL obrazu.', 
        type: 'error' 
      }
      currentLogo.value = ''
    }
  }
}

const handleUpdateProfile = async () => {
  if (isUpdating.value) return
  isUpdating.value = true
  
  let dataToSend: { description?: string; logo?: string } = {}
  
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('Brak tokenu autoryzacji')
    }

    const maxDlugoscOpisu = 1000
    const dozwoloneDomeny = [
      'i.imgur.com',
      'res.cloudinary.com',
      's3.amazonaws.com',
      'storage.googleapis.com'
    ]

    const czyCosSieZmienilo = 
      currentDescription.value !== profileData.value?.description ||
      currentLogo.value !== profileData.value?.logo

    if (!czyCosSieZmienilo) {
      alertState.value = { 
        message: 'Nie wprowadzono żadnych zmian.', 
        type: 'info' 
      }
      return
    }

    if (currentDescription.value) {
      if (currentDescription.value.length > maxDlugoscOpisu) {
        alertState.value = { 
          message: `Opis nie może przekraczać ${maxDlugoscOpisu} znaków.`, 
          type: 'error' 
        }
        return
      }
    }

    if (currentLogo.value) {
      try {
        const url = new URL(currentLogo.value)
        if (!dozwoloneDomeny.includes(url.hostname)) {
          alertState.value = { 
            message: 'Niedozwolona domena obrazu. Dozwolone domeny: i.imgur.com, res.cloudinary.com, s3.amazonaws.com, storage.googleapis.com', 
            type: 'error' 
          }
          return
        }

        const urlRegex = /^https:\/\/(i\.imgur\.com|res\.cloudinary\.com|s3\.amazonaws\.com|storage\.googleapis\.com)\/.*$/
        if (!urlRegex.test(currentLogo.value)) {
          alertState.value = { 
            message: 'Nieprawidłowy format URL obrazu.', 
            type: 'error' 
          }
          return
        }

        if (url.hostname === 'i.imgur.com') {
          const imgurId = currentLogo.value.split('/').pop()?.split('.')[0]
          if (!imgurId) {
            alertState.value = { 
              message: 'Nieprawidłowy format URL obrazu z Imgur.', 
              type: 'error' 
            }
            return
          }
          dataToSend.logo = `https://i.imgur.com/${imgurId}.jpeg`
        } else {
          dataToSend.logo = currentLogo.value
        }

      } catch (error) {
        alertState.value = { 
          message: 'Nieprawidłowy URL obrazu.', 
          type: 'error' 
        }
        return
      }
    }

    if (currentDescription.value !== profileData.value?.description) {
      dataToSend.description = currentDescription.value || ''
    }

    if (Object.keys(dataToSend).length === 0) {
      alertState.value = { 
        message: 'Nie wprowadzono żadnych zmian.', 
        type: 'info' 
      }
      return
    }

    const response = await axiosInstance.put('/api/profile', dataToSend, {
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
          ...parsedData.profile,
          description: response.data.profile?.description,
          logo: response.data.profile?.logo
        }
        localStorage.setItem('user', JSON.stringify(parsedData))
      }

      alertState.value = { message: 'Profil zaktualizowany pomyślnie!', type: 'success' }
      fetchProfileData()
    }
  } catch (error: any) {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          alertState.value = { 
            message: 'Brak autoryzacji. Zaloguj się ponownie.', 
            type: 'error' 
          }
          localStorage.removeItem('token')
          router.push('/login')
          break
        case 403:
          alertState.value = { 
            message: 'Brak uprawnień do aktualizacji profilu.', 
            type: 'error' 
          }
          break
        case 404:
          alertState.value = { 
            message: 'Profil nie istnieje.', 
            type: 'error' 
          }
          break
        case 422:
          alertState.value = { 
            message: error.response.data?.message || 'Nieprawidłowe dane wejściowe.', 
            type: 'error' 
          }
          break
        default:
          alertState.value = { 
            message: 'Wystąpił błąd podczas aktualizacji profilu. Spróbuj ponownie.', 
            type: 'error' 
          }
      }
    } else {
      alertState.value = { 
        message: 'Wystąpił błąd podczas aktualizacji profilu. Spróbuj ponownie.', 
        type: 'error' 
      }
    }
  } finally {
    isUpdating.value = false
  }
}

const handleChangePassword = async () => {
  if (!oldPassword.value || !newPassword.value || !confirmPassword.value) {
    alertState.value = { message: 'Wszystkie pola hasła są wymagane.', type: 'error' }
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    alertState.value = { message: 'Nowe hasła nie są identyczne.', type: 'error' }
    return
  }

  const hasUpperCase = /[A-Z]/.test(newPassword.value)
  const hasLowerCase = /[a-z]/.test(newPassword.value)
  const hasNumbers = /\d/.test(newPassword.value)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword.value)
  const isLongEnough = newPassword.value.length >= 8

  if (!isLongEnough || !hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
    alertState.value = { 
      message: 'Hasło musi zawierać co najmniej 8 znaków, jedną wielką literę, jedną małą literę, jedną cyfrę i jeden znak specjalny (!@#$%^&*(),.?":{}|<>)', 
      type: 'error' 
    }
    return
  }

  if (oldPassword.value === newPassword.value) {
    alertState.value = { message: 'Nowe hasło nie może być takie samo jak stare hasło.', type: 'error' }
    return
  }

  try {
    const token = localStorage.getItem('token')
    if (!token) {
      alertState.value = { message: 'Brak tokenu autoryzacji. Zaloguj się ponownie.', type: 'error' }
      router.push('/login')
      return
    }

    const requestData = {
      current_password: oldPassword.value,
      new_password: newPassword.value,
      new_password_confirmation: confirmPassword.value
    }

    await axiosInstance.patch('/api/account', requestData, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    alertState.value = { message: 'Hasło zmienione pomyślnie!', type: 'success' }
    oldPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 422) {
        const errorMessage = error.response.data?.message || 'Wprowadzone dane są nieprawidłowe. Sprawdź wymagania dotyczące hasła.'
        alertState.value = { message: errorMessage, type: 'error' }
      } else if (error.response.status === 401) {
        alertState.value = { message: 'Brak autoryzacji. Zaloguj się ponownie.', type: 'error' }
        localStorage.removeItem('token')
        router.push('/login')
      } else if (error.response.status === 403) {
        alertState.value = { message: 'Brak uprawnień do zmiany hasła.', type: 'error' }
      } else {
        alertState.value = { 
          message: `Wystąpił błąd podczas zmiany hasła (${error.response.status}). Spróbuj ponownie.`, 
          type: 'error' 
        }
      }
    } else {
      alertState.value = { message: 'Wystąpił błąd podczas zmiany hasła. Brak odpowiedzi serwera.', type: 'error' }
    }
  }
}

const toggleOldPasswordVisibility = () => {
  showOldPassword.value = !showOldPassword.value
}

const toggleNewPasswordVisibility = () => {
  showNewPassword.value = !showNewPassword.value
}

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

const handleDeleteProfile = async () => {
  const isConfirmed = confirm('Czy na pewno chcesz usunąć swój profil? Tej operacji nie można cofnąć.')

  if (!isConfirmed) {
    return
  }

  try {
    await axiosInstance.delete('/api/profile')
    const storedUserData = localStorage.getItem('user')
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData)
      parsedData.profile = null
      localStorage.setItem('user', JSON.stringify(parsedData))
    }
    profileData.value = null
    alertState.value = { message: 'Profil został pomyślnie usunięty.', type: 'success' }
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
            <img v-if="profileData.logo" :src="profileData.logo" alt="Profile Logo" class="w-full h-full object-cover" @error="handleImageError" crossorigin="anonymous" referrerpolicy="no-referrer" />
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
          <div class="shadow appearance-none border rounded py-3 px-4 text-text leading-tight focus:outline-none focus:shadow-outline bg-secondary border-secondary opacity-50">
            {{profileData.email}}
          </div>
        </div>

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
        <div class="mb-6 relative">
          <input
            :type="showConfirmPassword ? 'text' : 'password'"
            v-model="confirmPassword"
            class="shadow appearance-none border rounded w-full py-3 px-4 text-text leading-tight focus:outline-none focus:shadow-outline bg-secondary border-secondary pr-10"
            placeholder="Potwierdź nowe hasło"
          />
          <button 
            type="button"
            @click="toggleConfirmPasswordVisibility"
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