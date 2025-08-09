<script setup lang="ts">
import {Dialog, DialogPanel, DialogTitle, TransitionRoot} from '@headlessui/vue';

const model = defineModel<boolean>({required: true});
defineProps<{
  title: string;
}>();
</script>
<template>
  <TransitionRoot
    :show="model"
    as="template"
    enter="duration-200 ease-out"
    enter-from="opacity-0"
    enter-to="opacity-100"
    leave="duration-200 ease-in"
    leave-from="opacity-100"
    leave-to="opacity-0"
  >
    <Dialog static class="relative z-20" @close="model = false">
      <!-- The backdrop, rendered as a fixed sibling to the panel container -->
      <div class="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <!-- Full-screen container to center the panel -->
      <div class="modal-dialog__container">
        <DialogPanel data-test-id="dialog" class="modal-dialog shadow-lg">
          <div class="modal-dialog__header outline-override">
            <DialogTitle as="h2" class="modal-dialog__title">{{ title }}</DialogTitle>
            <ButtonComponent
              v-if="!$slots.buttons"
              :aria-label="$t('general.close')"
              class="fill-[--color-text-alternative]"
              variant="text"
              icon="close"
              data-test-id="dialog-close-button"
              @click="model = false"
            />
          </div>
          <div class="modal-dialog__content outline-override">
            <slot name="content" />
          </div>
          <div class="modal-dialog__buttons outline-override">
            <slot name="buttons" />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
<style scoped>
.modal-dialog__container {
  @apply fixed inset-0 w-screen p-4;
  @apply flex items-center justify-center;
}

.modal-dialog {
  @apply w-full max-w-xl max-h-full rounded-md p-4;
  @apply flex flex-col gap-4;
  @apply bg-[--color-bg-alternative];
}

.modal-dialog__title {
  @apply text-lg leading-6;
}

.modal-dialog__header {
  @apply flex-container items-center justify-between;
}

.modal-dialog__content {
  @apply has-scroll;
  @apply flex flex-col gap-4;
  scrollbar-color: initial;
}

.modal-dialog__title,
.modal-dialog__content {
  @apply text-[--color-text-alternative];
}

.modal-dialog__buttons {
  @apply flex-container justify-end;
}
</style>
