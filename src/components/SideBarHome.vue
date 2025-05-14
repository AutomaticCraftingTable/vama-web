<script setup lang="ts">
import Heart from "./Icons/Heart.vue";
import Group from "./Icons/Group.vue";
import Add from "./Icons/Add.vue";
</script>
<template>
  <div class="flex flex-col gap-7 p-5 min-h-full rounded-sm border border-secondary">
    <router-link to="/Following">
      <button class="flex gap-3 cursor-pointer text-text"><Add></Add>Dodaj artykuł</button>
    </router-link>
    <router-link to="/YourArticles">
      <button class="flex gap-3 cursor-pointer text-text"><Group></Group>Subskrypcje</button>
    </router-link>
    <router-link to="/LikedArticles">
      <button class="flex gap-3 cursor-pointer text-text"><Heart></Heart>Polubione</button>
    </router-link>
  </div>
  <router-view/>
</template>