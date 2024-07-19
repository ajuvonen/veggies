<script setup lang="ts">
import {useRouter} from 'vue-router';
import {useActivityStore} from '@/stores/activityStore';
import LocaleChanger from '@/components/LocaleChanger.vue';

const router = useRouter();

const {$reset} = useActivityStore();

const reset = () => {
  $reset();
  router.push({name: 'home'});
};
</script>

<template>
  <h1>{{ $t('settings.title') }}</h1>
  <LocaleChanger />
  <ButtonComponent variant="danger" icon="trashCan" @click="reset()">{{
    $t('general.reset')
  }}</ButtonComponent>
</template>
