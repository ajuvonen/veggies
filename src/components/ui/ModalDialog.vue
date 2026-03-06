<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from 'reka-ui';

const model = defineModel<boolean>({required: true});
defineProps<{
  title: string;
}>();

const checkIfModalClick = (event: Event) => {
  const element = event.target as HTMLElement;
  if (element.closest('.modal-dialog, .toast-container') !== null) {
    event.preventDefault();
  }
};
</script>
<template>
  <DialogRoot v-model:open="model">
    <DialogPortal>
      <DialogOverlay class="modal-dialog__overlay" />

      <DialogContent
        :aria-describedby="undefined"
        class="modal-dialog"
        data-test-id="dialog"
        @interactOutside="checkIfModalClick"
      >
        <div class="modal-dialog__header outline-override">
          <DialogTitle class="modal-dialog__title" data-test-id="dialog-title">
            {{ title }}
          </DialogTitle>
          <DialogClose v-if="!$slots.buttons" asChild>
            <ButtonComponent
              :variant="['text', 'alternative']"
              :aria-label="$t('general.close')"
              icon="close"
              data-test-id="dialog-close-button"
            />
          </DialogClose>
        </div>
        <div class="modal-dialog__content outline-override">
          <slot name="content" />
        </div>
        <div class="modal-dialog__buttons outline-override">
          <slot name="buttons" />
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
<style scoped>
.modal-dialog__overlay {
  @apply fixed inset-0 z-20 backdrop-blur-sm;
  @apply bg-black/30;
}

.modal-dialog {
  @apply fixed z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-xl max-h-[calc(100%-2rem)] rounded-md p-4 shadow-xl !pointer-events-auto;
  @apply flex flex-col gap-4;
  @apply bg-[--color-bg-alternative] text-[--color-text-alternative];
  &[data-state='open'] {
    animation: fadeIn 200ms ease-out;
  }

  &[data-state='closed'] {
    animation: fadeOut 200ms ease-out;
  }
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

.modal-dialog__buttons {
  @apply flex-container justify-end;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
