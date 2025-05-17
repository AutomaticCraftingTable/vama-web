<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import Heart from "./Icons/Heart.vue";
import Group from "./Icons/Group.vue";
import Add from "./Icons/Add.vue";

const isMobile = ref(window.innerWidth < 768);

const handleResize = () => {
  isMobile.value = window.innerWidth < 768;
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
});
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>
<template>
  <div v-if="!isMobile" class="flex flex-col gap-7 p-5 min-h-full rounded-sm border border-secondary">
    <router-link to="/Following">
      <button class="flex gap-3 cursor-pointer text-text text-nowrap"><Add class="w-6 h-6"/>Dodaj artykuł</button>
    </router-link>
    <router-link to="/YourArticles">
      <button class="flex gap-3 cursor-pointer text-text"><Group class="w-6 h-6"/>Subskrypcje</button>
    </router-link>
    <router-link to="/LikedArticles">
      <button class="flex gap-3 cursor-pointer text-text"><Heart class="w-6 h-6"/>Polubione</button>
    </router-link>
  </div>
  <div v-else class="fixed bottom-0 left-0 w-full bg-white border-t border-secondary z-50">
    <div class="flex justify-around items-center py-2">
      <router-link to="/YourArticles">
        <button><Group class="w-8 h-8" /></button>
      </router-link>
      <router-link to="/Following">
        <button><Add class="w-8 h-8" /></button>
      </router-link>
      <router-link to="/LikedArticles">
        <button><Heart class="w-8 h-8" /></button>
      </router-link>
    </div>
  </div>
  <router-view/>
</template>
