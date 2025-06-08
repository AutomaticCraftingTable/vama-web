<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(['photo-selected']);
const selectedPhoto = ref<File | null>(null);
const previewUrl = ref<string | null>(null);

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    
    if (!file.type.startsWith('image/')) {
      alert('Proszę wybrać plik obrazu.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Plik jest zbyt duży. Maksymalny rozmiar to 5MB.');
      return;
    }

    selectedPhoto.value = file;
    previewUrl.value = URL.createObjectURL(file);
    emit('photo-selected', file);
  }
};

const handleClick = () => {
  document.getElementById('photo-input')?.click();
};

const removePhoto = () => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
  selectedPhoto.value = null;
  previewUrl.value = null;
  emit('photo-selected', null);
};
</script>

<template>
  <div class="mb-6">
    <input
      type="file"
      id="photo-input"
      accept="image/*"
      class="hidden"
      @change="handleFileSelect"
    />
    <div 
      v-if="!previewUrl"
      @click="handleClick"
      class="border border-dashed border-gray-300 rounded-md p-8 flex items-center justify-center text-gray-500 cursor-pointer hover:bg-secondary transition-colors min-h-[200px]"
    >
      + Dodaj zdjęcie
    </div>
    <div 
      v-else 
      class="relative w-full flex justify-center"
    >
      <div class="relative max-w-[800px] max-h-[600px] w-full">
        <img 
          :src="previewUrl" 
          class="w-full h-full object-contain rounded-md"
        />
        <button 
          @click="removePhoto"
          class="absolute top-2 right-2 bg-danger text-white p-2 rounded-full hover:bg-danger-hover transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  </div>
</template>
