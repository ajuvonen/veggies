<script setup lang="ts">
import {BUILD_TIME} from '@/utils/constants';
</script>
<template>
  <div class="text-xs text-center" data-test-id="build-time">Build: {{ BUILD_TIME }}</div>
</template>
