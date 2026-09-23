<script lang="ts" setup>
defineProps<{
  title: string;
  columnHeaders: (number | string)[];
  data: (number | string)[];
}>();
</script>
<template>
  <div class="sr-only">
    <table>
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
  </div>
</template>
