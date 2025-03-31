<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

defineProps<{
  msg?: string
}>()

const isLoggedIn = ref(false)
const searchQuery = ref('')

function requestTest(){
  axios.get('/api/list/moderators')
    .then(response => {
      console.log(response.data)
    })
    .catch(error => {
      console.log(error)
    })
}
</script>

<template>
  <div class="w-full flex flex-col bg-background">
    <header class="w-full py-2.5">
      <div class="flex items-center justify-between w-full px-5">
        <div class="flex items-center gap-2 text-2xl">
          <a href="/">
            <div class="w-10 h-10 flex items-center justify-center font-bold text-text bg-black">V</div>
          </a>
          <div>Vama</div>
        </div>

        <div class="flex-grow max-w-lg mx-5">
          <div class="flex items-center bg-background-secondary rounded-full px-4 py-2 text-text-secondary">
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

        <div class="flex gap-2.5">
          <router-link to="/login"><button class="px-5 py-2 rounded-full border-none cursor-pointer font-medium bg-background-secondary hover:bg-background-hover text-dark-text">Zaloguj się</button></router-link>
          <router-link to="/Registration"><button class="px-5 py-2 rounded-full border-none cursor-pointer font-medium bg-primary text-text hover:bg-accent">Zajerestuj się</button></router-link>
          <router-view />
        </div>
      </div>
    </header>
  </div>
</template>
