<script lang="ts" setup>
import {defineAsyncComponent} from 'vue';
import {storeToRefs} from 'pinia';
import {TabsContent, TabsList, TabsRoot, TabsTrigger} from 'reka-ui';
import {useActivityStore} from '@/stores/activityStore';
import type {IconString} from '@/components/ui/IconComponent.vue';
import AsyncLoader from '@/components/AsyncLoader.vue';
import AllTimeStatus from '@/components/AllTimeStatus.vue';

const WeeklyCharts = defineAsyncComponent(() => import('@/components/WeeklyCharts.vue'));
const WeekEditor = defineAsyncComponent(() => import('@/components/WeekEditor.vue'));
const VeggieList = defineAsyncComponent(() => import('@/components/VeggieList.vue'));
const AchievementList = defineAsyncComponent(() => import('@/components/AchievementList.vue'));

const {uniqueVeggies, achievements} = storeToRefs(useActivityStore());

const tabIcons: IconString[] = [
  'history',
  'chartLine',
  'calendarWeek',
  'formatListChecks',
  'trophy',
] as const;
</script>
<template>
  <TabsRoot
    :defaultValue="0"
    class="flex flex-col flex-1 min-h-0 w-full gap-4"
    v-slot="{modelValue}"
  >
    <TabsList class="grid grid-cols-5 gap-2">
      <TabsTrigger v-for="(iconString, index) in tabIcons" :key="iconString" :value="index" asChild>
        <ButtonComponent
          v-tippy="{content: $t(`stats.${index}`), placement: 'bottom', offset: [0, -8]}"
          :class="{'!bg-[--color-primary-active]': modelValue === index}"
          :aria-label="$t(`stats.${index}`)"
          :data-test-id="`stats-tab-${index}`"
          class="justify-center"
        >
          <IconComponent :icon="iconString" />
        </ButtonComponent>
      </TabsTrigger>
    </TabsList>

    <TabsContent :value="0" class="stats__tab">
      <AllTimeStatus />
    </TabsContent>
    <TabsContent :value="1" class="stats__tab">
      <AsyncLoader>
        <WeeklyCharts v-if="(modelValue as number) === 1" />
      </AsyncLoader>
    </TabsContent>
    <TabsContent :value="2" class="stats__tab">
      <AsyncLoader>
        <WeekEditor v-if="(modelValue as number) === 2" />
      </AsyncLoader>
    </TabsContent>
    <TabsContent :value="3" class="stats__tab stats__tab--scrolling">
      <AsyncLoader>
        <VeggieList v-if="(modelValue as number) === 3" :uniqueVeggies="uniqueVeggies" />
      </AsyncLoader>
    </TabsContent>
    <TabsContent :value="4" class="stats__tab stats__tab--scrolling">
      <AsyncLoader>
        <AchievementList v-if="(modelValue as number) === 4" :achievements="achievements" />
      </AsyncLoader>
    </TabsContent>
  </TabsRoot>
</template>
<style scoped>
.stats__tab[data-state='active'] {
  @apply flex flex-col grow min-h-0 gap-4;
}

.stats__tab--scrolling {
  @apply has-scroll has-scroll--flush overflow-x-hidden;
}
</style>
