<template>
  <div class="flex flex-col space-y-4">
    <div class="flex flex-wrap gap-2">
      <div 
        v-for="tag in collectedTags" 
        :key="tag" 
        class="bg-secondary text-text rounded px-3 py-1 text-xs font-bold flex items-center gap-2"
      >
        <span>{{ tag }}</span>
        <button 
          @click="handleRemoveTag(tag)"
          class="text-text hover:text-danger transition-colors flex items-center justify-center"
          aria-label="Usuń tag"
        >
          <RemoveIcon class="w-4 h-4" />
        </button>
      </div>
    </div>
    <div class="relative">
      <input 
        type="text" 
        placeholder="Wpisz tag i naciśnij Enter..."
        class="w-full p-2 border border-secondary rounded-md bg-secondary text-text focus:outline-none focus:border-primary"
        aria-label="Wpisz nowy tag"
        v-model="currentInputTag"
        @keydown.enter.prevent="handleAddTag"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import RemoveIcon from './Icons/RemoveIcon.vue';

const props = defineProps<{
  tags: string
}>();

const emit = defineEmits<{
  (e: 'update:tags', value: string): void
}>();

const currentInputTag = ref('');
const collectedTags = ref<string[]>([]);

watch(() => props.tags, (newTags) => {
  if (newTags) {
    collectedTags.value = newTags.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '')
      .map(tag => tag.startsWith('#') ? tag : '#' + tag);
  }
}, { immediate: true });

const handleAddTag = () => {
  const tag = currentInputTag.value.trim();
  if (!tag) {
    return;
  }

  const formattedTag = tag.startsWith('#') ? tag : '#' + tag;

  if (!collectedTags.value.includes(formattedTag)) {
    collectedTags.value.push(formattedTag);
    emit('update:tags', collectedTags.value.map(tag => tag.replace('#', '')).join(','));
  }

  currentInputTag.value = '';
};

const handleRemoveTag = (tagToRemove: string) => {
  collectedTags.value = collectedTags.value.filter(tag => tag !== tagToRemove);
  emit('update:tags', collectedTags.value.map(tag => tag.replace('#', '')).join(','));
};

watch(collectedTags, (newTags) => {
  emit('update:tags', newTags.map(tag => tag.replace('#', '')).join(','));
}, { deep: true });
</script>