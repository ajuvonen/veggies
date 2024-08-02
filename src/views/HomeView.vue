<script setup lang="ts">
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import {storeToRefs} from 'pinia';
import {DateTime} from 'luxon';
import {useActivityStore} from '@/stores/activityStore';
import ModalDialog from '@/components/ModalDialog.vue';
import HomeLocaleChanger from '@/components/HomeLocaleChanger.vue';

const router = useRouter();

const {settings} = storeToRefs(useActivityStore());

const dialogOpen = ref(false);

const start = () => {
  settings.value.startDate = DateTime.now().startOf('week');
  router.replace({name: 'log'});
};
</script>
<template>
  <div class="home__container">
    <HomeLocaleChanger />
    <h1 class="home__title">{{ $t('general.appTitle') }}</h1>
    <p class="sm:text-center">
      {{ $t('home.callout') }}
    </p>
    <div class="flex-container justify-center">
      <ButtonComponent @click="dialogOpen = true">{{ $t('home.info') }}</ButtonComponent>
      <ButtonComponent @click="start()">{{ $t('general.start') }}</ButtonComponent>
    </div>
    <ModalDialog :open="dialogOpen" :title="$t('home.infoTitle')" @close="dialogOpen = false">
      <template #content>
        <p>{{ $t('home.infoP1') }}</p>
        <p>{{ $t('home.infoP2') }}</p>
        <p>{{ $t('home.infoP3') }}</p>
      </template>
    </ModalDialog>
  </div>
</template>
<style scoped lang="scss">
.home__container {
  @apply flex flex-col gap-8 items-center justify-center;
  @apply h-full;
}

.home__title {
  font-family: 'Bungee Shade', system-ui;
  font-size: 16vw;
  @apply sm:text-7xl sm:text-center uppercase;
}
</style>
