<script setup lang="ts">
import {onMounted} from 'vue';

defineProps<{action: string}>();
const model = defineModel<string>({required: true});

onMounted(() => {
  model.value = 'test-turnstile-token';
});
</script>
<template>
  <div></div>
</template>
