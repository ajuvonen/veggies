<script setup lang="ts">
defineProps<{message: string}>();
const model = defineModel<boolean>({required: true});
const emit = defineEmits<{resolve: [value: boolean]}>();

const resolve = (value: boolean) => {
  emit('resolve', value);
  model.value = false;
};
</script>
<template>
  <ModalDialog v-model="model" :title="$t('permissionDialog.title')">
    <template #content>
      <p>{{ message }}</p>
    </template>
    <template #buttons>
      <ButtonComponent
        color="secondary"
        data-test-id="permission-deny-button"
        @click="resolve(false)"
      >
        {{ $t('permissionDialog.deny') }}
      </ButtonComponent>
      <ButtonComponent data-test-id="permission-allow-button" @click="resolve(true)">
        {{ $t('permissionDialog.allow') }}
      </ButtonComponent>
    </template>
  </ModalDialog>
</template>
