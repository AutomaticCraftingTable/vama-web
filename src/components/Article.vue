<script setup lang="ts">
import {defineProps } from 'vue'
import Tag from './Tag.vue'

const props = defineProps<{
  article: {
    author:{
      logo: string,
      nickname:string,
      followers: number
    },
    thumbnail: string,
    title: string,
    tags: string
  }
}>()
</script>

<template>
  <div>
    <div class="Card flex flex-col border border-secondary bg-bg rounded-sm max-w-sm p-6 gap-7">
      <div class="AuthorInfo flex gap-2">
        <a href="/Profile"><img :src="article.author.logo" alt="/Logo.png" class="w-10 h-10 rounded-full object-cover" /></a>
        <div class="NickFollows font-bold">
          <p class="text-text">{{ article.author.nickname }}</p>
          <p class="text-text-secondary">{{ article.author.followers }} obserwujących</p>
        </div>
      </div>
      <div>
        <p class="text-text font-bold underline">{{ article.title }}</p>
      </div>
      <div class="flex justify-center"><img :src="article.thumbnail" alt="Logo"/></div>
      <Tag :tags="article.tags" />
    </div>
  </div>
</template>