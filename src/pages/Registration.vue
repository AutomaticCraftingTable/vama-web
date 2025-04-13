<script setup lang="ts">
import HeaderFullNotLogged from '@/components/HeaderFullNotLogged.vue'
import RegisterForm from '@/components/RegisterForm.vue'
defineProps<{ msg?: string }>()
</script>

<template>
  <HeaderFullNotLogged></HeaderFullNotLogged>
  <RegisterForm></RegisterForm>
</template>
