<script lang="ts" setup>
defineProps<{
  title: string;
  columnHeaders: (number | string)[];
  data: (number | string)[][];
  rowHeaders?: (number | string)[];
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
        <td v-if="rowHeaders"></td>
        <th v-for="header in columnHeaders" :key="header">{{ header }}</th>
      </tr>
    </thead>
    <tbody>
      <template v-if="rowHeaders">
        <tr v-for="(header, headerIndex) in rowHeaders" :key="headerIndex">
          <th>{{ header }}</th>
          <td v-for="(_, dataIndex) in columnHeaders" :key="dataIndex">
            {{ data[headerIndex]?.[dataIndex] ?? '' }}
          </td>
        </tr>
      </template>
      <tr v-else>
        <td v-for="(_, index) in columnHeaders" :key="index">{{ data[0]?.[index] ?? '' }}</td>
      </tr>
    </tbody>
  </table>
</template>
