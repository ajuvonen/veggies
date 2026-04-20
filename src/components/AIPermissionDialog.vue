<script setup lang="ts">
const model = defineModel<boolean>({required: true});
const emit = defineEmits<{resolve: [value: boolean]}>();

const resolve = (value: boolean) => {
  emit('resolve', value);
  model.value = false;
};
</script>
<template>
  <ModalDialog v-model="model" :title="$t('AIPermissionDialog.title')">
    <template #content>
      <p>{{ $t('AIPermissionDialog.message') }}</p>
    </template>
    <template #buttons>
      <ButtonComponent
        variant="secondary"
        data-test-id="ai-permission-deny-button"
        @click="resolve(false)"
      >
        {{ $t('AIPermissionDialog.deny') }}
      </ButtonComponent>
      <ButtonComponent data-test-id="ai-permission-allow-button" @click="resolve(true)">
        {{ $t('AIPermissionDialog.allow') }}
      </ButtonComponent>
    </template>
  </ModalDialog>
</template>
