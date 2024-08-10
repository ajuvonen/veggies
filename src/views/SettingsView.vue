<script setup lang="ts">
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import {useActivityStore} from '@/stores/activityStore';
import {useAppStateStore} from '@/stores/appStateStore';
import LocaleChanger from '@/components/LocaleChanger.vue';
import ModalDialog from '@/components/ModalDialog.vue';

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
  <LocaleChanger />
  <div class="flex-container justify-center">
    <ButtonComponent
      variant="danger"
      icon="trashCan"
      data-test-id="reset-button"
      @click="resetDialogOpen = true"
      >{{ $t('general.reset') }}</ButtonComponent
    >
  </div>
  <ModalDialog
    :open="resetDialogOpen"
    :title="$t('settings.resetDialogTitle')"
    @close="resetDialogOpen = false"
  >
    <template #content>
      <p>{{ $t('settings.resetDialogText') }}</p>
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
        >{{ $t('general.reset') }}</ButtonComponent
      >
    </template>
  </ModalDialog>
</template>
