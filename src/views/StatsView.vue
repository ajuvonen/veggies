<script lang="ts" setup>
import {defineAsyncComponent, ref} from 'vue';
import {storeToRefs} from 'pinia';
import {TabGroup, TabList, Tab, TabPanels, TabPanel} from '@headlessui/vue';
import {useActivityStore} from '@/stores/activityStore';
import type {IconString} from '@/components/ui/IconComponent.vue';
import AsyncLoader from '@/components/AsyncLoader.vue';
import AllTimeStatus from '@/components/AllTimeStatus.vue';

const WeeklyCharts = defineAsyncComponent(() => import('@/components/WeeklyCharts.vue'));
const WeekEditor = defineAsyncComponent(() => import('@/components/WeekEditor.vue'));
const VeggieList = defineAsyncComponent(() => import('@/components/VeggieList.vue'));
const AchievementList = defineAsyncComponent(() => import('@/components/AchievementList.vue'));

const {uniqueVeggies, achievements} = storeToRefs(useActivityStore());

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
      </TabPanel>
      <TabPanel class="stats__tab">
        <AsyncLoader>
          <WeeklyCharts v-if="selectedStat === 1" />
        </AsyncLoader>
      </TabPanel>
      <TabPanel class="stats__tab">
        <AsyncLoader>
          <WeekEditor v-if="selectedStat === 2" />
        </AsyncLoader>
      </TabPanel>
      <TabPanel class="stats__tab stats__tab--scrolling">
        <AsyncLoader>
          <VeggieList v-if="selectedStat === 3" :uniqueVeggies="uniqueVeggies" />
        </AsyncLoader>
      </TabPanel>
      <TabPanel class="stats__tab stats__tab--scrolling">
        <AsyncLoader>
          <AchievementList v-if="selectedStat === 4" :achievements="achievements" />
        </AsyncLoader>
      </TabPanel>
    </TabPanels>
  </TabGroup>
</template>
<style scoped>
.stats__tab {
  @apply flex flex-col gap-4 h-full w-full;
}

.stats__tab--scrolling {
  @apply has-scroll m-0 p-0;
}
</style>
