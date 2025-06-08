<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Header from '@/components/Header.vue'
import { useRouter } from 'vue-router'

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
const articlePhoto = ref<File | null>(null)

const alertState = ref<{ message: string; type: 'success' | 'error' } | null>(null)

const router = useRouter()

onMounted(() => {
  const storedUserData = localStorage.getItem('user')
  if (!storedUserData || !JSON.parse(storedUserData).profile?.nickname) {
    alertState.value = { 
      message: 'Aby utworzyć artykuł, musisz najpierw utworzyć profil.', 
      type: 'error' 
    };
    router.push('/settings');
    return;
  }

  const url = '/api/home'
  axiosInstance.get(url).then(response => {
  }).catch(error => {
    console.error('Błąd podczas pobierania danych:', error)
  })
})


const handleContinue = () => {
  if (!articleTitle.value.trim() || !articleContent.value.trim()) {
    alertState.value = { message: 'Tytuł i treść muszą być wypełnione, aby przejść dalej.', type: 'error' }
    return
  }
  
  currentStep.value = 2
}

const handlePhotoSelected = (file: File | null) => {
  articlePhoto.value = file;
};

const handlePublish = async () => {
  const formData = new FormData();
  formData.append('title', articleTitle.value);
  formData.append('content', articleContent.value);
  formData.append('tags', JSON.stringify(articleTags.value ? articleTags.value.split(',').map(tag => tag.trim()) : []));
  
  if (articlePhoto.value) {
    formData.append('photo', articlePhoto.value);
  }

  try {
    const response = await axiosInstance.post('/api/article', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Artykuł opublikowany:', response.data);
    alertState.value = { message: 'Artykuł został pomyślnie opublikowany!', type: 'success' };
    router.push('/');
  } catch (error) {
    console.error('Błąd podczas publikowania artykułu:', error);
    alertState.value = { message: 'Wystąpił błąd podczas publikowania artykułu.', type: 'error' };
  }
};

const handleBack = () => {
  currentStep.value = 1;
};

const closeAlert = () => {
  alertState.value = null
}

const updateTitle = (value: string) => { articleTitle.value = value }
const updateContent = (value: string) => { articleContent.value = value }
const updateTags = (value: string) => { articleTags.value = value }

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
          <AddPhotoSection @photo-selected="handlePhotoSelected" />
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