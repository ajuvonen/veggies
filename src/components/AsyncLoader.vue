<template>
  <Suspense>
    <slot />
    <template #fallback>
      <SpinnerComponent />
    </template>
  </Suspense>
</template>
