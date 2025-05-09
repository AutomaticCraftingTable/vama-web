<script setup lang="ts">
import { ref } from 'vue'
import Tag from './Tag.vue'

const tags = ref(['tag1', 'tag2', 'tag3', 'tag4'])
</script>

<template>
  <div>
    <div class="Card flex flex-col border border-secondary bg-bg rounded-sm max-w-sm p-6 gap-7">
      <div class="AuthorInfo flex gap-2">
        <a href="Profile.vue"><img src="/Logo.png"/></a>
        <div class="NickFollows font-bold">
          <p class="text-text">Nickname</p>
          <p class="text-text-secondary">69 obserwujących</p>
        </div>
      </div>
      <div>
        <p class="text-text font-bold underline">Naprawiam UI duolingo</p>
      </div>
      <div><img src="/NoImage.png"></div>
      <div class="flex flex-wrap gap-2 mt-2">
        <Tag v-for="(tag, idx) in tags" :key="tag + idx" :label="tag" />
      </div>
    </div>
  </div>
</template>
