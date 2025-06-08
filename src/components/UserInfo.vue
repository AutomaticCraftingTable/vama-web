<script setup lang="ts">
import { defineProps, ref, watch, computed } from 'vue';
import Flag from './Icons/Flag.vue';
import Options from './Icons/Options.vue';
import { useRouter, useRoute } from "vue-router";
import axiosInstance from '@/axiosInstance';
import Alert from './Alert.vue';

const props = defineProps<{
  user: {
    logo: string,
    account_id: number,
    nickname: string,
    followers: number,
    bio: string,
    link: string
  },
  isCurrentUser: boolean,
  showBio?: boolean,
  role: string
}>()

const route = useRoute();
const router = useRouter();
const showMenu = ref(false);
const handleMenu = () => (showMenu.value = !showMenu.value);

const alert = ref<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

const isOwnProfile = computed(() => {
  return route.path === '/profile';
});

const handleReport = async () => {
  if (props.role === 'guest') {
    alert.value = { 
      message: 'Aby zgłosić profil, musisz się zalogować.', 
      type: 'info' 
    };
    return;
  }

  const storedUserData = localStorage.getItem('user')
  if (!storedUserData || !JSON.parse(storedUserData).profile?.nickname) {
    alert.value = { 
      message: 'Aby wykonać tę akcję, musisz utworzyć profil.', 
      type: 'info' 
    };
    return;
  }

  try {
    await axiosInstance.post(`/api/profile/${props.user.nickname}/report`);
    showMenu.value = false;
    alert.value = { message: 'Profil został zgłoszony', type: 'success' };
  } catch (error) {
    console.error('Błąd podczas zgłaszania profilu:', error);
    alert.value = { message: 'Wystąpił błąd podczas zgłaszania profilu', type: 'error' };
  }
}

const handleProfileClick = () => {
  if (route.path === '/profile' || route.path === `/profile/${props.user.nickname}`) {
    return;
  }
  router.push(`/profile/${props.user.nickname}`);
}

const isSubscribed = ref(false);
const followers = ref(0);

watch(() => props.user, (newUser) => {
  if (newUser) {
    followers.value = newUser.followers;
  }
}, { immediate: true });

const toggleSubscription = async () => {
  if (props.role === 'guest') {
    alert.value = { 
      message: 'Aby subskrybować profil, musisz się zalogować.', 
      type: 'info' 
    };
    return;
  }

  const storedUserData = localStorage.getItem('user')
  if (!storedUserData || !JSON.parse(storedUserData).profile?.nickname) {
    alert.value = { 
      message: 'Aby wykonać tę akcję, musisz utworzyć profil.', 
      type: 'info' 
    };
    return;
  }

  try {
    if (isSubscribed.value) {
      await axiosInstance.delete(`/api/profile/${props.user.nickname}/subscribe`);
      followers.value -= 1;
      isSubscribed.value = false;
      alert.value = { message: 'Odsubskrybowano profil', type: 'success' };
    } else {
      await axiosInstance.post(`/api/profile/${props.user.nickname}/subscribe`);
      followers.value += 1;
      isSubscribed.value = true;
      alert.value = { message: 'Subskrybowano profil', type: 'success' };
    }
  } catch (error) {
    console.error('Błąd podczas subskrybowania/odsubskrybowania:', error);
    alert.value = { message: 'Wystąpił błąd podczas zmiany statusu subskrypcji', type: 'error' };
  }
};
</script>

<template>
  <div class="flex flex-row items-center gap-6 py-6 max-w-lg md:max-w-full mx-auto md:mx-5">
    <div 
      :class="{'cursor-pointer': route.path !== '/profile' && route.path !== `/profile/${props.user.nickname}`}" 
      @click.prevent="handleProfileClick"
    >
      <img :src="user.logo" class="w-24 h-24 rounded-full object-cover bg-white border-2 border-primary" />
    </div>
    <div class="flex flex-col gap-1 flex-1">
      <div class="flex items-center gap-2">
        <div 
          :class="{'cursor-pointer': route.path !== '/profile' && route.path !== `/profile/${props.user.nickname}`}" 
          class="font-bold text-xl text-text" 
          @click.prevent="handleProfileClick"
        >
          {{ user.nickname }}
        </div>
        <div class="md:flex-1"></div>
        <button 
          v-if="!isOwnProfile" 
          @click="toggleSubscription" 
          class="px-4 py-2 rounded-sm transition-colors bg-secondary text-nowrap text-text"
        >
          {{ isSubscribed ? 'Odsubskrybuj' : 'Subskrybuj' }}
        </button>
        <div v-if="!isOwnProfile" class="relative">
          <button class="ml-2 px-2 py-1 rounded bg-secondary text-text" @click="handleMenu">
            <Options />
          </button>
          <div v-if="showMenu" class="absolute right-0 mt-2 w-40 bg-bg border border-secondary rounded shadow z-10">
            <button 
              class="flex items-center gap-2 w-full px-4 py-2 text-text hover:bg-secondary" 
              @click="handleReport"
            >
              <Flag />
              Zgłoś profil
            </button>
          </div>
        </div>
      </div>
      <p class="text-text-secondary text-sm">{{ followers }} obserwujących</p>
      <p v-if="showBio" class="text-text text-base leading-tight">{{ user.bio }}</p>
      <a :href="user.link" class="text-links underline text-sm mt-1" target="_blank">{{ user.link }}</a>
    </div>
    <Alert v-if="alert" :message="alert.message" :type="alert.type" :duration="3000" @close="alert = null" />
  </div>
</template> 