<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps<{
  article: {
    title: string;
    thumbnail: string;
    content: string;
    author: {
      logo: string | null;
      nickname: string;
      followers: number;
    };
  } | null;
}>();
</script>
<template>
    <div class="flex flex-col p-5 w-full">
      <h1 class="text-2xl font-bold">{{ article?.title }}</h1>
      <div class=" flex items-center mt-4">
        <img :src="article?.author.logo ?? ''" alt="Author Logo" class="w-10 h-10 rounded-full object-cover" />
        <div class="ml-2">
          <p class="text-lg font-semibold">{{ article?.author.nickname }}</p>
          <p class="text-gray-500">{{ article?.author.followers }} obserwujących</p>
        </div>
      </div>
      <p class="mt-4">{{ article?.content }}</p>
    </div>
  </template>
