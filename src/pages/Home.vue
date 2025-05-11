<script setup lang="ts">

import Header from '@/components/Header.vue'
import Article from '@/components/Article.vue'
import SideBar from '@/components/SideBarHome.vue'


defineProps<{ msg?: string }>()
</script>

<template>
  <Header></Header>
  <router-view />
  <div class="flex h-screen">
      <SideBar/>
      <Article />
  </div>
</template>
