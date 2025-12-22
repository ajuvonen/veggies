<script lang="ts" setup>
type NumberOrString = number | string;

withDefaults(
  defineProps<{
    title: string;
    columnHeaders: NumberOrString[];
    data: NumberOrString[] | NumberOrString[][];
    rowHeaders?: NumberOrString[];
  }>(),
  {
    rowHeaders: () => [],
  },
);
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
        <td v-if="rowHeaders.length"></td>
        <th v-for="header in columnHeaders" :key="header">{{ header }}</th>
      </tr>
    </thead>
    <tbody>
      <template v-if="rowHeaders.length">
        <tr v-for="(header, headerIndex) in rowHeaders" :key="headerIndex">
          <th>{{ header }}</th>
          <td v-for="(_, dataIndex) in columnHeaders" :key="dataIndex">
            {{ (data as NumberOrString[][])[headerIndex]?.[dataIndex] ?? '' }}
          </td>
        </tr>
      </template>
      <tr v-else>
        <td v-for="(_, index) in columnHeaders" :key="index">
          {{ (data as NumberOrString[])[index] }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
