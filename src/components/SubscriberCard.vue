<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { useRouter } from 'vue-router';
import RemoveIcon from './Icons/RemoveIcon.vue';

const props = defineProps<{
  subscriber: {
    nickname: string;
    account_id: number;
    description: string | null;
    logo: string | null;
    followers: number;
  };
}>();

const emit = defineEmits(['remove-subscriber']);
const router = useRouter();

const handleRemove = (event: MouseEvent) => {
  event.stopPropagation();
  emit('remove-subscriber', props.subscriber.account_id);
};

const handleClick = () => {
  router.push(`/profile/${props.subscriber.nickname}`);
};
</script>

<template>
  <div 
    @click="handleClick"
    class="flex items-center gap-4 p-4 border border-secondary rounded-md shadow-sm w-full mx-auto hover:bg-secondary transition-colors cursor-pointer"
  >
    <div class="flex-shrink-0 w-20 h-20 bg-secondary flex items-center justify-center rounded-sm overflow-hidden">
      <img 
        v-if="subscriber.logo" 
        :src="subscriber.logo" 
        :alt="subscriber.nickname" 
        class="w-full h-full object-cover" 
      />
      <img 
        v-else 
        src="/Avatar.png" 
        :alt="subscriber.nickname" 
        class="w-full h-full object-cover" 
      />
    </div>
    <div class="flex-grow">
      <h3 class="text-lg font-semibold text-text">{{ subscriber.nickname }}</h3>
      <p class="text-sm text-text-dimmed">{{ subscriber.followers }} obserwujących</p>
    </div>
    <button 
      @click.stop="handleRemove" 
      class="flex-shrink-0 text-text-dimmed hover:text-danger transition-colors p-2 rounded-full hover:bg-bg"
      aria-label="Usuń subskrybenta"
    >
      <RemoveIcon class="h-5 w-5" />
    </button>
  </div>
</template> 