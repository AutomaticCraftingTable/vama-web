<script setup lang="ts">
import HeaderFullNotLogged from '@/components/HeaderFullNotLogged.vue'
import LoginForm from '@/components/LoginForm.vue'
defineProps<{ msg?: string }>()
</script>

<template>
  <HeaderFullNotLogged></HeaderFullNotLogged>
  <LoginForm></LoginForm>
</template>
