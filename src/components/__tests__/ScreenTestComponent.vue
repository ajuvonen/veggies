<script lang="ts" setup>
import {ref} from 'vue';
import {useScreen} from '@/hooks/screen';

const props = withDefaults(defineProps<{padding?: number}>(), {padding: 1});

const elem = ref<HTMLDivElement | null>(null);
const {maxHeightStyle, visualHeight} = useScreen(elem, props.padding);

defineExpose({visualHeight, maxHeightStyle});
</script>
<template>
  <div ref="elem">Hello World!</div>
</template>
