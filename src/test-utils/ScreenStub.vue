<script lang="ts" setup>
import {useTemplateRef} from 'vue';
import {useScreen} from '@/hooks/screen';

const elem = useTemplateRef('elem');
const {maxHeight, visualHeight} = useScreen(elem);

defineExpose({visualHeight, maxHeight});
</script>
<template>
  <div ref="elem">Hello World!</div>
</template>
