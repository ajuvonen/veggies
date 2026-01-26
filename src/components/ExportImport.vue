<script lang="ts" setup>
import {nextTick} from 'vue';
import {storeToRefs} from 'pinia';
import {useRouter} from 'vue-router';
import {useI18n} from 'vue-i18n';
import {useFileDialog} from '@vueuse/core';
import {useActivityStore} from '@/stores/activityStore';
import {useAppStateStore} from '@/stores/appStateStore';
import {dateParser, getImportSchema} from '@/utils/helpers';
import {CURRENT_MIGRATION_VERSION, MINIMUM_MIGRATION_VERSION} from '@/utils/constants';
import {applyMigrations} from '@/utils/migrations';

const {t} = useI18n();

const router = useRouter();

const {weeks} = storeToRefs(useActivityStore());
const {settings} = storeToRefs(useAppStateStore());
const {addToastMessage} = useAppStateStore();

const {open, onChange} = useFileDialog({
  accept: 'application/json',
  multiple: false,
});

const exportData = () => {
  try {
    const data = {
      weeks: JSON.parse(localStorage.getItem('veggies-weeks') || ''),
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
  try {
    const file = files?.[0];
    const text = (await file?.text()) || '';
    const importSchema = await getImportSchema();
    const parsedData = JSON.parse(text, dateParser);

    // Get the import version, defaulting to 1 if not present
    const importVersion: number =
      parsedData.settings?.migrationVersion || MINIMUM_MIGRATION_VERSION;

    // Apply migrations to bring data up to current version
    const migratedData = applyMigrations(parsedData, importVersion, CURRENT_MIGRATION_VERSION);

    // Validate the migrated data
    const {weeks: importWeeks, settings: importSettings} = importSchema.parse(migratedData);

    weeks.value = importWeeks;
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
    <p id="export-description">{{ $t('settings.exportImport.description') }}</p>
    <div class="flex-container justify-end">
      <ButtonComponent
        icon="databaseExport"
        variant="secondary"
        aria-describedby="export-description"
        data-test-id="export-button"
        @click="exportData"
        >{{ $t('settings.exportImport.export') }}</ButtonComponent
      >
      <ButtonComponent
        icon="databaseImport"
        variant="secondary"
        aria-describedby="export-description"
        data-test-id="import-button"
        @click="open"
        >{{ $t('settings.exportImport.import') }}</ButtonComponent
      >
    </div>
  </ContentElement>
</template>
