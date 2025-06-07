<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import Heart from "./Icons/Heart.vue";
import Group from "./Icons/Group.vue";
import Add from "./Icons/Add.vue";
import { useRoute } from 'vue-router';

const route = useRoute();

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
const isActive = (path: string) => route.path === path;
</script>
<template>
  <div v-if="!isMobile" class="flex flex-col gap-4 p-5 min-h-full rounded-sm border border-secondary  w-64">
    <router-link 
      to="/CreateArticle" 
      :class="[
        'flex items-center gap-3 px-3 py-2 rounded-md transition-colors', isActive('/CreateArticle') ? 'bg-secondary text-text' : 'text-text-dimmed hover:bg-secondary']"
    >
      <Add :class="isActive('/CreateArticle') ? 'fill-current text-text' : 'fill-none stroke-text'" class="w-6 h-6"/>
      <span>Dodaj artykuł</span>
    </router-link>
    <router-link 
      to="/Following" 
      :class="[
        'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
        isActive('/Following') ? 'bg-secondary text-text' : 'text-text-dimmed hover:bg-secondary'
      ]"
    >
      <Group :class="isActive('/Following') ? 'fill-current text-text' : 'fill-none stroke-text'" class="w-6 h-6"/>
      <span>Subskrypcje</span>
    </router-link>
    
    <router-link 
      to="/LikedArticles" 
      :class="[
        'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
        isActive('/LikedArticles') ? 'bg-secondary text-text' : 'text-text-dimmed hover:bg-secondary'
      ]"
    >
      <Heart :class="[isActive('/LikedArticles') ? 'fill-current text-like' : 'fill-none stroke-text']" class="w-6 h-6"/>
      <span>Polubione</span>
    </router-link>
  </div>
  <div v-else class="fixed bottom-0 left-0 w-full bg-bg border-t border-secondary z-50">
    <div class="flex justify-around items-center py-2">
      <router-link to="/Following">
        <button class="p-2 rounded-full">
          <Group :class="isActive('/Following') ? 'fill-current text-text' : 'fill-none stroke-text'" class="w-8 h-8" />
        </button>
      </router-link>
      <router-link to="/CreateArticle">
        <button class="p-2 rounded-full">
          <Add :class="isActive('/CreateArticle') ? 'fill-current text-text' : 'fill-none stroke-text'" class="w-8 h-8" />
        </button>
      </router-link>
      <router-link to="/LikedArticles">
        <button class="p-2 rounded-full">
          <Heart :class="[isActive('/LikedArticles') ? 'fill-current text-text' : 'fill-none stroke-text']" class="w-8 h-8"/>
        </button>
      </router-link>
    </div>
  </div>
  <router-view/>
</template>
