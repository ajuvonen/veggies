<script setup lang="ts">
import {Dialog, DialogPanel, DialogTitle, TransitionRoot} from '@headlessui/vue';

defineEmits(['close']);
defineProps<{
  open: boolean;
  title: string;
}>();
</script>
<template>
  <TransitionRoot
    :show="open"
    as="template"
    enter="duration-200 ease-out"
    enter-from="opacity-0"
    enter-to="opacity-100"
    leave="duration-200 ease-in"
    leave-from="opacity-100"
    leave-to="opacity-0"
  >
    <Dialog @close="$emit('close')" class="relative z-10">
      <!-- The backdrop, rendered as a fixed sibling to the panel container -->
      <div class="modal-dialog__backdrop" aria-hidden="true" />
      <!-- Full-screen container to center the panel -->
      <div class="modal-dialog__container">
        <DialogPanel class="modal-dialog">
          <DialogTitle as="h2" class="modal-dialog__title">{{ title }}</DialogTitle>
          <div class="modal-dialog__content">
            <slot name="content"></slot>
          </div>
          <div class="modal-dialog__buttons outline-override flex-container">
            <slot name="buttons">
              <ButtonComponent @click="$emit('close')">{{ $t('general.close') }}</ButtonComponent>
            </slot>
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
  @apply w-full max-w-xl overflow-hidden rounded-md p-4 shadow-xl;
  @apply flex flex-col gap-4;
  @apply bg-slate-50;
}

.modal-dialog__title {
  @apply text-lg leading-6;
}

.modal-dialog__title,
.modal-dialog__content {
  @apply text-slate-900;
}

.modal-dialog__buttons {
  @apply justify-end;
}
</style>
