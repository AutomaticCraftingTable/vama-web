<script setup lang="ts">
import {ref, onMounted, computed} from 'vue'
import Eye from './Icons/Eye.vue'
import axiosInstance from '@/axiosInstance';
import Alert from '@/components/Alert.vue';
import { AxiosError } from 'axios';

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const termsAccepted = ref(false)
const isMobile = ref(false)

const alertState = ref<{ message: string; type: 'success' | 'error' } | null>(null);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleRegister = async () => {
  if (!termsAccepted.value) {
    alertState.value = { message: 'Musisz zaakceptować regulamin przed rejestracją!', type: 'error' };
    return;
  }

  try {
    const response = await axiosInstance.post('/api/auth/register', {
      email: email.value,
      password: password.value,
    });

    console.log('Rejestracja pomyślna:', response.data);

    alertState.value = { message: 'Rejestracja pomyślna!', type: 'success' };

  } catch (error) {
    console.error('Błąd podczas rejestracji:', error);
    let errorMessage = 'Wystąpił błąd podczas rejestracji.';
    if (error instanceof AxiosError && error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error instanceof Error) {
       errorMessage = error.message;
    }
    alertState.value = { message: errorMessage, type: 'error' };
  }
};

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

const containerClass = computed(() =>
    isMobile.value ? 'flex flex-col h-screen bg-bg' : 'flex justify-center items-center h-screen bg-bg p-5',
)

const cardClass = computed(() =>
    isMobile.value ? 'flex-1 px-4 pt-4' : 'w-full max-w-md bg-background rounded-lg p-8 shadow-xl',
)

const inputClass = computed(() => isMobile.value ? 'w-full py-3 px-4 bg-secondary rounded text-text outline-none' : 'w-full py-3.5 px-4 rounded-sm text-text outline-none transition-colors bg-secondary',
)

const buttonClass = computed(() => isMobile.value ? 'w-full py-3 px-4 bg-primary text-text-primary font-bold rounded' : 'w-full py-3.5 px-4 bg-primary hover:bg-primary-hover text-text-primary font-bold border-none rounded-md text-base cursor-pointer mt-2 transition-colors',
)

const closeAlert = () => {
  alertState.value = null;
};
</script>

<template>
  <div :class="containerClass">
    <div :class="cardClass">
      <h1 :class="isMobile ? 'text-xl font-medium text-text' : 'text-2xl font-semibold text-text m-0 mb-2'">Witamy w VAMA</h1>
      <p class="text-sm text-text-dimmed mb-6">Rozpocznij pisanie swoich historii</p>

      <form @submit.prevent="handleRegister" class="w-full h-3/4 flex flex-col gap-4">
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
        <div class="flex-1"></div>
        <div class="mt-4">
          <label class="flex items-start text-xs text-text-dimmed leading-tight">
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
        <div class="text-center text-sm text-text-dimmed mt-2">
          albo <a href="/login" class="text-text">zaloguj się</a>
        </div>
      </form>
        <Alert 
          v-if="alertState"
          :message="alertState.message"
          :type="alertState.type"
          :duration="5000"
          @close="closeAlert"
        />
    </div>
  </div>
</template>
