<script setup lang="ts">
import {ref, onMounted, computed} from 'vue'
import Eye from './Icons/Eye.vue'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const termsAccepted = ref(false)
const isMobile = ref(false)

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleRegister = () => {
  if (!termsAccepted.value) {
    alert('Musisz zaakceptować regulamin przed rejestracją!')
    return
  }
}

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

const containerClass = computed(() =>
    isMobile.value ? 'flex flex-col min-h-screen bg-gray-100' : 'flex justify-center items-center min-h-screen bg-bg p-5',
)

const cardClass = computed(() =>
    isMobile.value ? 'flex-1 px-4 pt-4' : 'w-full max-w-md bg-background rounded-lg p-8 shadow-xl',
)

const inputClass = computed(() => isMobile.value ? 'w-full py-3 px-4 bg-gray-200 rounded text-gray-700 outline-none' : 'w-full py-3.5 px-4 rounded-sm text-text-secondary outline-none transition-colors bg-secondary',
)

const buttonClass = computed(() => isMobile.value ? 'w-full py-3 px-4 bg-black text-white font-medium rounded' : 'w-full py-3.5 px-4 bg-primary hover:bg-primary-hover text-text-primary font-bold border-none rounded-md text-base cursor-pointer mt-2 transition-colors',
)
</script>

<template>
  <div :class="containerClass">


    <div :class="cardClass">
      <h1 :class="isMobile ? 'text-xl font-medium text-gray-900' : 'text-2xl font-semibold text-text m-0 mb-2'">Witamy w
        VAMA</h1>
      <p :class="isMobile ? 'text-sm text-gray-600 mb-6' : 'text-base text-text-secondary m-0 mb-6'">
        {{ isMobile ? 'Share your history' : 'Rozpocznij pisanie swoich historii' }}
      </p>

      <form @submit.prevent="handleRegister" class="w-full flex flex-col gap-4">
        <input
            type="email"
            v-model="email"
            placeholder="Email"
            required
            :class="inputClass"
        />

        <div class="relative">
          <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              placeholder="Hasło"
              required
              :class="inputClass"
          />
          <button
              type="button"
              @click="togglePasswordVisibility"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary"
          >
            <Eye></Eye>
          </button>
        </div>
        <div class="bg-red-500 size-3.5 h-full"></div>
        <div class="mt-4">
          <label class="flex items-start text-xs text-gray-500 leading-tight">
            <input type="checkbox" v-model="termsAccepted" required class="mr-2 mt-0.5"/>
            <span class="text-sm text-text-secondary leading-tight">
              Zgadzam się z
              <a class="underline text-links" href="#">Warunkami i Postanowieniami, Polityką Prywatności i Umową Licencyjną</a>
            </span>
          </label>
        </div>

        <button type="submit" :class="buttonClass">
          Zarejestruj się
        </button>
        <div v-if="isMobile" class="text-center text-sm mt-2">
          albo <a href="#" class="text-gray-600">zaloguj się</a>
        </div>
      </form>
    </div>
  </div>
</template>
