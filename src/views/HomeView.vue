<script setup lang="ts">
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import {storeToRefs} from 'pinia';
import {DateTime} from 'luxon';
import {useActivityStore} from '@/stores/activityStore';
import ButtonComponent from '@/components/ButtonComponent.vue';
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
  <p class="welcome__paragraph">
    {{ $t('welcome.paragraph') }}
  </p>
  <p class="welcome__paragraph flex gap-2">
    <ButtonComponent @click="dialogOpen = true">{{ $t('welcome.info') }}</ButtonComponent>
    <ButtonComponent @click="start()">{{ $t('general.start') }}</ButtonComponent>
  </p>
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
  @apply md:text-7xl md:text-center;
}

.welcome__paragraph {
  @apply mt-10 text-center;
}
</style>
