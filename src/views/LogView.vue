<script setup lang="ts">
import ComboBox from '@/components/ComboBox.vue';
import {onMounted, ref} from 'vue';

const comboBox = ref<InstanceType<typeof ComboBox> | null>(null);

onMounted(() => {
  comboBox.value?.focus();
});
</script>
<template>
  <ComboBox ref="comboBox" :ingredients="['carrot', 'corn', 'lettuce']" />
</template>
