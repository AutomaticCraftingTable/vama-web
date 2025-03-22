<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  msg: string
}>()

const isLoggedIn = ref(false)
const searchQuery = ref('')
</script>

<template>
  <div class="w-full flex flex-col bg-gray-50">
    <header class="w-full py-2.5">
      <div class="flex items-center justify-between w-full px-5">
        <div class="flex items-center">
          <a href="/">
            <div class="w-10 h-10 flex items-center justify-center font-bold text-2xl">V</div>
          </a>
        </div>

        <div class="flex-grow max-w-lg mx-5">
          <div class="flex items-center bg-gray-200 rounded-full px-4 py-2">
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
                class="border-none bg-transparent w-full outline-none text-base text-gray-800"
            />
          </div>
        </div>

        <div class="flex gap-2.5">
          <button class="px-5 py-2 rounded-full border-none cursor-pointer font-medium bg-gray-200 text-gray-800">
            Zaloguj się
          </button>
          <button class="px-5 py-2 rounded-full border-none cursor-pointer font-medium">
            Zajerestuj się
          </button>
        </div>
      </div>
    </header>
  </div>
</template>
