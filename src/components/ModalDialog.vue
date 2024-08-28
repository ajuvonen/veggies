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
    <Dialog static class="relative z-10" @close="model = false">
      <!-- The backdrop, rendered as a fixed sibling to the panel container -->
      <div class="modal-dialog__backdrop" aria-hidden="true" />
      <!-- Full-screen container to center the panel -->
      <div class="modal-dialog__container">
        <DialogPanel class="modal-dialog outline-override">
          <ButtonComponent
            :aria-label="$t('general.close')"
            class="modal-dialog__close-button"
            variant="text"
            icon="close"
            data-test-id="close-button"
            @click="model = false"
          />
          <DialogTitle as="h2" class="modal-dialog__title">{{ title }}</DialogTitle>
          <div class="modal-dialog__content outline-override">
            <slot name="content"></slot>
          </div>
          <div class="modal-dialog__buttons outline-override">
            <slot name="buttons"> </slot>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
<style lang="scss" scoped>
.modal-dialog__backdrop {
  @apply fixed inset-0;
  @apply bg-black/30;
}

.modal-dialog__container {
  @apply fixed inset-0 w-screen p-4;
  @apply flex items-center justify-center;
}

.modal-dialog {
  @apply w-full max-w-xl max-h-full rounded-md p-4 shadow-xl relative;
  @apply flex flex-col gap-4;
  @apply bg-slate-50;
}

.modal-dialog__title {
  @apply text-lg leading-6;
}

.modal-dialog__content {
  @apply has-scroll;
  @apply flex flex-col gap-4;
  scrollbar-color: initial;
}

.modal-dialog__title,
.modal-dialog__content {
  @apply text-slate-900;
}

.modal-dialog__close-button {
  @apply absolute right-4 top-4;
  @apply fill-slate-700;
}

.modal-dialog__buttons {
  @apply flex-container justify-end;
}
</style>
