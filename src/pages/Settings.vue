<script setup lang="ts">
import { ref } from 'vue'
import Header from '@/components/Header.vue'
import SideBar from '@/components/SideBar.vue'
import EditProfile from '@/components/EditProfile.vue'

const role = ref(localStorage.getItem('userRole') || 'guest')
</script>

<template>
  <Header :role="role"></Header>
  <div class="flex min-h-screen bg-bg">
    <SideBar />
    <EditProfile />
  </div>
</template>