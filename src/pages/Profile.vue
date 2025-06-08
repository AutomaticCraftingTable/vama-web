<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axiosInstance from '@/axiosInstance';
import Header from '@/components/Header.vue';
import SideBar from '@/components/SideBar.vue';
import UserInfo from '@/components/UserInfo.vue';
import ArticleCard from '@/components/ArticleCard.vue';
import Alert from '@/components/Alert.vue';

const route = useRoute();
const router = useRouter();
const profile = ref<any>(null);
const role = ref(localStorage.getItem('userRole') || 'guest');
const alertState = ref<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
const articles = ref([])
const isCurrentUser = ref(false)

onMounted(async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const { data } = await axiosInstance.get(`/api/profile/${route.params.id || ''}`);
    profile.value = data;
    articles.value = data.articles

    const profileAccountId = data.profile.account_id
    const myAccountId = localStorage.getItem('account_id')
    isCurrentUser.value = myAccountId === profileAccountId
  } catch (error) {
    console.error('Błąd podczas pobierania danych:', error);
    alertState.value = { 
      message: 'Wystąpił błąd podczas ładowania profilu.', 
      type: 'error' 
    };
    setTimeout(() => {
      router.push('/');
    }, 3000);
  }
});

const closeAlert = () => {
  alertState.value = null;
};
</script>

<template>
  <Header :role="role" />
  <div class="flex bg-bg h-screen">
    <SideBar v-if="role !== 'guest'" />
    <div class="flex-1 p-5">
      <div v-if="profile">
        <UserInfo 
          :user="profile" 
          :isCurrentUser="isCurrentUser"
          :showBio="true"
          :role="role"
        />
        <div class="flex flex-wrap gap-6 justify-center md:justify-start">
          <ArticleCard
            v-for="(article, idx) in articles"
            :key="idx"
            :article="article"
            :is-current-user="isCurrentUser"
          />
        </div>
      </div>
      <div v-else class="flex items-center justify-center h-full">
        <p class="text-text-dimmed">Ładowanie profilu...</p>
      </div>
    </div>
  </div>
  <Alert 
    v-if="alertState"
    :message="alertState.message"
    :type="alertState.type"
    :duration="5000"
    @close="closeAlert"
  />
</template>
