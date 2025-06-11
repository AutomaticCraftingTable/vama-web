<script setup lang="ts">
import {ref, onMounted} from 'vue'
import Header from '@/components/Header.vue'
import SideBar from '@/components/SideBar.vue'
import SubscriberCard from '@/components/SubscriberCard.vue'
import axiosInstance from '@/axiosInstance'
import Alert from '@/components/Alert.vue'

interface Profile {
  nickname: string;
  account_id: number;
  description: string | null;
  logo: string | null;
  followers: number;
  created_at: string;
  updated_at: string;
}

interface Subscription {
  id: number;
  author: Profile;
  created_at: string;
}

interface ApiResponse {
  role: 'guest' | 'user' | 'moder';
  state: 'hasProfile' | 'banned' | 'unverified';
  token: string;
  profile?: Profile;
  subscriptions: Subscription[];
}

const subscribers = ref<Subscription[]>([]);
const role = ref(localStorage.getItem('userRole') || 'guest');
const alert = ref<{ message: string; type: 'success' | 'error' } | null>(null);
const isLoading = ref(false);

onMounted(async () => {
  try {
    isLoading.value = true;
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Brak tokenu autoryzacji');
    }


    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const url = '/api/home/subscriptions';
    const response = await axiosInstance.get<ApiResponse>(url);
    subscribers.value = response.data.subscriptions;
  } catch (error) {
    if (error instanceof Error && error.message === 'Brak tokenu autoryzacji') {
      window.location.href = '/login';
      return;
    }
    alert.value = {message: 'Wystąpił błąd podczas pobierania subskrybentów', type: 'error'};
  } finally {
    isLoading.value = false;
  }
});

const handleRemoveSubscriber = async (subscriberId: number) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Brak tokenu autoryzacji');
    }

    const subscriber = subscribers.value.find(sub => sub.author.account_id === subscriberId);
    if (!subscriber) {
      throw new Error('Nie znaleziono subskrybenta');
    }
    await axiosInstance.delete(`/api/profile/${subscriber.author.nickname}/subscribe`);
    subscribers.value = subscribers.value.filter((sub) => sub.author.account_id !== subscriberId);
    alert.value = {message: 'Usunięto subskrybenta', type: 'success'};
  } catch (error) {
    if (error instanceof Error && error.message === 'Brak tokenu autoryzacji') {
      window.location.href = '/login';
      return;
    }
    alert.value = {
      message: error instanceof Error && error.message === 'Nie znaleziono subskrybenta'
          ? 'Nie znaleziono subskrybenta'
          : 'Wystąpił błąd podczas usuwania subskrybenta',
      type: 'error'
    };
  }
};
</script>

<template>
  <Header :role="role"></Header>
  <div class="flex h-screen bg-bg">
    <SideBar v-if="role !== 'guest'"/>
    <div class="flex flex-col gap-4 mt-4 p-4 flex-grow">
      <SubscriberCard
          v-for="subscriber in subscribers"
          :key="subscriber.id"
          :subscriber="subscriber.author"
          @remove-subscriber="handleRemoveSubscriber"
      />
      <div v-if="subscribers.length === 0" class="text-text-dimmed text-center w-full">
        Brak subskrybentów.
      </div>
    </div>
  </div>
  <Alert v-if="alert" :message="alert.message" :type="alert.type" :duration="3000" @close="alert = null"/>
</template>