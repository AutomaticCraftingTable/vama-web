<script setup lang="ts">
import { ref } from 'vue'
import HeaderFullNotLogged from '@/components/HeaderFullNotLogged.vue'
import HeaderFullLogged from '@/components/HeaderFullLogged.vue'
import Article from '@/components/Article.vue'
import SideBar from '@/components/SideBarHome.vue'


const isLoggedIn = ref(true)

defineProps<{ msg?: string }>()
</script>

<template>
  <component :is="isLoggedIn ? HeaderFullLogged : HeaderFullNotLogged" />
  
  <div class="flex h-screen bg-bg">
    <SideBar v-if="isLoggedIn" />
    <div :class="['flex gap-7 mt-7', isLoggedIn ? 'ml-7' : 'ml-7']">
      <Article />
      <Article />
    </div>
  </div>
</template>
