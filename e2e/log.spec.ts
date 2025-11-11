import {test, expect} from '@playwright/test';
import {DateTime} from 'luxon';

// See here how to get started:
// https://playwright.dev/docs/intro
test('logs veggies', async ({page}) => {
  await page.goto('/');
  await page.getByTestId('home-start-button').click();
  await page.getByTestId('veggie-search-toggle-button').click();
  await expect(page.getByTestId('veggie-search-options')).toBeVisible();
  await page.getByTestId('veggie-search-option-apple').click();
  await expect(page.getByText(/^First veggie added!/)).toBeVisible();
  await expect(page.getByTestId('category-status-chart-center-label')).toHaveText(
    'This Week 1 Veggie',
  );
  await page.getByTestId('veggie-search-option-apricot').click();
  await expect(page.getByTestId('category-status-chart-center-label')).toHaveText(
    'This Week 2 Veggies',
  );

  await page.getByTestId('navbar-settings-link').click();
  await page.getByTestId('navbar-log-link').click();
  await expect(page.getByTestId('category-status-chart-center-label')).toHaveText(
    'This Week 2 Veggies',
  );
});

test('filters veggies', async ({page}) => {
  await page.goto('/');
  await page.getByTestId('home-start-button').click();
  await page.getByTestId('veggie-search-input').fill('cher');
  await expect(page.getByTestId('veggie-search-option-cherry')).toBeVisible();
  await expect(page.getByTestId('veggie-search-option-cherry tomato')).toBeVisible();
  await page.getByTestId('veggie-search-input').fill('bil');
  await expect(page.getByTestId('veggie-search-option-bilberry')).toBeVisible();
});

test('filters veggies in Finnish', async ({page}) => {
  await page.goto('/');
  await page.getByTestId('home-locale-button-fi').click();
  await page.getByTestId('home-start-button').click();
  await page.getByTestId('veggie-search-input').fill('kirsi');
  await expect(page.getByTestId('veggie-search-option-cherry')).toBeVisible();
  await expect(page.getByTestId('veggie-search-option-cherry tomato')).toBeVisible();
});

test('clears search', async ({page}) => {
  await page.goto('/');
  await page.getByTestId('home-start-button').click();
  await page.getByTestId('veggie-search-input').fill('cher');
  await expect(page.getByTestId('veggie-search-clear-button')).toBeVisible();
  await page.getByTestId('veggie-search-clear-button').click();
  await expect(page.getByTestId('veggie-search-input')).toHaveValue('');
});

test('weekly challenges work', async ({page}) => {
  await page.goto('/');
  await page.getByTestId('home-start-button').click();
  await page.getByTestId('veggie-search-toggle-button').click();
  await expect(page.getByTestId('veggie-search-challenge')).toBeHidden();
  await page.getByTestId('veggie-search-option-apple').click();
  await expect(page.getByTestId('veggie-search-challenge')).toBeVisible();
  await page.getByTestId('veggie-search-challenge').locator('.dropdown-list-option').click();
  await expect(page.getByText(/^You have completed your weekly challenge!/)).toBeVisible();
});

test('achievement notifications work', async ({page}) => {
  await page.goto('/');
  await page.getByTestId('home-start-button').click();
  await page.getByTestId('veggie-search-toggle-button').click();
  const elements = (
    await page.getByTestId('veggie-search-group-Fruit').locator('.dropdown-list-option').all()
  ).slice(0, 15);
  for (const element of elements) {
    await element.click();
  }
  await expect(page.getByTestId('dialog')).toBeVisible();
  await expect(page.getByTestId('badge-experimenterFruit-3')).toBeVisible();
  await page.getByTestId('dialog-close-button').click();
  await expect(page.getByTestId('dialog')).toBeHidden();
});

test('weekly achievement works', async ({page}) => {
  await page.goto('/');
  await page.getByTestId('home-start-button').click();
  await page.getByTestId('veggie-search-toggle-button').click();
  const fruits = (
    await page.getByTestId('veggie-search-group-Fruit').locator('.dropdown-list-option').all()
  ).slice(0, 10);
  const vegetables = (
    await page.getByTestId('veggie-search-group-Vegetable').locator('.dropdown-list-option').all()
  ).slice(0, 10);
  const grains = (
    await page.getByTestId('veggie-search-group-Grain').locator('.dropdown-list-option').all()
  ).slice(0, 10);
  for (const element of fruits.concat(vegetables, grains)) {
    await element.click();
  }
  await expect(page.getByTestId('dialog')).toBeVisible();
  await expect(page.getByTestId('badge-thirtyVeggies-3')).toBeVisible();
  await page.getByTestId('dialog-close-button').click();
  await expect(page.getByTestId('dialog')).toBeHidden();
});

test('shows week summary dialog for previous week data', async ({browser}) => {
  const previousWeekStart = DateTime.now().startOf('week').minus({weeks: 1});
  const previousWeekStartISO = previousWeekStart.toISODate();

  const browserContext = await browser.newContext({
    storageState: {
      cookies: [],
      origins: [
        {
          origin: 'http://localhost:5173',
          localStorage: [
            {
              name: 'veggies-start-date',
              value: previousWeekStartISO,
            },
            {
              name: 'veggies-settings',
              value: JSON.stringify({
                allergens: [],
                locale: 'en',
                showChartAnimations: true,
                suggestionCount: 10,
                summaryViewedDate: null,
              }),
            },
            {
              name: 'veggies-weeks',
              value: JSON.stringify([
                {
                  veggies: ['apple', 'carrot', 'spinach', 'banana'],
                  startDate: previousWeekStartISO,
                },
              ]),
            },
            {
              name: 'veggies-challenges',
              value: JSON.stringify([
                {
                  startDate: previousWeekStartISO,
                  veggie: 'apple',
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
  await expect(page.getByTestId('dialog')).toBeVisible();
  await expect(page.getByTestId('dialog-title')).toContainText(
    `All done for week ${previousWeekStart.toFormat('W')}!`,
  );
  await expect(page.getByTestId('category-status-chart-center-label')).toContainText(
    'Last Week 4 Veggies',
  );
  await page.getByTestId('dialog-close-button').click();
  await expect(page.getByTestId('dialog')).toBeHidden();
  await expect(page.getByTestId('front-page-animation')).toBeVisible();
  await browserContext.close();
});
