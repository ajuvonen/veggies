<script lang="ts" setup>
import {ref} from 'vue';
import {storeToRefs} from 'pinia';
import {TabGroup, TabList, Tab, TabPanels, TabPanel} from '@headlessui/vue';
import {hideAll} from 'vue-tippy';
import {useThrottleFn} from '@vueuse/core';
import {useActivityStore} from '@/stores/activityStore';
import type {IconString} from '@/components/IconComponent.vue';
import WeeklyAmountsChart from '@/components/charts/WeeklyAmountsChart.vue';
import WeeklyCategoriesChart from '@/components/charts/WeeklyCategoriesChart.vue';
import AllTimeStatus from '@/components/AllTimeStatus.vue';
import CategoryStatusChart from '@/components/charts/CategoryStatusChart.vue';
import AchievementList from '@/components/AchievementList.vue';
import VeggieList from '@/components/VeggieList.vue';
import WeekEditor from '@/components/WeekEditor.vue';

const {allVeggies, uniqueVeggies, favorites, achievements} = storeToRefs(useActivityStore());

const selectedStat = ref(0);

const icons: IconString[] = [
  'calendarWeekOutline',
  'chartLine',
  'history',
  'formatListChecks',
  'trophyOutline',
] as const;

const hideTooltips = useThrottleFn(hideAll);
</script>
<template>
  <TabGroup :selectedIndex="selectedStat" @change="(index) => (selectedStat = index)">
    <TabList class="grid grid-cols-5 gap-2">
      <Tab v-for="(_, index) in [...Array(5)]" :key="index" v-slot="{selected}" as="template">
        <ButtonComponent
          v-tippy="$t(`stats.${index}`)"
          :aria-label="$t(`stats.${index}`)"
          :class="{'!bg-[--color-highlight-dark]': selected}"
          :data-test-id="`stats-tab-${index}`"
          class="justify-center"
        >
          <IconComponent :icon="icons[index]" />
        </ButtonComponent>
      </Tab>
    </TabList>
    <TabPanels class="flex grow min-h-0">
      <TabPanel :as="WeekEditor" class="stats__tab" @scroll="hideTooltips" />
      <TabPanel class="stats__tab">
        <WeeklyAmountsChart />
        <WeeklyCategoriesChart />
      </TabPanel>
      <TabPanel class="stats__tab">
        <AllTimeStatus />
        <CategoryStatusChart totals :favorites="favorites" :veggies="allVeggies" />
      </TabPanel>
      <TabPanel
        :as="VeggieList"
        :uniqueVeggies="uniqueVeggies"
        class="stats__tab"
        @scroll="hideTooltips"
      />
      <TabPanel
        :as="AchievementList"
        :achievements="achievements"
        class="stats__tab"
        @scroll="hideTooltips"
      />
    </TabPanels>
  </TabGroup>
</template>
<style scoped>
.stats__tab {
  @apply w-full;
  @apply flex-container flex-col gap-4;
}
</style>
