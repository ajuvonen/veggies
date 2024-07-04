<script setup lang="ts">
import {ref} from 'vue';
import {storeToRefs} from 'pinia';
import {DateTime} from 'luxon';
import {useActivityStore} from '@/stores/activityStore';
import Button from '@/components/Button.vue';
import ModalDialog from '@/components/ModalDialog.vue';

const {settings} = storeToRefs(useActivityStore());

const dialogOpen = ref(false);

const start = () => {
  settings.value.startDate = DateTime.now().startOf('week');
};
</script>
<template>
  <h1 class="welcome__title">{{ $t('app-title') }}</h1>
  <p class="welcome__paragraph">
    {{ $t('welcome.paragraph') }}
  </p>
  <p class="welcome__paragraph flex gap-2">
    <Button @click="dialogOpen = true">{{ $t('welcome.info') }}</Button>
    <Button @click="start()">{{ $t('general.start') }}</Button>
  </p>
  <ModalDialog :open="dialogOpen" :title="$t('welcome.infoTitle')" @close="dialogOpen = false">
    <template #content>
      {{ $t('welcome.infoContent') }}
    </template>
    <template #buttons>
      <Button @click="dialogOpen = false">{{ $t('general.close') }}</Button>
    </template>
  </ModalDialog>
</template>
<style scoped lang="scss">
.welcome__title {
  font-family: 'Bungee Shade', system-ui;
  font-size: 16vw;
  text-transform: uppercase;
  @apply md:text-7xl md:text-center;
}

.welcome__paragraph {
  @apply mt-10 text-center;
}
</style>
