<template>
  <div class="flex flex-col space-y-4">
    <div>
      <label for="article-title" class="block text-lg font-bold mb-1">Tytuł</label>
      <input type="text" id="article-title" placeholder="Tytuł"
             class="w-full p-2 border border-gray-300 rounded-md"
             aria-label="Wpisz tytuł artykułu"
             :value="title"
             @input="updateTitle(($event.target as HTMLInputElement).value)">
    </div>
    <div>
      <label for="article-content" class="block text-lg font-bold mb-1">Artykuł zaczyna się tutaj...</label>
      <textarea id="article-content" placeholder="Artykuł zaczyna się tutaj..."
                class="w-full p-2 border border-gray-300 rounded-md min-h-[200px]"
                aria-label="Wpisz treść artykułu"
                :value="content"
                @input="updateContent(($event.target as HTMLTextAreaElement).value)"></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';


const props = defineProps({
  title: { type: String, default: '' },
  content: { type: String, default: '' },
});

const emit = defineEmits(['update:title', 'update:content']);

const updateTitle = (value: string) => {
  emit('update:title', value);
};

const updateContent = (value: string) => {
  emit('update:content', value);
};

</script>