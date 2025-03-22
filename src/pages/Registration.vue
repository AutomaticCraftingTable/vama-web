<script setup lang="ts">
import HeaderFull from '@/components/HeaderFull.vue'
import RegisterForm from '@/components/RegisterForm.vue'
defineProps<{ msg?: string }>()
</script>

<template>
  <HeaderFull></HeaderFull>
  <RegisterForm></RegisterForm>
</template>
