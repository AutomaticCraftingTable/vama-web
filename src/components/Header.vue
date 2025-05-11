<script setup lang="ts">
import {ref, onMounted} from 'vue'
import Sun from './Icons/Sun.vue'
import Moon from './Icons/Moon.vue'
import Lens from './Icons/Lens.vue'
import Stack from './Icons/Stack.vue'
import AuthButtons from './AuthButtons.vue'
import axios from 'axios'


const role = ref()
const isDropdownOpen = ref(false)
const searchQuery = ref('')
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
const theme = ref(prefersDark ? 'dark' : 'light')
const isSmallScreen = ref(window.innerWidth < 768)

window.addEventListener('resize', () => {
  isSmallScreen.value = window.innerWidth < 768
})

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

onMounted(() => {
  const saved = localStorage.getItem('theme')
  if (saved === 'dark' || saved === 'light') {
    setTheme(saved)
  }

  axios.get('http://127.0.0.1:3658/m1/829899-809617-default/api/home')
      .then(response => {
        role.value = response.data.role
      })
      .catch(error => {
        console.error('Błąd podczas pobierania roli użytkownika:', error)
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
  <div class="w-full flex flex-col bg-bg">
    <header class="w-full py-2.5">
      <div class="flex items-center justify-between w-full px-6">
        <div><a href="/"><img src="/Logo.png"></a></div>
        <div class="flex-grow mx-5">
          <div v-if="!isSmallScreen" class="flex items-center bg-secondary rounded-sm py-2 text-text-dimmed">
                        <span class="mr-2 px-3.5">
                            <Lens/>
                        </span>
            <input type="text" placeholder="Szukaj..." v-model="searchQuery"
                   class="border-none bg-transparent w-full outline-none text-base  transition duration-150 ease-in-out"/>
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
          <div class="flex flex-row items-center" v-if="role !== 'guest'">
            <div><a href="/OwnProfile"><img src="/Avatar.png"></a></div>
            <div>
              <button @click="toggleDropdown" id="dropdown-button"
                      class="p-2 hover:bg-secondary text-text cursor-pointer">
                <Stack/>
              </button>
              <div v-if="isDropdownOpen" id="user-dropdown"
                   class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-bg border border-secondary z-50">
                <div class="flex items-center justify-between px-4 py-2">
                  <span>Motyw</span>
                  <button @click="toggleTheme" class="relative">
                    <div class="w-12 h-6 bg-secondary rounded-full">
                      <div
                          :class="['absolute w-6 h-6 bg-primary rounded-full transition-transform', theme === 'dark' ? 'translate-x-6' : '']">
                      </div>
                    </div>
                  </button>
                </div>
                <div class="py-1">
                  <router-link to="/login"
                               class="block px-4 py-2 text-text font-bold hover:bg-secondary">Wyloguj się
                  </router-link>
                </div>
              </div>
            </div>
            <router-view/>
          </div>
          <div class="flex flex-row items-center gap-2.5" v-if="role === 'guest' && !isSmallScreen">
            <AuthButtons/>
          </div>
          <div v-if="role === 'guest' && isSmallScreen">
            <div>
              <button @click="toggleDropdown" id="dropdown-button"
                      class="p-2 hover:bg-secondary text-text cursor-pointer">
                <Stack/>
              </button>
              <div v-if="isDropdownOpen" id="user-dropdown"
                   class="absolute right-0 my-2 p-2 w-48 rounded-md shadow-lg bg-bg border border-secondary">
                <div class="flex items-center justify-between px-4 py-2">
                  <span>Motyw</span>
                  <button @click="toggleTheme" class="relative">
                    <div class="w-12 h-6 bg-secondary rounded-full">
                      <div
                          :class="['absolute w-6 h-6 bg-primary rounded-full transition-transform', theme === 'dark' ? 'translate-x-6' : '']">
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
  </div>

</template>
