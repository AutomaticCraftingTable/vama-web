<script setup lang="ts">
import Header from '@/components/Header.vue'
import RegisterForm from '@/components/RegisterForm.vue'
defineProps<{ msg?: string }>()
</script>

<template>
  <Header></Header>
  <RegisterForm></RegisterForm>
</template>
