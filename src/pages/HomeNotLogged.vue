<script setup lang="ts">
import HeaderFullNotLogged from '@/components/HeaderFullNotLogged.vue'
import Article from '@/components/Article.vue'
defineProps<{ msg?: string }>()
</script>

<template>
  <HeaderFullNotLogged></HeaderFullNotLogged>
  <div class="flex ml-7 gap-7 mt-7">
  <Article></Article>
  <Article></Article>
  </div>
</template>
