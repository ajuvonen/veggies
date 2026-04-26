import {test, expect, defaultSettings} from './fixtures';

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

test('achievement notifications work', async ({browser}) => {
  const browserContext = await browser.newContext({
    storageState: {
      cookies: [],
      origins: [
        {
          origin: 'http://localhost:5173',
          localStorage: [
            {
              name: 'veggies-settings',
              value: JSON.stringify(defaultSettings),
            },
            {
              name: 'veggies-weeks',
              value: JSON.stringify([
                {
                  veggies: [
                    'apple',
                    'apricot',
                    'asian pear',
                    'banana',
                    'bilberry',
                    'blackberry',
                    'blackcurrant',
                    'blood grapefruit',
                    'blood orange',
                    'blueberry',
                    'boysenberry',
                    'calamansi',
                    'cantaloupe',
                    'cape gooseberry',
                  ],
                  startDate: defaultSettings.startDate,
                  challenge: 'apple',
                },
              ]),
            },
          ],
        },
      ],
    },
  });

  try {
    const page = await browserContext.newPage();
    await page.goto('/');
    await page.getByTestId('veggie-search-toggle-button').click();
    await page.getByTestId('veggie-search-option-cherry').click();
    await expect(page.getByTestId('dialog')).toBeVisible();
    await expect(page.getByTestId('badge-experimenterFruit-3')).toBeVisible();
    await page.getByTestId('dialog-close-button').click();
    await expect(page.getByTestId('dialog')).toBeHidden();
  } finally {
    await browserContext.close();
  }
});

test('weekly achievement works', async ({browser}) => {
  const browserContext = await browser.newContext({
    storageState: {
      cookies: [],
      origins: [
        {
          origin: 'http://localhost:5173',
          localStorage: [
            {
              name: 'veggies-settings',
              value: JSON.stringify(defaultSettings),
            },
            {
              name: 'veggies-weeks',
              value: JSON.stringify([
                {
                  veggies: [
                    'apple',
                    'banana',
                    'cherry',
                    'kiwi',
                    'lemon',
                    'lime',
                    'mango',
                    'orange',
                    'peach',
                    'pear',
                    'pineapple',
                    'raspberry',
                    'strawberry',
                    'watermelon',
                    'blueberry',
                    'tomato',
                    'bell pepper',
                    'broccoli',
                    'cucumber',
                    'spinach',
                    'kale',
                    'lettuce',
                    'arugula',
                    'carrot',
                    'potato',
                    'onion',
                    'chickpea',
                    'green bean',
                    'almond',
                  ],
                  startDate: defaultSettings.startDate,
                  challenge: 'apple',
                },
              ]),
            },
          ],
        },
      ],
    },
  });

  try {
    const page = await browserContext.newPage();
    await page.goto('/');
    await page.getByTestId('veggie-search-toggle-button').click();
    await page.getByTestId('veggie-search-option-apricot').click();
    await expect(page.getByTestId('dialog')).toBeVisible();
    await expect(page.getByTestId('badge-thirtyVeggies-3')).toBeVisible();
    await page.getByTestId('dialog-close-button').click();
    await expect(page.getByTestId('dialog')).toBeHidden();
  } finally {
    await browserContext.close();
  }
});

test('shows week summary dialog for previous week data', async ({browser}) => {
  const today = Temporal.Now.plainDateISO();
  const previousWeekStart = today.subtract({days: today.dayOfWeek - 1}).subtract({weeks: 1});

  const browserContext = await browser.newContext({
    storageState: {
      cookies: [],
      origins: [
        {
          origin: 'http://localhost:5173',
          localStorage: [
            {
              name: 'veggies-settings',
              value: JSON.stringify({...defaultSettings, startDate: previousWeekStart}),
            },
            {
              name: 'veggies-weeks',
              value: JSON.stringify([
                {
                  veggies: ['apple', 'carrot', 'spinach', 'banana'],
                  startDate: previousWeekStart,
                  challenge: 'apple',
                },
              ]),
            },
          ],
        },
      ],
    },
  });

  try {
    const page = await browserContext.newPage();
    await page.goto('/');
    await expect(page.getByTestId('dialog')).toBeVisible();
    await expect(page.getByTestId('dialog-title')).toContainText(
      `All done for week ${previousWeekStart.weekOfYear}!`,
    );
    await expect(page.getByTestId('category-status-chart-center-label')).toContainText(
      'Last Week 4 Veggies',
    );
    await page.getByTestId('week-summary-dialog-close-button').click();
    await expect(page.getByTestId('dialog')).toBeHidden();
    await expect(page.getByTestId('front-page-animation')).toBeVisible();
  } finally {
    await browserContext.close();
  }
});
