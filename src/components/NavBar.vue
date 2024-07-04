<script setup lang="ts">
import {RouterLink} from 'vue-router';
</script>
<template>
  <nav class="nav">
    <RouterLink to="/" class="nav__home-link">Eat your veggies</RouterLink>
  </nav>
</template>
<style scoped lang="scss">
.nav {
  @apply w-full p-4 top-0 fixed;
  @apply flex;
}

.nav__home-link {
  font-family: 'Bungee Shade', system-ui;
  font-size: 6vw;
  @apply uppercase sm:text-3xl;
}
</style>
