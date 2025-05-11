<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Lens from './Icons/Lens.vue'
import Sun from './Icons/Sun.vue'
import Moon from './Icons/Moon.vue'
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
        <div class="flex gap-2.5 items-center text-text">
          <button
            @click="toggleTheme"
            :aria-label="theme === 'light' ? 'Włącz tryb ciemny' : 'Włącz tryb jasny'"
            tabindex="0"
            class="p-2 rounded-full border border-text hover:bg-secondary focus:outline-none focus:ring"
          >
            <span v-if="theme === 'light'">
              <Moon></Moon>
            </span>
            <span v-else>
              <Sun></Sun>
            </span>
          </button>
          <router-link to="/login"><button class="px-5 py-2 rounded-sm border-none cursor-pointer font-medium bg-secondary hover:bg-secondary-hover text-text">Zaloguj się</button></router-link>
          <router-link to="/Registration"><button class="px-5 py-2 rounded-sm border-none cursor-pointer font-medium bg-primary text-text-primary hover:bg-primary-hover">Zajerestuj się</button></router-link>
          <router-view />
        </div>
      </div>
    </header>
  </div>
</template>
