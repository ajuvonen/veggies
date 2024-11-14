<script setup lang="ts">
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import {useActivityStore} from '@/stores/activityStore';
import {useAppStateStore} from '@/stores/appStateStore';
import LocaleChanger from '@/components/LocaleChanger.vue';
import ModalDialog from '@/components/ModalDialog.vue';
import QAComponent from '@/components/QAComponent.vue';
import BuildTime from '@/components/BuildTime.vue';

const router = useRouter();

const {$reset: activityReset} = useActivityStore();
const {$reset: appStateReset} = useAppStateStore();

const resetDialogOpen = ref(false);

const reset = () => {
  activityReset();
  appStateReset();
  router.push({name: 'home'});
};
</script>

<template>
  <h1 class="sr-only">{{ $t('views.settings') }}</h1>
  <LocaleChanger />
  <QAComponent />
  <ContentElement
    :title="$t('settings.reset.title')"
    :labelAttrs="{for: 'reset-button'}"
    labelTag="label"
  >
    <ButtonComponent
      id="reset-button"
      variant="danger"
      icon="trashCan"
      data-test-id="reset-button"
      class="self-end"
      @click="resetDialogOpen = true"
      >{{ $t('settings.reset.button') }}</ButtonComponent
    >
  </ContentElement>
  <BuildTime />
  <ModalDialog v-model="resetDialogOpen" :title="$t('settings.reset.title')">
    <template #content>
      <p>{{ $t('settings.reset.text') }}</p>
    </template>
    <template #buttons>
      <ButtonComponent data-test-id="cancel-button" @click="resetDialogOpen = false">{{
        $t('general.cancel')
      }}</ButtonComponent>
      <ButtonComponent
        data-test-id="confirm-button"
        variant="danger"
        icon="trashCan"
        @click="reset()"
        >{{ $t('settings.reset.button') }}</ButtonComponent
      >
    </template>
  </ModalDialog>
</template>
