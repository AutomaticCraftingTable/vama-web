<script setup lang="ts">
import { ref } from 'vue'
import Header from '@/components/Header.vue'
import RegisterForm from '@/components/RegisterForm.vue'

const role = ref(localStorage.getItem('userRole') || 'guest')
</script>

<template>
  <Header :role="role"></Header>
  <RegisterForm />
</template>
