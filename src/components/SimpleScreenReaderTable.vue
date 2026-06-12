<script lang="ts" setup>
defineProps<{
  title: string;
  columnHeaders: (number | string)[];
  data: (number | string)[];
}>();
</script>
<template>
  <table class="sr-only">
    <caption>
      {{
        title
      }}
    </caption>
    <thead>
      <tr>
        <th v-for="header in columnHeaders" :key="header">{{ header }}</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td v-for="(_, index) in columnHeaders" :key="index">
          {{ data[index] }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
