<script setup lang="ts">
import {useActivityStore} from '@/stores/activityStore';
import ButtonComponent from '@/components/ButtonComponent.vue';
import {useRouter} from 'vue-router';

const router = useRouter();

const {$reset} = useActivityStore();

const reset = () => {
  $reset();
  router.push({name: 'home'});
};
</script>

<template>
  <ButtonComponent variant="danger" icon="trashCan" @click="reset()">{{
    $t('general.reset')
  }}</ButtonComponent>
</template>

<style scoped lang="scss"></style>
