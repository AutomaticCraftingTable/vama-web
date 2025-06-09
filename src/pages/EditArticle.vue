<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Header from '@/components/Header.vue'
import { useRouter, useRoute } from 'vue-router'
import SideBar from '@/components/SideBar.vue'
import axiosInstance from '@/axiosInstance'
import TitleContentInput from '@/components/TitleContentInput.vue'
import AddPhotoSection from '@/components/AddPhotoSection.vue'
import PublishButton from '@/components/PublishButton.vue'
import ContinueButton from '@/components/ContinueButton.vue'
import AddTagsSection from '@/components/AddTagsSection.vue'
import Alert from '@/components/Alert.vue'

const role = ref(localStorage.getItem('userRole') || 'guest')
const currentStep = ref(1)

const articleTitle = ref('')
const articleContent = ref('')
const articleTags = ref('')
const articlePhoto = ref<string | null>(null)

const alertState = ref<{ message: string; type: 'success' | 'error' } | null>(null)

const router = useRouter()
const route = useRoute()

onMounted(async () => {
  const storedUserData = localStorage.getItem('user')
  if (!storedUserData || !JSON.parse(storedUserData).profile?.nickname) {
    alertState.value = { 
      message: 'Aby edytować artykuł, musisz najpierw utworzyć profil.', 
      type: 'error' 
    };
    router.push('/settings');
    return;
  }

  try {
    const { data } = await axiosInstance.get(`/api/article/${route.params.id}`);
    if (!data) {
      throw new Error('Nie znaleziono artykułu');
    }

    articleTitle.value = data.title;
    articleContent.value = data.content;
    articleTags.value = data.tags;
    articlePhoto.value = data.thumbnail;
  } catch (error) {
    console.error('Błąd podczas pobierania danych:', error);
    alertState.value = { 
      message: 'Wystąpił błąd podczas ładowania artykułu. Spróbuj odświeżyć stronę.', 
      type: 'error' 
    };
    setTimeout(() => {
      router.push('/');
    }, 3000);
  }
})

const handleContinue = () => {
  if (!articleTitle.value.trim() || !articleContent.value.trim()) {
    alertState.value = { message: 'Tytuł i treść muszą być wypełnione, aby przejść dalej.', type: 'error' }
    return
  }
  
  currentStep.value = 2
}

const handlePhotoSelected = (url: string | null) => {
  articlePhoto.value = url;
};

const handlePublish = async () => {
  try {
    const photoUrl = articlePhoto.value?.trim();
    console.log('Oryginalny URL zdjęcia:', articlePhoto.value);
    console.log('Przetworzony URL zdjęcia:', photoUrl);

    const articleData = {
      title: articleTitle.value,
      content: articleContent.value,
      tags: articleTags.value || '',
      thumbnail: photoUrl || null
    };

    console.log('Wysyłane dane:', articleData);

    const response = await axiosInstance.put(`/api/article/${route.params.id}`, articleData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('Odpowiedź z serwera:', response.data);

    alertState.value = { message: 'Artykuł został pomyślnie zaktualizowany!', type: 'success' };
    router.push('/');
  } catch (error: any) {
    console.error('Błąd podczas aktualizacji:', error.response?.data);
    alertState.value = { 
      message: error.response?.data?.message || 'Wystąpił błąd podczas aktualizacji artykułu', 
      type: 'error' 
    };
  }
}

const handleBack = () => {
  currentStep.value = 1;
};

const closeAlert = () => {
  alertState.value = null
}
</script>

<template>
  <Header :role="role"></Header>
  <div class="flex flex-row h-screen bg-bg">
    <SideBar v-if="role !== 'guest'" />
    <div class="flex h-screen w-screen">
      <div class="flex-grow p-4 overflow-y-auto">
        <div v-if="currentStep === 1" class="flex flex-col h-full">
          <TitleContentInput 
            v-model:title="articleTitle"
            v-model:content="articleContent"
          />
          <div class="p-4">
            <ContinueButton @click="handleContinue"/>
          </div>
        </div>

        <div v-if="currentStep === 2" class="flex flex-col h-full">
          <div class="flex justify-between items-center mb-4">
            <button 
              @click="handleBack"
              class="bg-secondary text-text rounded px-4 py-2 hover:bg-secondary-hover transition-colors"
            >
              Wstecz
            </button>
          </div>
          <AddPhotoSection 
            :initial-photo-url="articlePhoto"
            @photo-selected="handlePhotoSelected" 
          />
          <AddTagsSection 
            v-model:tags="articleTags"
          />
          <div class="p-4">
            <PublishButton @publish="handlePublish"/>
          </div>
        </div>
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