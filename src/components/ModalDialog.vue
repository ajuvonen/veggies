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
          <div class="mt-4">
            <slot name="content"></slot>
          </div>
          <div v-if="$slots.buttons" class="modal-dialog__buttons">
            <slot name="buttons"></slot>
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
  @apply w-full max-w-md transform overflow-hidden rounded-md p-4 align-middle shadow-xl;
  @apply bg-white;
}

.modal-dialog__title {
  @apply text-lg font-medium leading-6;
  @apply text-gray-900;
}

.modal-dialog__buttons {
  @apply mt-4;
  @apply flex gap-2 justify-end;
}
</style>
