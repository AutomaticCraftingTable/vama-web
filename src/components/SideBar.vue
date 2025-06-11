<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import Heart from "./Icons/Heart.vue";
import Group from "./Icons/Group.vue";
import Add from "./Icons/Add.vue";
import { useRoute, useRouter } from 'vue-router';
import Alert from './Alert.vue';

const route = useRoute();
const router = useRouter();

const props = defineProps<{
  role?: string;
}>();

const isMobile = ref(window.innerWidth < 768);
const alert = ref<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

const getCurrentRole = () => localStorage.getItem('userRole') || 'guest';

const handleResize = () => {
  isMobile.value = window.innerWidth < 768;
};

const handleGuestAction = () => {
  alert.value = { 
    message: 'Aby wykonać tę akcję, musisz się zalogować.', 
    type: 'info' 
  };
};

const handleNavigation = (path: string) => {
  if (getCurrentRole() === 'guest') {
    handleGuestAction();
    return;
  }
  router.push(path);
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
  <div v-if="!isMobile && getCurrentRole() !== 'guest'" class="flex flex-col gap-4 p-5 min-h-full rounded-sm border border-secondary w-64">
    <button 
      @click="handleNavigation('/Following')" 
      :class="[
        'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
        isActive('/Following') ? 'bg-secondary text-text' : 'text-text-dimmed hover:bg-secondary'
      ]"
    >
      <Group :class="isActive('/Following') ? 'fill-current text-text' : 'fill-none stroke-text'" class="w-6 h-6"/>
      <span>Subskrypcje</span>
    </button>
    <button 
      @click="handleNavigation('/CreateArticle')" 
      :class="[
        'flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-nowrap', 
        isActive('/CreateArticle') ? 'bg-secondary text-text' : 'text-text-dimmed hover:bg-secondary'
      ]"
    >
      <Add :class="isActive('/CreateArticle') ? 'fill-none stroke-text stroke-[3]' : 'fill-none stroke-text stroke-[1.5]'" class="w-6 h-6"/>
      <span>Dodaj artykuł</span>
    </button>
    <button 
      @click="handleNavigation('/LikedArticles')" 
      :class="[
        'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
        isActive('/LikedArticles') ? 'bg-secondary text-text' : 'text-text-dimmed hover:bg-secondary'
      ]"
    >
      <Heart :class="[isActive('/LikedArticles') ? 'fill-current text-text' : 'fill-none stroke-text']" class="w-6 h-6"/>
      <span>Polubione</span>
    </button>
  </div>
  <div v-else-if="getCurrentRole() !== 'guest'" class="fixed bottom-0 left-0 w-full bg-bg border-t border-secondary z-50">
    <div class="flex justify-around items-center py-2">
      <button @click="handleNavigation('/Following')" class="p-2 rounded-full">
        <Group :class="isActive('/Following') ? 'fill-current text-text' : 'fill-none stroke-text'" class="w-8 h-8" />
      </button>
      <button @click="handleNavigation('/CreateArticle')" class="p-2 rounded-full">
        <Add :class="isActive('/CreateArticle') ? 'fill-none stroke-text stroke-[3]' : 'fill-none stroke-text stroke-[1.5]'" class="w-8 h-8" />
      </button>
      <button @click="handleNavigation('/LikedArticles')" class="p-2 rounded-full">
        <Heart :class="[isActive('/LikedArticles') ? 'fill-text stroke-text' : 'stroke-text fill-none']" class="w-8 h-8"/>
      </button>
    </div>
  </div>
  <Alert 
    v-if="alert" 
    :message="alert.message" 
    :type="alert.type" 
    :duration="3000" 
    @close="alert = null" 
  />
  <router-view/>
</template>
