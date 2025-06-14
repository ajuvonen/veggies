<script lang="ts" setup>
import {ref} from 'vue';
import {useScreen} from '@/hooks/screen';

const elem = ref<HTMLDivElement | null>(null);
const {maxHeight, visualHeight} = useScreen(elem);

defineExpose({visualHeight, maxHeight});
</script>
<template>
  <div ref="elem">Hello World!</div>
</template>
