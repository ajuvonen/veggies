<script setup lang="ts">
import {useActivityStore} from '@/stores/activityStore';
import Button from '@/components/Button.vue';
import {useRouter} from 'vue-router';

const router = useRouter();

const {$reset} = useActivityStore();

const reset = () => {
  $reset();
  router.push({name: 'home'});
};
</script>

<template>
  <Button variant="danger" icon="trashCan" @click="reset()">{{ $t('general.reset') }}</Button>
</template>

<style scoped lang="scss"></style>
