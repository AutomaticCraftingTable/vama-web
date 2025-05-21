<script setup lang="ts">
import { defineProps, ref } from 'vue';
import Flag from './Icons/Flag.vue';
import Options from './Icons/Options.vue';

const props = defineProps<{
  user: {
    logo: string,
    nickname: string,
    followers: number,
    bio: string,
    link: string
  },
  isCurrentUser: boolean
}>()

const showMenu = ref(false)
const handleMenu = () => (showMenu.value = !showMenu.value)
const handleReport = () => {
  showMenu.value = false
}
</script>
<template>
  <div class="flex flex-row items-center gap-6 py-6 max-w-lg md:max-w-full mx-auto md:mx-5">
    <img :src="user.logo" alt="avatar" class="w-24 h-24 rounded-full object-cover bg-white border-2 border-primary" />
    <div class="flex flex-col gap-1 flex-1">
      <div class="flex items-center gap-2">
        <p class="font-bold text-xl text-text">{{ user.nickname }}</p>
        <div class="md:flex-1"></div>
        <button v-if="!isCurrentUser" class="ml-2 px-4 py-1 rounded bg-secondary text-text font-semibold">Zasubskrybuj</button>
        <div v-if="!isCurrentUser" class="relative">
          <button class="ml-2 px-2 py-1 rounded bg-secondary text-text" @click="handleMenu"><Options /></button>
          <div v-if="showMenu" class="absolute right-0 mt-2 w-40 bg-bg border border-secondary rounded shadow z-10">
            <button class="flex items-center gap-2 w-full px-4 py-2 text-text hover:bg-secondary" @click="handleReport">
              <Flag />
              Zgłoś profil
            </button>
          </div>
        </div>
      </div>
      <p class="text-text-secondary text-sm">{{ user.followers }} obserwujących</p>
      <p class="text-text text-base leading-tight">{{ user.bio }}</p>
      <a :href="user.link" class="text-links underline text-sm mt-1" target="_blank">{{ user.link }}</a>
    </div>
  </div>
</template> 