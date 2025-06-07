<template>
  <div class="flex flex-col space-y-4">
    <div class="flex flex-wrap gap-2">
      <!-- Wyświetlanie dodanych tagów -->
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
import { ref } from 'vue';

// Zmienna stanu dla wartości pola input
const currentInputTag = ref('');

// Zmienna stanu dla listy zebranych tagów
const collectedTags = ref<string[]>([]);

// Metoda dodawania tagu po wciśnięciu Enter
const handleAddTag = () => {
  const tag = currentInputTag.value.trim();
  if (!tag) {
    return; // Ignoruj puste tagi
  }

  // Dodaj # jeśli brakuje
  const formattedTag = tag.startsWith('#') ? tag : '#' + tag;

  // Dodaj tag do listy, jeśli jeszcze go nie ma (opcjonalnie - unikalne tagi)
  if (!collectedTags.value.includes(formattedTag)) {
    collectedTags.value.push(formattedTag);
  }

  // Wyczyść pole input
  currentInputTag.value = '';
};

// W przyszłości można dodać emitowanie zdarzenia z listą tagów do rodzica
// defineEmits(['update:tags-list']);
// const emit = defineEmits(['update:tags-list']);
// W handleAddTag można wyemitować: emit('update:tags-list', collectedTags.value);

</script>

<style scoped>
/* Tailwind handles most styling */
</style> 