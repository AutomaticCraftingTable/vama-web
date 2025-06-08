<script setup lang="ts">
import Header from '@/components/Header.vue'
import LoginForm from '@/components/LoginForm.vue'
defineProps<{ msg?: string }>()
</script>

<template>
  <Header></Header>
  <LoginForm></LoginForm>
</template>
