<script lang="ts" setup>
import {nextTick} from 'vue';
import {storeToRefs} from 'pinia';
import {useRouter} from 'vue-router';
import {useI18n} from 'vue-i18n';
import {useFileDialog} from '@vueuse/core';
import {useActivityStore} from '@/stores/activityStore';
import {useAppStateStore} from '@/stores/appStateStore';
import {dateParser, getImportSchema} from '@/utils/helpers';

const {t} = useI18n();

const router = useRouter();

const {startDate, weeks, challenges} = storeToRefs(useActivityStore());
const {settings} = storeToRefs(useAppStateStore());
const {addToastMessage} = useAppStateStore();

const {open, onChange} = useFileDialog({
  accept: 'application/json',
  multiple: false,
});

const exportData = () => {
  try {
    const data = {
      startDate: localStorage.getItem('veggies-start-date'),
      weeks: JSON.parse(localStorage.getItem('veggies-weeks') || ''),
      challenges: JSON.parse(localStorage.getItem('veggies-challenges') || ''),
      settings: JSON.parse(localStorage.getItem('veggies-settings') || ''),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = t('settings.exportImport.fileName');
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    URL.revokeObjectURL(url);
    addToastMessage(t('settings.exportImport.exportSuccess'));
  } catch (err) {
    console.error(err);
    addToastMessage(t('settings.exportImport.failure'));
  }
};

onChange(async (files) => {
  if (!files || files.length === 0) return;

  try {
    const [file] = files;
    const text = (await file?.text()) || '';
    const importSchema = await getImportSchema();
    const {
      startDate: importStartDate,
      weeks: importWeeks,
      challenges: importChallenges,
      settings: importSettings,
    } = importSchema.parse(JSON.parse(text, dateParser));

    startDate.value = importStartDate;
    weeks.value = importWeeks;
    challenges.value = importChallenges;
    settings.value = importSettings;

    await nextTick();

    addToastMessage(t('settings.exportImport.importSuccess'));
    router.push({name: 'log'});
  } catch (err) {
    console.error(err);
    addToastMessage(t('settings.exportImport.failure'));
  }
});
</script>
<template>
  <ContentElement :title="$t('settings.exportImport.label')">
    <p>{{ $t('settings.exportImport.description') }}</p>
    <div class="flex-container justify-end">
      <ButtonComponent
        icon="databaseExport"
        variant="secondary"
        data-test-id="export-button"
        @click="exportData"
        >{{ $t('settings.exportImport.export') }}</ButtonComponent
      >
      <ButtonComponent
        icon="databaseImport"
        variant="secondary"
        data-test-id="import-button"
        @click="open"
        >{{ $t('settings.exportImport.import') }}</ButtonComponent
      >
    </div>
  </ContentElement>
</template>
