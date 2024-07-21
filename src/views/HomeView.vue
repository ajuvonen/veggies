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
  <div class="welcome__container">
    <h1 class="welcome__title">{{ $t('general.appTitle') }}</h1>
    <p class="sm:text-center">
      {{ $t('welcome.paragraph') }}
    </p>
    <div class="flex-container justify-center">
      <ButtonComponent @click="dialogOpen = true">{{ $t('welcome.info') }}</ButtonComponent>
      <ButtonComponent @click="start()">{{ $t('general.start') }}</ButtonComponent>
    </div>
    <ModalDialog :open="dialogOpen" :title="$t('welcome.infoTitle')" @close="dialogOpen = false">
      <template #content>
        {{ $t('welcome.infoContent') }}
      </template>
    </ModalDialog>
  </div>
</template>
<style scoped lang="scss">
.welcome__container {
  @apply flex flex-col gap-8 items-center justify-center;
  @apply h-full;
}

.welcome__title {
  font-family: 'Bungee Shade', system-ui;
  font-size: 16vw;
  @apply sm:text-7xl sm:text-center uppercase;
}
</style>
