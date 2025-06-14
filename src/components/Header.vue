<script setup lang="ts">
import {ref, onMounted} from 'vue'
import Sun from './Icons/Sun.vue'
import Moon from './Icons/Moon.vue'
import Lens from './Icons/Lens.vue'
import Stack from './Icons/Stack.vue'
import AuthButtons from './AuthButtons.vue'
import axiosInstance from '@/axiosInstance'
import { useRouter } from 'vue-router'
import Alert from './Alert.vue'



const props = defineProps<{
  role: string
  searchQuery?: string
}>()

const router = useRouter()
const isDropdownOpen = ref(false)
const searchQuery = ref(props.searchQuery || '')
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
const theme = ref(prefersDark ? 'dark' : 'light')
const isSmallScreen = ref(window.innerWidth < 768)
const alertState = ref<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
const isLoggedIn = ref(false)
const userProfile = ref<{ name: string; email: string; role?: string; profile?: { state: string; description?: string; logo?: string; nickname?: string } } | null>(null)
const userLogo = ref('/Avatar.png')
const isProfileMenuOpen = ref(false)

window.addEventListener('resize', () => {
  isSmallScreen.value = window.innerWidth < 768
})
const getCurrentRole = () => localStorage.getItem('userRole') || 'guest'
const setTheme = (newTheme: string) => {
  theme.value = newTheme
  document.documentElement.setAttribute('data-theme', newTheme)
  localStorage.setItem('theme', newTheme)
}

const toggleTheme = () => {
  setTheme(theme.value === 'light' ? 'dark' : 'light')
}

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const closeAlert = () => {
  alertState.value = null
}

const handleSettings = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    router.push('/settings')
  } catch (error) {
    router.push('/login')
  }
}

const checkAuthStatus = async () => {
  try {
    const token = localStorage.getItem('token')
    
    if (!token) {
      isLoggedIn.value = false
      userProfile.value = null
      userLogo.value = '/Avatar.png'
      return
    }

    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`

    const savedUser = localStorage.getItem('user')
    
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser) as { name: string; email: string; role?: string; profile?: { state: string; description?: string; logo?: string; nickname?: string } }
        if (userData.profile?.nickname) {
          userData.profile.state = 'hasProfile'
        } else {
          userData.profile = {
            ...userData.profile,
            state: 'noProfile'
          }
        }
        
        isLoggedIn.value = true
        userProfile.value = userData
        userLogo.value = userData.profile?.logo || '/Avatar.png'
      } catch (parseError) {
        isLoggedIn.value = false
        userProfile.value = null
        userLogo.value = '/Avatar.png'
      }
    } else {
      try {
        const response = await axiosInstance.get('/api/profile')
        
        if (response.data?.profile) {
          const userData: { name: string; email: string; role?: string; profile?: { state: string; description?: string; logo?: string; nickname?: string } } = {
            name: response.data.name || '',
            email: response.data.email,
            role: response.data.role,
            profile: {
              ...response.data.profile,
              state: response.data.profile.nickname ? 'hasProfile' : 'noProfile'
            }
          }
          
          localStorage.setItem('user', JSON.stringify(userData))
          isLoggedIn.value = true
          userProfile.value = userData
          userLogo.value = userData.profile?.logo || '/Avatar.png'
        } else {
          isLoggedIn.value = false
          userProfile.value = null
          userLogo.value = '/Avatar.png'
        }
      } catch (error) {
        isLoggedIn.value = false
        userProfile.value = null
        userLogo.value = '/Avatar.png'
      }
    }
  } catch (error) {
    isLoggedIn.value = false
    userProfile.value = null
    userLogo.value = '/Avatar.png'
  }
}

const handleLogout = async () => {
  try {
    await axiosInstance.post('/api/auth/logout')
  } catch (error) {
    console.error('Błąd podczas wylogowywania:', error)
  } finally {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('userRole')
    isLoggedIn.value = false
    userProfile.value = null
    userLogo.value = '/Avatar.png'

    router.push('/login')
  }
}

const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    alertState.value = { message: 'Wprowadź frazę do wyszukania.', type: 'info' }
    return
  }
  router.push({
    path: '/search-results',
    query: { q: searchQuery.value }
  })
}

const handleLogoError = (event: Event) => {
  const img = event.target as HTMLImageElement
  console.warn('Błąd ładowania logo:', img.src)
  img.src = '/Avatar.png'
}

const updateUserLogo = () => {
  const savedUser = localStorage.getItem('user')
  if (savedUser) {
    try {
      const userData = JSON.parse(savedUser)
      userLogo.value = userData.profile?.logo || '/Avatar.png'
    } catch (error) {
      userLogo.value = '/Avatar.png'
    }
  }
}

const handleProfileClick = () => {
  if (!isLoggedIn.value) {
    router.push('/settings')
    return
  }
  isProfileMenuOpen.value = !isProfileMenuOpen.value
}

onMounted(async () => {
  await checkAuthStatus()
  const saved = localStorage.getItem('theme')
  if (saved === 'dark' || saved === 'light') {
    setTheme(saved)
  }
  window.addEventListener('storage', (e) => {
    if (e.key === 'user') {
      updateUserLogo()
    }
  })

  document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('user-dropdown')
    const dropdownButton = document.getElementById('dropdown-button')
    if (dropdown && !dropdown.contains(e.target as Node) && !dropdownButton?.contains(e.target as Node)) {
      closeDropdown()
    }
  })

})
</script>

<template>
  <div class="max-w-screen flex flex-col bg-bg">
    <header class="w-full py-2.5">
      <div class="flex items-center justify-between w-full px-6">
        <div><a href="/"><img src="/Logo.png" alt="Logo"></a></div>
        <div class="flex-grow mx-5">
          <div v-if="!isSmallScreen" class="flex items-center bg-secondary rounded-sm py-2 text-text-dimmed">
            <span class="mr-2 px-3.5">
              <Lens/>
            </span>
            <input type="text" placeholder="Szukaj..." v-model="searchQuery" @keydown.enter="handleSearch" class="border-none bg-transparent w-full outline-none text-base transition duration-150 ease-in-out"/>
          </div>
          <div v-if="isSmallScreen" class="flex items-center justify-end text-text">
            <span>
              <Lens class="h-6 w-6"/>
            </span>
          </div>
        </div>
        <div class="flex gap-2.5 items-center text-text justify-end">
          <button v-if="!isSmallScreen" @click="toggleTheme" tabindex="0"
                  class="p-2 rounded-full border border-text hover:bg-secondary focus:outline-none focus:ring cursor-pointer">
            <span v-if="theme === 'light'">
              <Moon/>
            </span>
            <span v-else>
              <Sun/>
            </span>
          </button>
          <div class="flex flex-row items-center" v-if="isLoggedIn">
            <div>
              <a href="/profile">
                <img
                  :src="userLogo"
                  @error="handleLogoError"
                  class="w-10 h-10 rounded-full object-cover"
                  alt="Logo użytkownika"
                  crossorigin="anonymous"
                  referrerpolicy="no-referrer"
                />
              </a>
            </div>
            <div>
              <button @click="toggleDropdown" id="dropdown-button"
                      class="p-2 hover:bg-secondary text-text cursor-pointer">
                <Stack/>
              </button>
              <div v-if="isDropdownOpen" id="user-dropdown"
                   class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-bg border border-secondary z-50">
                <div v-if="isSmallScreen" class="flex items-center justify-between px-4 py-2">
                  <span class="text-text">Motyw</span>
                  <button @click="toggleTheme" class="relative">
                    <div class="w-12 h-6 bg-secondary rounded-full">
                      <div
                          :class="['absolute w-6 h-6 bg-primary rounded-full transition-transform', theme === 'dark' ? 'translate-x-6' : '']">
                      </div>
                    </div>
                  </button>
                </div>
                <div class="py-1">
                  <button @click="handleSettings"
                          class="block w-full text-left px-4 py-2 text-text hover:bg-secondary">Ustawienia
                  </button>
                </div>
                <div class="py-1">
                  <button @click="handleLogout"
                          class="block w-full text-left px-4 py-2 text-text hover:bg-secondary">Wyloguj się
                  </button>
                </div>
              </div>
            </div>
            <router-view/>
          </div>
          <div class="flex flex-row items-center gap-2.5" v-if="!isLoggedIn && !isSmallScreen">
            <AuthButtons/>
          </div>
          <div v-if="!isLoggedIn && isSmallScreen">
            <div>
              <button @click="toggleDropdown" id="dropdown-button"
                      class="p-2 hover:bg-secondary text-text cursor-pointer">
                <Stack/>
              </button>
              <div v-if="isDropdownOpen" id="user-dropdown"
                   class="absolute right-0 my-2 p-2 w-48 rounded-md shadow-lg bg-bg border border-secondary">
                <div v-if="isSmallScreen" class="flex items-center justify-between px-4 py-2">
                  <span class="text-text">Motyw</span>
                  <button @click="toggleTheme" class="relative">
                    <div class="w-12 h-6 bg-secondary rounded-full">
                      <div
                          :class="['w-6 h-6 bg-primary rounded-full transition-transform', theme === 'dark' ? 'translate-x-6' : '']">
                      </div>
                    </div>
                  </button>
                </div>
                <div>
                  <AuthButtons/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    <Alert
      v-if="alertState"
      :message="alertState.message"
      :type="alertState.type"
      :duration="5000"
      @close="closeAlert"
    />
  </div>
</template>
