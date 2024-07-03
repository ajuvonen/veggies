<script setup lang="ts">
import {storeToRefs} from 'pinia';
import {DateTime} from 'luxon';
import {useActivityStore} from '@/stores/activityStore';
import Button from '@/components/Button.vue';

const {settings} = storeToRefs(useActivityStore());

const start = () => {
  settings.value.startDate = DateTime.now().startOf('week').toJSDate();
};
</script>
<template>
  <h1 class="welcome__title">{{ $t('app-title') }}</h1>
  <p class="welcome__paragraph">
    {{ $t('welcome.paragraph') }}
  </p>
  <p class="welcome__paragraph">
    <Button @click="start()">{{ $t('general.start') }}</Button>
  </p>
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
