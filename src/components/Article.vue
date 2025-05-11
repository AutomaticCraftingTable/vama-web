<script setup lang="ts">
import {defineProps } from 'vue'
import Tag from './Tag.vue'

const props = defineProps<{
  article: {
    author: string,
    title: string,
    tags: string
  }
}>()
</script>

<template>
  <div>
    <div class="Card flex flex-col border border-secondary bg-bg rounded-sm max-w-sm p-6 gap-7">
      <div class="AuthorInfo flex gap-2">
        <a href="Profile.vue"><img src="/Logo.png"/></a>
        <div class="NickFollows font-bold">
          <p class="text-text">{{ article.author }}</p>
          <p class="text-text-secondary">69 obserwujących</p>
        </div>
      </div>
      <div>
        <p class="text-text font-bold underline">{{ article.title }}</p>
      </div>
      <div class="flex justify-center"><img src="/NoImage.png"></div>
      <Tag :tags="article.tags" />
    </div>
  </div>
</template>