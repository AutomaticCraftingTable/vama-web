<script setup lang="ts">
import { defineProps} from 'vue';
import Tag from './Tag.vue';
import Edit from './Icons/Edit.vue';

const props = defineProps<{
  article: {
    title: string,
    thumbnail: string,
    tags: string
  }
}>()

</script>
<template>
  <div class="bg-bg rounded-md p-5 w-full">
    <p class="text-text font-bold text-lg mb-3 text-left block">{{ article.title }}</p>
    <div class="mb-3 w-full h-[220px] bg-secondary rounded overflow-hidden">
      <img :src="article.thumbnail" alt="No image" class="w-full h-full object-cover" />
    </div>
    <div class="flex flex-row items-center gap-2 mt-2 min-h-[40px] w-full">
      <div class="flex flex-wrap gap-2">
        <Tag :tags="article.tags" />
      </div>
      <div class="flex-1"></div>
      <button class="p-1 rounded">
        <Edit class="w-6 h-6 text-text-secondary" />
      </button>
    </div>
  </div>
</template> 