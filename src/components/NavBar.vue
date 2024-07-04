<script setup lang="ts">
import {RouterLink} from 'vue-router';
</script>
<template>
  <nav class="nav">
    <RouterLink to="/" class="nav__home-link">Eat your veggies</RouterLink>
    <div class="nav__buttons">
      <RouterLink to="/settings">S</RouterLink>
    </div>
  </nav>
</template>
<style scoped lang="scss">
.nav {
  @apply w-full p-4 top-0 fixed;
  @apply flex justify-between items-center;
}

.nav__home-link {
  font-family: 'Bungee Shade', system-ui;
  font-size: 6vw;
  @apply uppercase sm:text-3xl;
}

.nav__buttons {
  @apply flex gap-2;
}
</style>
