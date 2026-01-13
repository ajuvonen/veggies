<script lang="ts" setup>
import {ref} from 'vue';
import {storeToRefs} from 'pinia';
import {TabGroup, TabList, Tab, TabPanels, TabPanel} from '@headlessui/vue';
import {useActivityStore} from '@/stores/activityStore';
import type {IconString} from '@/components/ui/IconComponent.vue';
import WeeklyCharts from '@/components/WeeklyCharts.vue';
import AllTimeStatus from '@/components/AllTimeStatus.vue';
import CategoryStatusChart from '@/components/charts/CategoryStatusChart.vue';
import AchievementList from '@/components/AchievementList.vue';
import VeggieList from '@/components/VeggieList.vue';
import WeekEditor from '@/components/WeekEditor.vue';

const {allVeggies, uniqueVeggies, favorites, achievements} = storeToRefs(useActivityStore());

const selectedStat = ref(0);

const tabIcons: IconString[] = [
  'history',
  'chartLine',
  'calendarWeek',
  'formatListChecks',
  'trophy',
] as const;
</script>
<template>
  <TabGroup :selectedIndex="selectedStat" @change="(index) => (selectedStat = index)">
    <TabList class="grid grid-cols-5 gap-2">
      <Tab
        v-for="(iconString, index) in tabIcons"
        :key="iconString"
        v-slot="{selected}"
        as="template"
      >
        <ButtonComponent
          v-tippy="{content: $t(`stats.${index}`), placement: 'bottom', offset: [0, -8]}"
          :aria-label="$t(`stats.${index}`)"
          :class="{'!bg-[--color-primary-active]': selected}"
          :data-test-id="`stats-tab-${index}`"
          class="justify-center"
        >
          <IconComponent :icon="iconString" />
        </ButtonComponent>
      </Tab>
    </TabList>
    <TabPanels class="flex grow min-h-0">
      <TabPanel class="stats__tab">
        <AllTimeStatus />
        <CategoryStatusChart
          :favorites="favorites"
          :veggies="allVeggies"
          alternateColorScheme
          topLabelKey="categoryStatus.topLabelTotal"
          bottomLabelKey="categoryStatus.bottomLabelTotal"
        />
      </TabPanel>
      <TabPanel :as="WeeklyCharts" class="stats__tab" />
      <TabPanel :as="WeekEditor" class="stats__tab" />
      <TabPanel :as="VeggieList" :uniqueVeggies="uniqueVeggies" class="stats__tab" />
      <TabPanel :as="AchievementList" :achievements="achievements" class="stats__tab" />
    </TabPanels>
  </TabGroup>
</template>
<style scoped>
.stats__tab {
  @apply w-full;
  @apply flex flex-col gap-4;
}
</style>
