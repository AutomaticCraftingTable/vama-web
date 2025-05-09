<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const termsAccepted = ref(false)

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleRegister = () => {
  if (!termsAccepted.value) {
    alert('Musisz zaakceptować regulamin przed rejestracją!')
    return
  }
  console.log('Próba rejestracji z danymi:', email.value, password.value)
}
</script>
<template>
  <div class="flex justify-center items-center min-h-screen bg-bg p-5">
    <div class="w-full max-w-md bg-background rounded-lg p-8 shadow-xl">
      <h1 class="text-2xl font-semibold text-text m-0 mb-2">Witamy w VAMA</h1>
      <p class="text-base text-text-secondary m-0 mb-6">Rozpocznij pisanie swoich historii</p>

      <form @submit.prevent="handleRegister" class="w-full flex flex-col gap-6">
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

        <div class="my-4">
          <label class="flex items-center cursor-pointer">
            <input
                type="checkbox"
                v-model="termsAccepted"
                required
                class="mr-2 cursor-pointer"
            />
            <span class="text-sm text-text-secondary leading-tight">Zgadzam się z <a class="underline text-links" href="http://">Warunkami i Postanowieniami, Polityką Prywatności i Umową Licencyjną</a></span>
          </label>
        </div>

        <button
            type="submit"
            class="w-full py-3.5 px-4 bg-primary hover:bg-primary-hover text-text-primary font-bold border-none rounded-md text-base cursor-pointer mt-2 transition-colors"
        >
          Zarejestruj się
        </button>
      </form>
    </div>
  </div>
</template>
