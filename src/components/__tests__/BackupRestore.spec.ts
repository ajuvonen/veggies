import {describe, it, expect, beforeEach, vi, afterEach} from 'vitest';
import {mount, flushPromises} from '@vue/test-utils';
import {useActivityStore} from '@/stores/activityStore';
import {useAppStateStore} from '@/stores/appStateStore';
import {CURRENT_MIGRATION_VERSION} from '@/utils/constants';
import {getWeekStart} from '@/utils/helpers';
import BackupRestore from '@/components/BackupRestore.vue';

// Captures the onChange callback registered during component setup
const fileDialog = {
  onChange: undefined as ((files: FileList | null) => Promise<void>) | undefined,
};

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  open: vi.fn(),
}));

vi.mock('vue-router', async () => ({
  ...(await vi.importActual('vue-router')),
  useRouter: () => ({push: mocks.push}),
}));

vi.mock('@vueuse/core', async () => ({
  ...(await vi.importActual('@vueuse/core')),
  useFileDialog: () => ({
    open: mocks.open,
    onChange: (cb: (files: FileList | null) => Promise<void>) => {
      fileDialog.onChange = cb;
    },
  }),
}));

const triggerRestore = (data: object) => {
  const text = JSON.stringify(data);
  const file = {text: async () => text} as unknown as File;
  return fileDialog.onChange!([file] as unknown as FileList);
};

const startDateIso = getWeekStart().toString();

const validV4Data = {
  weeks: [{startDate: startDateIso, veggies: ['apple', 'carrot'], challenge: 'broccoli'}],
  settings: {
    allergens: [],
    locale: 'en',
    migrationVersion: CURRENT_MIGRATION_VERSION,
    showChartAnimations: true,
    showVeggieFacts: true,
    startDate: startDateIso,
    suggestionCount: 10,
    summaryViewedDate: null,
  },
};

const validV3Data = {
  startDate: startDateIso,
  weeks: [{startDate: startDateIso, veggies: ['apple', 'carrot'], challenge: 'broccoli'}],
  settings: {
    allergens: [],
    locale: 'en',
    migrationVersion: 3,
    showChartAnimations: false,
    showVeggieFacts: true,
    suggestionCount: 5,
    summaryViewedDate: null,
  },
};

describe('BackupRestore', () => {
  let activityStore: ReturnType<typeof useActivityStore>;
  let appStateStore: ReturnType<typeof useAppStateStore>;

  beforeEach(() => {
    activityStore = useActivityStore();
    appStateStore = useAppStateStore();
    vi.spyOn(console, 'error').mockImplementationOnce(() => {});
    fileDialog.onChange = undefined;
    mount(BackupRestore);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('restore', () => {
    it('restores valid data, updates stores, and navigates to log', async () => {
      await triggerRestore(validV4Data);
      await flushPromises();

      expect(activityStore.weeks).toHaveLength(1);
      expect(activityStore.weeks[0]!.veggies).toEqual(['apple', 'carrot']);
      expect(appStateStore.settings.showChartAnimations).toBe(true);
      expect(mocks.push).toHaveBeenCalledWith({name: 'log'});
      expect(appStateStore.addToastMessage).toHaveBeenCalledWith('Data restored successfully.');
    });

    it('migrates data from an older version before restoring', async () => {
      await triggerRestore(validV3Data);
      await flushPromises();

      // v3→v4 migration moves startDate into settings
      expect(appStateStore.settings.startDate).toBeInstanceOf(Temporal.PlainDate);
      expect(appStateStore.settings.showChartAnimations).toBe(false);
      expect(appStateStore.settings.suggestionCount).toBe(5);
      expect(mocks.push).toHaveBeenCalledWith({name: 'log'});
    });

    it('shows an error toast and does not navigate on invalid JSON', async () => {
      await fileDialog.onChange!([
        {text: async () => 'not valid json'} as unknown as File,
      ] as unknown as FileList);
      await flushPromises();

      expect(mocks.push).not.toHaveBeenCalled();
      expect(appStateStore.addToastMessage).toHaveBeenCalledWith(
        'Unexpected error. Data may be corrupted.',
      );
    });

    it('shows an error toast and does not navigate when schema validation fails', async () => {
      const badData = {...validV4Data, settings: {...validV4Data.settings, migrationVersion: 99}};
      await triggerRestore(badData);
      await flushPromises();

      expect(mocks.push).not.toHaveBeenCalled();
      expect(appStateStore.addToastMessage).toHaveBeenCalledWith(
        'Unexpected error. Data may be corrupted.',
      );
    });

    it('shows an error toast when no file is selected', async () => {
      await fileDialog.onChange!(null);
      await flushPromises();

      expect(mocks.push).not.toHaveBeenCalled();
      expect(appStateStore.addToastMessage).toHaveBeenCalledWith(
        'Unexpected error. Data may be corrupted.',
      );
    });
  });

  describe('backup', () => {
    it('starts file download with a timestamped file name', async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-10-07T14:03:22Z'));

      const wrapper = mount(BackupRestore);
      const link = document.createElement('a');
      link.click = vi.fn();
      class MockURL {
        constructor(url: string) {
          return url;
        }
        static createObjectURL = vi.fn(() => 'https://eatyourveggies.app/');
        static revokeObjectURL = vi.fn();
      }

      vi.stubGlobal('URL', MockURL);
      vi.spyOn(document, 'createElement').mockImplementationOnce(() => link);

      wrapper.findByTestId('backup-button').trigger('click');
      await flushPromises();

      expect(link.href).toBe('https://eatyourveggies.app/');
      expect(link.download).toBe(
        `EatYourVeggies-${Temporal.Now.plainDateTimeISO()
          .toString({smallestUnit: 'minute'})
          .replace(/:/g, '-')}.json`,
      );
      expect(link.click).toHaveBeenCalledTimes(1);

      vi.useRealTimers();
    });

    it('shows an error toast when backup fails', async () => {
      const wrapper = mount(BackupRestore);

      vi.spyOn(Storage.prototype, 'getItem').mockImplementationOnce(() => {
        throw new Error('Storage error');
      });

      await wrapper.findByTestId('backup-button').trigger('click');
      await flushPromises();

      expect(appStateStore.addToastMessage).toHaveBeenCalledWith(
        'Unexpected error. Data may be corrupted.',
      );
    });
  });
});
