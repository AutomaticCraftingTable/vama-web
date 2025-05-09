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
  <div class="flex flex-col min-h-screen bg-bg">
    <div class="flex flex-1">
      <div class="hidden md:block w-1/2 bg-cover bg-center"><img src="/LoginBG.png"></div>
      <div class="w-full md:w-1/2 flex justify-center items-center p-8">
        <div class="w-full max-w-md">
          <h1 class="text-2xl font-semibold text-text m-0 mb-2">Witamy w VAMA</h1>
          <p class="text-base text-text-secondary m-0 mb-6">Podziel się swoją historią</p>
          <form @submit.prevent="handleLogin" class="w-full flex flex-col gap-6">
            <div class="flex flex-col gap-2 bg-secondary">
              <input
                id="email"
                type="email"
                v-model="email"
                placeholder="Email"
                required
                class="w-full py-3.5 px-4 rounded-sm text-text-secondary outline-none transition-colors"
              />
            </div>
            <div class="flex flex-col gap-2 ">
              <div class="mb-4 relative bg-secondary">
                <input
                  id="password"
                  :type="showPassword ? 'text' : 'password'"
                  v-model="password"
                  placeholder="Hasło"
                  required
                  class="w-full py-3.5 px-4 rounded-sm text-text-secondary outline-none transition-colors"
                />
                <button
                  type="button"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent border-none cursor-pointer text-secondary-text flex items-center justify-center p-0"
                  @click="togglePasswordVisibility"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
              </div>
            </div>
            <button type="submit" class="w-full py-3.5 px-4 rounded-sm font-semibold text-base transition-colors text-text-primary bg-primary hover:bg-primary-hover">Zaloguj się</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
