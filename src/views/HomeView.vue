<script setup lang="ts">
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import {storeToRefs} from 'pinia';
import {DateTime} from 'luxon';
import {useActivityStore} from '@/stores/activityStore';
import ModalDialog from '@/components/ModalDialog.vue';

const router = useRouter();

const {settings} = storeToRefs(useActivityStore());

const dialogOpen = ref(false);

const start = () => {
  settings.value.startDate = DateTime.now().startOf('week');
  router.replace({name: 'log'});
};
</script>
<template>
  <h1 class="welcome__title">{{ $t('general.appTitle') }}</h1>
  <p class="sm:text-center">
    {{ $t('welcome.paragraph') }}
  </p>
  <div class="flex gap-2">
    <ButtonComponent @click="dialogOpen = true">{{ $t('welcome.info') }}</ButtonComponent>
    <ButtonComponent @click="start()">{{ $t('general.start') }}</ButtonComponent>
  </div>
  <ModalDialog :open="dialogOpen" :title="$t('welcome.infoTitle')" @close="dialogOpen = false">
    <template #content>
      {{ $t('welcome.infoContent') }}
    </template>
  </ModalDialog>
</template>
<style scoped lang="scss">
.welcome__title {
  font-family: 'Bungee Shade', system-ui;
  font-size: 16vw;
  text-transform: uppercase;
  @apply sm:text-7xl sm:text-center;
}
</style>
