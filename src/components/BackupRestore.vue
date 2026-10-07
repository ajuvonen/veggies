<script lang="ts" setup>
import {nextTick} from 'vue';
import {storeToRefs} from 'pinia';
import {useRouter} from 'vue-router';
import {useI18n} from 'vue-i18n';
import {useFileDialog} from '@vueuse/core';
import {useActivityStore} from '@/stores/activityStore';
import {useAppStateStore} from '@/stores/appStateStore';
import {dateParser, getDataSchema} from '@/utils/helpers';
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

const backupData = () => {
  try {
    const data = {
      weeks: JSON.parse(localStorage.getItem('veggies-weeks') || ''),
      settings: JSON.parse(localStorage.getItem('veggies-settings') || ''),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = t('settings.backupRestore.fileName', {
      timestamp: Temporal.Now.plainDateTimeISO()
        .toString({smallestUnit: 'minute'})
        .replace(/:/g, '-'),
    });
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    URL.revokeObjectURL(url);
    addToastMessage(t('settings.backupRestore.backupSuccess'));
  } catch (err) {
    console.error(err);
    addToastMessage(t('settings.backupRestore.failure'));
  }
};

onChange(async (files) => {
  try {
    const [file] = files ?? [];
    const text = (await file?.text()) || '';
    const dataSchema = await getDataSchema();
    const parsedData = JSON.parse(text, dateParser);

    // Get the restore version, defaulting to 1 if not present
    const restoreVersion: number =
      parsedData.settings?.migrationVersion || MINIMUM_MIGRATION_VERSION;

    // Apply migrations to bring data up to current version
    const migratedData = applyMigrations(parsedData, restoreVersion, CURRENT_MIGRATION_VERSION);

    // Validate the migrated data
    const {weeks: restoreWeeks, settings: restoreSettings} = dataSchema.parse(migratedData);

    weeks.value = restoreWeeks;
    settings.value = restoreSettings;

    await nextTick();

    addToastMessage(t('settings.backupRestore.restoreSuccess'));
    router.push({name: 'log'});
  } catch (err) {
    console.error(err);
    addToastMessage(t('settings.backupRestore.failure'));
  }
});
</script>
<template>
  <ContentElement :label="$t('settings.backupRestore.label')">
    <p id="backup-description">{{ $t('settings.backupRestore.description') }}</p>
    <div class="cluster justify-end flex-wrap">
      <ButtonComponent
        icon="databaseExport"
        color="secondary"
        aria-describedby="backup-description"
        data-test-id="backup-button"
        @click="backupData"
        >{{ $t('settings.backupRestore.backup') }}</ButtonComponent
      >
      <ButtonComponent
        icon="databaseImport"
        color="secondary"
        aria-describedby="backup-description"
        data-test-id="restore-button"
        @click="open"
        >{{ $t('settings.backupRestore.restore') }}</ButtonComponent
      >
    </div>
  </ContentElement>
</template>
