<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const showPassword = ref(false)

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = () => {
  console.log('Login attempt with:', email.value, password.value)
}
</script>

<template>
  <div class="flex justify-center items-center min-h-screen bg-background p-5">
    <div class="w-full max-w-md bg-background rounded-lg p-8 shadow-xl">
      <h1 class="text-2xl font-semibold text-dark-text m-0 mb-2">Witamy w VAMA</h1>
      <p class="text-base text-text-secondary m-0 mb-6">Podziel się swoją historią</p>

      <form @submit.prevent="handleLogin">
        <div class="mb-4 relative">
          <input
              type="email"
              v-model="email"
              placeholder="Email"
              required
              class="w-full py-3.5 px-4 border border-background-secondary rounded-md text-base outline-none transition-colors focus:border-primary"
          />
        </div>

        <div class="mb-4 relative">
          <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              placeholder="Hasło"
              required
              class="w-full py-3.5 px-4 border border-background-secondary rounded-md text-base outline-none transition-colors focus:border-primary"
          />
          <button
              type="button"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent border-none cursor-pointer text-text-secondary flex items-center justify-center p-0"
              @click="togglePasswordVisibility"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </button>
        </div>
        <button type="submit" class="w-full py-3.5 px-4 bg-primary text-text border-none rounded-md text-base font-bold cursor-pointer mt-2 transition-colors hover:bg-accent">Zaloguj się</button>
      </form>
    </div>
  </div>
</template>
