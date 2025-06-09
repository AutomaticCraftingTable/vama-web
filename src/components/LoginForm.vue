<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import Eye from './Icons/Eye.vue'
import axiosInstance from '@/axiosInstance';
import Alert from '@/components/Alert.vue';
import { AxiosError } from 'axios';

const router = useRouter()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isMobile = ref(false)

const alertState = ref<{ message: string; type: 'success' | 'error' } | null>(null);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

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
    isMobile.value ? 'flex-1 px-4 pt-4' : 'w-full max-w-md bg-bg rounded-lg p-8 shadow-xl',
)

const inputClass = computed(() => isMobile.value ? 'w-full py-3 px-4 bg-secondary rounded text-text outline-none' : 'w-full py-3.5 px-4 rounded-sm text-text outline-none transition-colors bg-secondary',
)

const buttonClass = computed(() => isMobile.value ? 'w-full py-3 px-4 bg-primary text-text-primary font-bold rounded' : 'w-full py-3.5 px-4 bg-primary hover:bg-primary-hover text-text-primary font-bold border-none rounded-md text-base cursor-pointer mt-2 transition-colors',
)

const checkUserRole = async (remember_token: string) => {
  try {
    const response = await axiosInstance.get('/api/user', {
      headers: {
        Authorization: `Bearer ${remember_token}`
      }
    });

    if (response.data && response.data.role) {
      localStorage.setItem('userRole', response.data.role);
      return response.data.role;
    }
    throw new Error('Nie udało się pobrać roli użytkownika');
  } catch (error) {
    console.error('Błąd podczas pobierania roli użytkownika:', error);
    throw error;
  }
};

const checkUserProfile = async (token: string) => {
  try {
    const response = await axiosInstance.get('/api/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('Odpowiedź z API profilu:', response.data);

    if (response.data) {
      const storedUserData = localStorage.getItem('user');
      if (storedUserData) {
        const parsedData = JSON.parse(storedUserData);
        parsedData.profile = {
          state: response.data.state || 'noProfile',
          logo: response.data.logo,
          nickname: response.data.nickname,
          description: response.data.description
        };
        console.log('Zaktualizowane dane użytkownika:', parsedData);
        localStorage.setItem('user', JSON.stringify(parsedData));
      }
      return response.data;
    }
    throw new Error('Nie udało się pobrać profilu użytkownika');
  } catch (error) {
    console.error('Błąd podczas pobierania profilu użytkownika:', error);
    const storedUserData = localStorage.getItem('user');
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      parsedData.profile = {
        state: 'noProfile',
        logo: null,
        nickname: null,
        description: null
      };
      localStorage.setItem('user', JSON.stringify(parsedData));
    }
    return null;
  }
};

const handleLogin = async () => {
  try {
    const response = await axiosInstance.post('/api/auth/login', {
      email: email.value,
      password: password.value,
    });

    console.log('Odpowiedź z API logowania:', response.data);

    if (!response.data) {
      throw new Error('Brak odpowiedzi z serwera');
    }

    if (!response.data.token) {
      throw new Error('Brak tokenu w odpowiedzi');
    }

    if (!response.data.user) {
      throw new Error('Brak danych użytkownika w odpowiedzi');
    }

    const userData = {
      id: response.data.user.id,
      email: response.data.user.email,
      role: response.data.user.role
    };

    console.log('Zapisywane dane użytkownika:', userData);

    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(userData));
    
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

    await Promise.all([
      checkUserRole(response.data.token),
      checkUserProfile(response.data.token)
    ]);

    alertState.value = { message: 'Logowanie pomyślne!', type: 'success' };
    
    setTimeout(() => {
      router.push('/');
    }, 1000);
  } catch (error) {
    console.error('Błąd podczas logowania:', error);
    let errorMessage = 'Wystąpił błąd podczas logowania.';

    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        errorMessage = 'Nieprawidłowy email lub hasło.';
      } else if (error.response?.status === 422) {
        errorMessage = 'Nieprawidłowe dane logowania.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    alertState.value = { message: errorMessage, type: 'error' };
    password.value = '';
  }
};

const closeAlert = () => {
  alertState.value = null;
};

</script>
<template>
  <div :class="containerClass">
    <div :class="cardClass">
      <h1 :class="isMobile ? 'text-xl font-medium text-text' : 'text-2xl font-semibold text-text m-0 mb-2'">Witamy w VAMA</h1>
      <p :class="isMobile ? 'text-sm text-text-dimmed mb-6' : 'text-base text-text-secondary m-0 mb-6'">Podziel się swoją historią</p>
          <form class="w-full h-3/4 flex flex-col gap-6" @submit.prevent="handleLogin">
            <div class="flex flex-col gap-2 ">
              <input
                id="email"
                type="email"
                v-model="email"
                placeholder="Email"
                required
                :class="inputClass"
              />
            </div>
            <div class="flex flex-col gap-2 ">
              <div class="mb-4 relative ">
                <input
                  id="password"
                  :type="showPassword ? 'text' : 'password'"
                  v-model="password"
                  placeholder="Hasło"
                  required
                  :class="inputClass"
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
            <div class="flex-1"></div>
            <button type="submit" :class="buttonClass">Zaloguj się</button>
            <div class="text-center text-sm mt-2 text-text-dimmed">
              albo <a href="/registration" class="text-text">zarejestruj się</a>
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
