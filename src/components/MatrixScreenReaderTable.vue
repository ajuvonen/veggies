<script lang="ts" setup>
defineProps<{
  title: string;
  columnHeaders: (number | string)[];
  data: (number | string)[][];
  rowHeaders: (number | string)[];
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
          <th />
          <th v-for="header in columnHeaders" :key="header">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(header, headerIndex) in rowHeaders" :key="headerIndex">
          <th>{{ header }}</th>
          <td v-for="(_, dataIndex) in columnHeaders" :key="dataIndex">
            {{ data[headerIndex]?.[dataIndex] ?? '' }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
