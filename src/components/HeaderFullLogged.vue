<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Lens from './Icons/Lens.vue'
import Sun from './Icons/Sun.vue'
import Moon from './Icons/Moon.vue'
import Stack from './Icons/Stack.vue'
defineProps<{
  msg?: string
}>()

const isLoggedIn = ref(false)
const searchQuery = ref('')
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
const theme = ref(prefersDark ? 'dark' : 'light')
const isDropdownOpen = ref(false)

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
      <div class="flex items-center justify-between w-full px-5">
        <div><a href="/"><img src="/Logo.png"></a></div>
        <div class="flex-grow mx-5">
          <div class="flex items-center bg-secondary rounded-sm px-4 py-2 text-text-dimmed">
            <span class="mr-2">
              <Lens></Lens>
            </span>
            <input
                type="text"
                placeholder="Szukaj..."
                v-model="searchQuery"
                class="border-none bg-transparent w-full outline-none text-base  transition duration-150 ease-in-out"
            />
          </div>
        </div>
        <div class="flex gap-2.5 items-center ">
          <button
            @click="toggleTheme"
            tabindex="0"
            class="p-2 rounded-full border border-secondary hover:bg-secondary focus:outline-none focus:ring cursor-pointer"
          >
            <span v-if="theme === 'light'" class="text-text">
              <Sun></Sun>
            </span>
            <span v-else class="text-text ">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg>
            </span>
          </button>
          <div><a href="/OwnProfile"><img src="/Avatar.png"></a></div>
          <div>
            <button
              @click="toggleDropdown"
              id="dropdown-button"
              class="p-2 hover:bg-secondary text-text cursor-pointer"
            >
              <Stack></Stack>
            </button>
            <div
              v-if="isDropdownOpen"
              id="user-dropdown"
              class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-bg border border-secondary z-50"
            >
              <div class="py-1">
                <router-link to="/login" class="block px-4 py-2 text-text hover:bg-secondary">Wyloguj się</router-link>
              </div>
            </div>
          </div>
          <router-view />
        </div>
      </div>
    </header>
  </div>
</template>
