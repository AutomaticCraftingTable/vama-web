<script setup lang="ts">
import {defineProps } from 'vue'
import Tag from './Tag.vue'
import { useRouter } from 'vue-router';
const props = defineProps<{
  article: {
    author: {
      logo: string,
      nickname: string,
      followers: number,
      account_id: number
    },
    thumbnail: string,
    title: string,
    id: string,
    tags: string
  }
}>()
const router = useRouter();
const handleProfileClick = () => {
  router.push(`/profile/${props.article.author.account_id}`);
}
const handleArticleClick = () => {
  router.push(`/article-detail/${props.article.id}`);
}
</script>

<template>
  <div>
    <div class="flex flex-col border border-secondary bg-bg rounded-sm w-[360px] p-6 gap-7">
      <div class="flex gap-2">
        <div class="cursor-pointer" @click.prevent="handleProfileClick"><img :src="article.author.logo" alt="/Logo.png" class="w-10 h-10 rounded-full object-cover" /></div>
        <div class="font-bold">
          <p class="text-text">
            <div class="cursor-pointer" @click.prevent="handleProfileClick">{{ article.author.nickname }}</div>
          </p>
          <p class="text-text-secondary cursor-default">{{ article.author.followers }} obserwujących</p>
        </div>
      </div>
      <div>
        <p class="text-text font-bold underline cursor-pointer" @click.prevent="handleArticleClick">{{ article.title }}</p>
      </div>
      <div class="flex justify-center h-[220px]"><img :src="article.thumbnail" alt="Logo" class="w-full h-full object-cover"/></div>
      <Tag class="cursor-default" :tags="article.tags" />
    </div>
  </div>
</template>
