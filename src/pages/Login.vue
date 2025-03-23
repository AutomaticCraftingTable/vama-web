<script setup lang="ts">
import HeaderFull from '@/components/HeaderFull.vue'
import LoginForm from '@/components/LoginForm.vue'
defineProps<{ msg?: string }>()
</script>

<template>
  <HeaderFull></HeaderFull>
  <LoginForm></LoginForm>
</template>
