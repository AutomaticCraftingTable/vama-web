<template>
  <div class="flex flex-col space-y-4">
    <div class="flex flex-wrap gap-2">
      <span v-for="tag in collectedTags" :key="tag" class="bg-gray-200 text-gray-700 text-sm font-semibold px-2.5 py-0.5 rounded-full">{{ tag }}</span>
    </div>
    <input type="text" placeholder="Wpisz tag..."
           class="w-full p-2 border border-gray-300 rounded-md"
           aria-label="Wpisz nowy tag"
           v-model="currentInputTag"
           @keydown.enter.prevent="handleAddTag">
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

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
watch(collectedTags, (newTags) => {
  emit('update:tags', newTags.map(tag => tag.replace('#', '')).join(','));
}, { deep: true });
</script>