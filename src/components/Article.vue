<script setup lang="ts">
import {defineProps, ref } from 'vue'
import Tag from './Tag.vue'
import { useRouter } from 'vue-router';
import Alert from './Alert.vue';

const props = defineProps<{
  article: {
    author: {
      logo: string,
      nickname: string,
      followers: number,
      account_id: number
    },
    thumbnail: string,
    title: string,
    id: string,
    tags: string
  }
}>()
const router = useRouter();
const alert = ref<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
const role = ref(localStorage.getItem('userRole') || 'guest');

const handleProfileClick = () => {
  if (role.value === 'guest') {
    alert.value = { 
      message: 'Aby zobaczyć profil użytkownika, musisz się zalogować.', 
      type: 'info' 
    };
    return;
  }
  router.push(`/profile/${props.article.author.nickname}`);
}
const handleArticleClick = () => {
  router.push(`/article-detail/${props.article.id}`);
}
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = '/NoImage.png';
};
const handleAuthorImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = '/Avatar.png';
};

const closeAlert = () => {
  alert.value = null;
};
</script>

<template>
  <div>
    <div class="flex flex-col border border-secondary bg-bg rounded-sm w-[360px] p-6 gap-7">
      <div class="flex gap-2">
        <div class="cursor-pointer" @click.prevent="handleProfileClick">
          <img 
            :src="article.author.logo || '/Avatar.png'" 
            alt="Avatar" 
            class="w-10 h-10 rounded-full object-cover"
            @error="handleAuthorImageError"
            crossorigin="anonymous"
            referrerpolicy="no-referrer"
          />
        </div>
        <div class="font-bold">
          <p class="text-text">
            <div class="cursor-pointer" @click.prevent="handleProfileClick">{{ article.author.nickname }}</div>
          </p>
          <p class="text-text-secondary cursor-default">{{ article.author.followers }} subskrybujących</p>
        </div>
      </div>
      <div>
        <p class="text-text font-bold underline cursor-pointer" @click.prevent="handleArticleClick">{{ article.title }}</p>
      </div>
      <div class="flex justify-center h-[220px]">
        <img 
          :src="article.thumbnail || '/NoImage.png'" 
          :alt="article.title" 
          class="w-full h-full object-cover"
          @error="handleImageError"
          crossorigin="anonymous"
          referrerpolicy="no-referrer"
        />
      </div>
      <Tag class="cursor-default" :tags="article.tags" />
    </div>
    <Alert 
      v-if="alert"
      :message="alert.message"
      :type="alert.type"
      :duration="3000"
      @close="closeAlert"
    />
  </div>
</template>
