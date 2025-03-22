<script setup lang="ts">
import { ref } from 'vue'

</script>

<template>
  <div class="Card flex items-center border border-gray-300 rounded-md max-w-sm p-6 gap-5">
    <div class="AuthorInfo flex gap-2">
      <a href="Profile.vue"><img src="/vite.svg"/></a>
      <div class="NickFollows flex-col font-bold">
        <p>Nickname</p>
        <p class="text-gray-500">69 obserwujących</p>
      </div>
    </div>
    <div>
      <p class="text-gray-500">Naprawiam UI duolin go </p>
    </div>
  </div>
</template>
