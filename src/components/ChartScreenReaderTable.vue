<script lang="ts" setup>
defineProps<{
  id: string;
  title: string;
  columnHeaders: string[];
  data: number[][];
  rowHeaders?: string[];
}>();
</script>
<template>
  <table class="sr-only" :id="id">
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
          <td v-for="(value, dataIndex) in data[headerIndex]" :key="dataIndex">{{ value }}</td>
        </tr>
      </template>
      <tr v-else>
        <td v-for="(value, index) in data[0]" :key="index">{{ value }}</td>
      </tr>
    </tbody>
  </table>
</template>
