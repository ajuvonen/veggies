import {test, expect} from '@playwright/test';
import {DateTime} from 'luxon';
import {readFileSync} from 'fs';
import {fileURLToPath} from 'node:url';

test('locale settings work', async ({page}) => {
  await page.goto('/');
  await page.getByTestId('home-start-button').click();
  await page.getByTestId('navbar-settings-link').click();
  await expect(page).toHaveURL('settings');
  await page.getByTestId('locale-button-fi').click();
  await expect(page.getByText('Tyhjennä')).toBeVisible();
  await page.getByTestId('navbar-log-link').click();
  await expect(page.getByTestId('veggie-search-input')).toHaveAttribute(
    'placeholder',
    'Kirjaa viikon kasvikset',
  );
});

test('allergens work', async ({page}) => {
  await page.goto('/');
  await page.getByTestId('home-start-button').click();
  await page.getByTestId('veggie-search-toggle-button').click();
  await expect(page.getByTestId('veggie-search-option-apple')).toBeVisible();
  await page.getByTestId('veggie-search-option-apricot').click();
  await page.getByTestId('navbar-stats-link').click();
  await page.getByTestId('stats-tab-3').click();
  await expect(page.getByTestId('veggie-list-status-apple')).toBeVisible();
  await page.getByTestId('navbar-settings-link').click();
  await page.getByTestId('veggie-search-toggle-button').click();
  await page.getByTestId('veggie-search-option-apple').click();
  await expect(page.getByTestId('tag-apple')).toBeVisible();
  await page.getByTestId('navbar-log-link').click();
  await page.getByTestId('veggie-search-toggle-button').click();
  await expect(page.getByTestId('veggie-search-option-apple')).toBeHidden();
  await page.getByTestId('navbar-stats-link').click();
  await page.getByTestId('stats-tab-3').click();
  await expect(page.getByTestId('veggie-list-status-apple')).toBeHidden();
});

test('reset works', async ({page}) => {
  await page.goto('/');
  await page.getByTestId('home-start-button').click();
  await page.getByTestId('navbar-settings-link').click();
  await page.getByTestId('locale-button-fi').click();
  await page.getByTestId('reset-button').click();
  await page.getByTestId('confirm-button').click();
  await expect(page).toHaveURL('');
  await expect(page.getByTestId('home-locale-button-fi')).toBeVisible();
});

test('q&a works', async ({page}) => {
  await page.goto('/');
  await page.getByTestId('home-start-button').click();
  await page.getByTestId('navbar-settings-link').click();
  await page.getByTestId('qa-button-appPurpose').click();
  await page.getByTestId('qa-button-contact').click();
  await expect(page.getByTestId('qa-panel-appPurpose')).toBeVisible();
  await expect(page.getByTestId('qa-panel-contact')).toBeVisible();
  await page.getByTestId('qa-button-contact').click();
  await page.getByTestId('qa-button-appPurpose').click();
  await expect(page.getByTestId('qa-panel-appPurpose')).toBeHidden();
  await expect(page.getByTestId('qa-panel-contact')).toBeHidden();
});

test('export works', async ({browser}) => {
  const thisWeekISO = DateTime.now().startOf('week').toISODate();
  const expectedData = JSON.parse(
    readFileSync(fileURLToPath(new URL('./fixtures/EatYourVeggies.json', import.meta.url)), 'utf8'),
  );
  expectedData.settings.summaryViewedDate = thisWeekISO;
  const browserContext = await browser.newContext({
    storageState: {
      cookies: [],
      origins: [
        {
          origin: 'http://localhost:5173',
          localStorage: [
            {
              name: 'veggies-startDate',
              value: '2025-08-04',
            },
            {
              name: 'veggies-settings',
              value: JSON.stringify({
                allergens: ['peanut'],
                locale: 'en',
                showChartAnimations: true,
                suggestionCount: 10,
                summaryViewedDate: thisWeekISO,
              }),
            },
            {
              name: 'veggies-weeks',
              value: JSON.stringify([
                {
                  veggies: ['apple', 'carrot', 'spinach', 'banana'],
                  startDate: '2025-08-04',
                },
                {
                  veggies: ['arugula', 'black bean', 'chanterelle', 'iceberg lettuce'],
                  startDate: '2025-08-11',
                },
              ]),
            },
            {
              name: 'veggies-challenges',
              value: JSON.stringify([
                {
                  startDate: '2025-08-04',
                  veggie: 'apple',
                },
                {
                  startDate: '2025-08-11',
                  veggie: 'lychee',
                },
              ]),
            },
          ],
        },
      ],
    },
  });

  const page = await browserContext.newPage();
  await page.goto('/');
  await page.getByTestId('navbar-settings-link').click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByTestId('export-button').click();
  const download = await downloadPromise;

  const downloadPath = await download.path();
  const exportedData = JSON.parse(readFileSync(downloadPath, 'utf8'));
  expect(exportedData).toEqual(expectedData);
  await browserContext.close();
});
