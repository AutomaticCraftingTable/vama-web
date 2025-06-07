<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Header from '@/components/Header.vue'

import SideBar from '@/components/SideBarHome.vue'
import axiosInstance from '@/axiosInstance'
import TitleContentInput from '@/components/TitleContentInput.vue'
import AddPhotoSection from '@/components/AddPhotoSection.vue'
import PublishButton from '@/components/PublishButton.vue'
import ContinueButton from '@/components/ContinueButton.vue'
import AddTagsSection from '@/components/AddTagsSection.vue'
import Alert from '@/components/Alert.vue'

const role = ref('guest')
const currentStep = ref(1)

const articleTitle = ref('')
const articleContent = ref('')
const articleTags = ref('')
const articlePhoto = ref<File | null>(null)

const alertState = ref<{ message: string; type: 'success' | 'error' } | null>(null)

onMounted(() => {
  const url = '/api/home'
  axiosInstance.get(url).then(response => {
    role.value = response.data.role
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

const handlePublish = async () => {
  const articleData = {
    title: articleTitle.value,
    content: articleContent.value,
    tags: articleTags.value ? articleTags.value.split(',').map(tag => tag.trim()) : [],
  }

  console.log('Dane do wysłania:', articleData)

  try {
    const response = await axiosInstance.post('/api/article', articleData)
    console.log('Artykuł opublikowany:', response.data)
    alertState.value = { message: 'Artykuł został pomyślnie opublikowany!', type: 'success' }
  } catch (error) {
    console.error('Błąd podczas publikowania artykułu:', error)
    alertState.value = { message: 'Wystąpił błąd podczas publikowania artykułu.', type: 'error' }
  }
}

const closeAlert = () => {
  alertState.value = null
}

const updateTitle = (value: string) => { articleTitle.value = value }
const updateContent = (value: string) => { articleContent.value = value }
const updateTags = (value: string) => { articleTags.value = value }

</script>

<template>
  <Header></Header>
  <div class="flex flex-row h-screen">
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
          <AddPhotoSection />
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