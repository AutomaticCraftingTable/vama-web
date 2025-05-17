<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps<{
  user: {
    logo: string,
    nickname: string,
    followers: number,
    bio: string,
    link: string
  }
}>()
</script>
<template>
  <div class="flex flex-row items-center gap-6 py-6 w-full max-w-lg mx-auto">
    <img :src="user.logo" alt="avatar" class="w-24 h-24 rounded-full object-cover bg-white border-2 border-primary" />
    <div class="flex flex-col gap-1">
      <p class="font-bold text-xl text-text">{{ user.nickname }}</p>
      <p class="text-text-secondary text-sm">{{ user.followers }} obserwujących</p>
      <p class="text-text text-base leading-tight">{{ user.bio }}</p>
      <a :href="user.link" class="text-primary underline text-sm mt-1" target="_blank">{{ user.link }}</a>
    </div>
  </div>
</template> 