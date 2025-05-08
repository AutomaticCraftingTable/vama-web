<script setup lang="ts">
import { ref, onMounted } from 'vue'

defineProps<{
  msg?: string
}>()

const isLoggedIn = ref(false)
const searchQuery = ref('')
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
const theme = ref(prefersDark ? 'dark' : 'light')

const setTheme = (newTheme: string) => {
  theme.value = newTheme
  document.documentElement.setAttribute('data-theme', newTheme)
  localStorage.setItem('theme', newTheme)
}

const toggleTheme = () => {
  setTheme(theme.value === 'light' ? 'dark' : 'light')
}

onMounted(() => {
  const saved = localStorage.getItem('theme')
  if (saved === 'dark' || saved === 'light') {
    setTheme(saved)
  }
})
</script>

<template>
  <div class="w-full flex flex-col bg-background">
    <header class="w-full py-2.5">
      <div class="flex items-center justify-between w-full px-5">
        <div><a href="/"><img src="/Logo.png"></a></div>
        <div class="flex-grow mx-5">
          <div class="flex items-center bg-secondary rounded-sm px-4 py-2 text-secondary-text">
            <span class="mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input
                type="text"
                placeholder="Szukaj..."
                v-model="searchQuery"
                class="border-none bg-transparent w-full outline-none text-base  transition duration-150 ease-in-out"
            />
          </div>
        </div>
        <div class="flex gap-2.5 items-center">
          <button
            @click="toggleTheme"
            :aria-label="theme === 'light' ? 'Włącz tryb ciemny' : 'Włącz tryb jasny'"
            tabindex="0"
            class="p-2 rounded-full border border-secondary hover:bg-secondary focus:outline-none focus:ring"
          >
            <span v-if="theme === 'light'">
              <!-- Ikona księżyca -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
            </span>
            <span v-else>
              <!-- Ikona słońca -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.93l-.71-.71" /></svg>
            </span>
          </button>
          <router-link to="/login"><button class="px-5 py-2 rounded-sm border-none cursor-pointer font-medium bg-secondary hover:bg-secondary-hover text-text">Zaloguj się</button></router-link>
          <router-link to="/Registration"><button class="px-5 py-2 rounded-sm border-none cursor-pointer font-medium bg-primary text-white-text hover:bg-primary-hover">Zajerestuj się</button></router-link>
          <router-view />
        </div>
      </div>
    </header>
  </div>
</template>
