<script setup lang="ts">
import HeaderFullNotLogged from '@/components/HeaderFullLogged.vue'
import Article from '@/components/Article.vue'
import SideBar from '@/components/SideBarHome.vue'
defineProps<{ msg?: string }>()
</script>

<template>
  <HeaderFullNotLogged></HeaderFullNotLogged>
  <div class="flex">
    <SideBar></SideBar>
    <div class="flex ml-7 gap-7 mt-7">
    <Article></Article>
    <Article></Article>
    </div>
  </div>
</template>
