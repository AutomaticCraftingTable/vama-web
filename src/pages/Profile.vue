<script setup lang="ts">
defineProps<{ msg: string }>()
</script>

<template>
  Profile
  <h1>{{ msg }}</h1>
</template>
