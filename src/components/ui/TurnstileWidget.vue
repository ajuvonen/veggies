<script setup lang="ts">
import {onBeforeUnmount, onMounted, useTemplateRef} from 'vue';
import {useScriptTag} from '@vueuse/core';
import {TURNSTILE_SCRIPT_URL, TURNSTILE_SITE_KEY} from '@/utils/constants';

const props = defineProps<{action: string}>();

const emit = defineEmits<{
  error: [code: string];
  unsupported: [];
}>();

const model = defineModel<string>({required: true});
const container = useTemplateRef('container');

const {load} = useScriptTag(TURNSTILE_SCRIPT_URL, undefined, {manual: true});

let widgetId: string | undefined;
let pendingReset: {resolve: (token: string) => void; reject: () => void} | undefined;

const turnstileOptions: TurnstileRenderOptions = {
  sitekey: TURNSTILE_SITE_KEY,
  action: props.action,
  callback: (token) => {
    model.value = token;
    pendingReset?.resolve(token);
    pendingReset = undefined;
  },
  'error-callback': (code) => {
    emit('error', code);
    pendingReset?.reject();
    pendingReset = undefined;
  },
  'expired-callback': () => {
    reset().catch(() => {});
  },
  'unsupported-callback': () => {
    emit('unsupported');
    pendingReset?.reject();
    pendingReset = undefined;
  },
};

const remove = () => {
  if (widgetId) {
    window.turnstile?.remove(widgetId);
    widgetId = undefined;
  }
};

const reset = () =>
  new Promise<string>((resolve, reject) => {
    if (!window.turnstile || !widgetId) {
      reject();
      return;
    }
    pendingReset?.reject();
    pendingReset = {resolve, reject};
    model.value = '';
    window.turnstile.reset(widgetId);
  });

onMounted(async () => {
  await load();
  if (container.value) {
    widgetId = window.turnstile?.render(container.value, turnstileOptions);
  }
});

onBeforeUnmount(remove);

defineExpose({reset});
</script>
<template>
  <div ref="container" class="hidden" />
</template>
