<script lang="ts" setup>
import {ref} from 'vue';
import {storeToRefs} from 'pinia';
import {TabGroup, TabList, Tab, TabPanels, TabPanel} from '@headlessui/vue';
import {hideAll} from 'vue-tippy';
import {useActivityStore} from '@/stores/activityStore';
import WeeklyAmountsChart from '@/components/charts/WeeklyAmountsChart.vue';
import WeeklyCategoriesChart from '@/components/charts/WeeklyCategoriesChart.vue';
import AllTimeStatus from '@/components/AllTimeStatus.vue';
import CategoryStatusChart from '@/components/charts/CategoryStatusChart.vue';
import AchievementList from '@/components/AchievementList.vue';
import VeggieList from '@/components/VeggieList.vue';
import WeekEditor from '@/components/WeekEditor.vue';

const {allVeggies, uniqueVeggies, favorites} = storeToRefs(useActivityStore());

const selectedStat = ref(0);

const icons = ['calendarWeekOutline', 'chartLine', 'history', 'formatListChecks', 'trophyOutline'];
</script>
<template>
  <h1 class="sr-only">{{ $t('views.stats') }}</h1>
  <TabGroup :selectedIndex="selectedStat" @change="(index) => (selectedStat = index)">
    <TabList class="grid grid-cols-5 gap-2">
      <Tab v-for="(_, index) in [...Array(5)]" :key="index" v-slot="{selected}" as="template">
        <ButtonComponent
          v-tippy="$t(`stats.${index}`)"
          :aria-label="$t(`stats.${index}`)"
          :class="{'!bg-sky-700': selected}"
          :data-test-id="`stats-tab-${index}`"
          class="justify-center"
        >
          <IconComponent :icon="icons[index]" />
        </ButtonComponent>
      </Tab>
    </TabList>
    <TabPanels class="flex flex-grow min-h-0">
      <TabPanel class="stats__tab">
        <WeekEditor />
      </TabPanel>
      <TabPanel class="stats__tab">
        <WeeklyAmountsChart />
        <WeeklyCategoriesChart />
      </TabPanel>
      <TabPanel class="stats__tab">
        <AllTimeStatus />
        <CategoryStatusChart totals :favorites="favorites" :veggies="allVeggies" />
      </TabPanel>
      <TabPanel as="template">
        <VeggieList :uniqueVeggies="uniqueVeggies" />
      </TabPanel>
      <TabPanel :as="AchievementList" @scroll="hideAll" />
    </TabPanels>
  </TabGroup>
</template>
<style lang="scss" scoped>
.stats__tab {
  @apply w-full;
  @apply flex-container flex-col gap-4;
}
</style>
