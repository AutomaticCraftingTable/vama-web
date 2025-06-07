<script setup lang="ts">
import { ref } from 'vue'
import Eye from './Icons/Eye.vue'
import axiosInstance from '@/axiosInstance'; // Import axiosInstance
import Alert from '@/components/Alert.vue'; // Import komponentu Alert
import { AxiosError } from 'axios'; // Import AxiosError

const email = ref('')
const password = ref('')
const showPassword = ref(false)

// Zmienna stanu dla alertu
const alertState = ref<{ message: string; type: 'success' | 'error' } | null>(null);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// Metoda logowania
const handleLogin = async () => {
  try {
    const response = await axiosInstance.post('/api/auth/login', {
      email: email.value,
      password: password.value,
    });

    // Zakładając, że API zwraca token lub dane użytkownika po sukcesie
    console.log('Logowanie pomyślne:', response.data);
    // Tutaj można zapisać token w localStorage i przekierować użytkownika
    // localStorage.setItem('authToken', response.data.token);
    // router.push('/home'); // Przykład przekierowania

    alertState.value = { message: 'Logowanie pomyślne!', type: 'success' }; // Wyświetl alert sukcesu

  } catch (error) {
    console.error('Błąd podczas logowania:', error); // Zachowano log w konsoli do debugowania
    let errorMessage = 'Wystąpił błąd podczas logowania.';
    // Sprawdzenie, czy błąd jest instancją AxiosError i ma odpowiednią strukturę
    if (error instanceof AxiosError && error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error instanceof Error) {
       errorMessage = error.message; // Użyj domyślnego komunikatu błędu JS
    }
    alertState.value = { message: errorMessage, type: 'error' };
  }
};

// Metoda zamykająca alert
const closeAlert = () => {
  alertState.value = null;
};

</script>
<template>
  <div class="flex flex-col min-h-screen bg-bg">
    <div class="flex flex-1">
      <div class="hidden md:block w-1/2 bg-cover bg-center"><img src="/LoginBG.png"></div>
      <div class="w-full md:w-1/2 flex justify-center items-center p-8">
        <div class="w-full max-w-md">
          <h1 class="text-2xl font-semibold text-text m-0 mb-2">Witamy w VAMA</h1>
          <p class="text-base text-text-secondary m-0 mb-6">Podziel się swoją historią</p>
          <form class="w-full flex flex-col gap-6" @submit.prevent="handleLogin">
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
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent border-none cursor-pointer text-text-secondary flex items-center justify-center p-0"
                  @click="togglePasswordVisibility"
                >
                  <Eye></Eye>
                </button>
              </div>
            </div>
            <button type="submit" class="w-full py-3.5 px-4 rounded-sm font-semibold text-base transition-colors text-text-primary bg-primary hover:bg-primary-hover">Zaloguj się</button>
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
    </div>
  </div>
</template>
