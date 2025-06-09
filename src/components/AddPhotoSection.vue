<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Alert from './Alert.vue';

interface AlertState {
  message: string;
  type: 'success' | 'error';
}

const props = defineProps<{
  initialPhotoUrl?: string | null;
}>();

const emit = defineEmits(['photo-selected']);
const photoUrl = ref<string>('');
const previewUrl = ref<string | null>(null);
const alertState = ref<AlertState | null>(null);

onMounted(() => {
  if (props.initialPhotoUrl) {
    photoUrl.value = props.initialPhotoUrl;
    previewUrl.value = props.initialPhotoUrl;
  }
});

const handleUrlChange = () => {
  if (!photoUrl.value) {
    previewUrl.value = null;
    emit('photo-selected', null);
    return;
  }

  try {
    const url = photoUrl.value.trim();
    new URL(url);
    previewUrl.value = url;
    emit('photo-selected', url);
  } catch (error) {
    alertState.value = { message: 'Proszę podać poprawny URL zdjęcia.', type: 'error' };
    photoUrl.value = '';
    previewUrl.value = null;
    emit('photo-selected', null);
  }
};

const removePhoto = () => {
  photoUrl.value = '';
  previewUrl.value = null;
  emit('photo-selected', null);
};

const closeAlert = () => {
  alertState.value = null;
};
</script>

<template>
  <div class="mb-6">
    <div class="mb-4">
      <label for="photo-url" class="block text-text text-sm font-bold mb-2">URL zdjęcia:</label>
      <input
        type="url"
        id="photo-url"
        v-model="photoUrl"
        placeholder="Wklej URL zdjęcia"
        class="shadow appearance-none border rounded w-full py-3 px-4 text-text leading-tight focus:outline-none focus:shadow-outline bg-secondary border-secondary"
        @change="handleUrlChange"
      />
    </div>
    <div 
      v-if="!previewUrl"
      class="border border-dashed border-gray-300 rounded-md p-8 flex items-center justify-center text-gray-500 min-h-[200px]"
    >
      Podgląd zdjęcia pojawi się tutaj po podaniu poprawnego URL
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
          class="absolute top-2 right-2 bg-danger text-white px-2 rounded-sm hover:bg-danger-hover transition-colors"
        >
          ×
        </button>
      </div>
    </div>
    <Alert 
      v-if="alertState"
      :message="alertState.message"
      :type="alertState.type"
      :duration="5000"
      @close="closeAlert"
    />
  </div>
</template>
