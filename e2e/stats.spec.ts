import {test, expect, defaultSettings} from './fixtures';

test('shows all time stats', async ({page}) => {
  await page.goto('/');
  await page.getByTestId('home-start-button').click();
  await page.getByTestId('veggie-search-toggle-button').click();
  await page.getByText('Apricot').click();
  await page.getByTestId('veggie-search-challenge').locator('.dropdown-list-option').click();
  await page.getByTestId('navbar-stats-link').click();
  await expect(page.getByTestId('all-time-status-totalWeeks')).toHaveText('In Total 1 Week');
  await expect(page.getByTestId('all-time-status-over30Veggies')).toHaveText(
    'Over 30 Veggies in 0 Weeks',
  );
  await expect(page.getByTestId('all-time-status-uniqueVeggies')).toHaveText(
    'In Total 2 Unique Veggies',
  );
  await expect(page.getByTestId('all-time-status-atMostVeggies')).toHaveText(
    'At Most 2 Weekly Veggies',
  );
  await expect(page.getByTestId('all-time-status-completedChallenges')).toHaveText(
    'Completed 1 Weekly Challenge',
  );
});

test('shows weekly statistics', async ({page}) => {
  await page.goto('/');
  await page.getByTestId('home-start-button').click();
  await page.getByTestId('veggie-search-toggle-button').click();
  await page.getByText('Apricot').click();
  await page.getByTestId('navbar-stats-link').click();
  await page.getByTestId('stats-tab-1').click();
  await expect(page.getByTestId('weekly-amounts-chart')).toBeVisible();
  await expect(page.getByTestId('weekly-amounts-table')).toBeAttached();
  await page.getByTestId('statistic-selector-1').click();
  await expect(page.getByTestId('weekly-categories-chart')).toBeVisible();
  await expect(page.getByTestId('weekly-categories-table')).toBeAttached();
  await page.getByTestId('statistic-selector-2').click();
  await expect(page.getByTestId('weekly-heatmap')).toBeVisible();
  await expect(page.getByTestId('weekly-heatmap-table')).toBeAttached();
});

test("shows current week's veggies", async ({page}) => {
  await page.goto('/');
  await page.getByTestId('home-start-button').click();
  await page.getByTestId('veggie-search-toggle-button').click();
  await page.getByText(/^apple$/).click();
  await page.getByText('Apricot').click();
  await page.getByText('Avocado').click();
  await page.getByTestId('navbar-stats-link').click();
  await page.getByTestId('stats-tab-2').click();
  await expect(page.getByTestId('tag-apple')).toBeVisible();
  await expect(page.getByTestId('tag-apricot')).toBeVisible();
  await expect(page.getByTestId('tag-avocado')).toBeVisible();
  await page.getByTestId('tag-apple').click();
  await page.getByTestId('tag-apricot').click();
  await expect(page.getByTestId('tag-apple')).toBeHidden();
  await expect(page.getByTestId('tag-apricot')).toBeHidden();
  await page.getByTestId('navbar-log-link').click();
  await expect(page.getByTestId('category-status-chart-center-label')).toHaveText(
    'This Week 1 Veggie',
  );
});

test('shows veggie list', async ({page}) => {
  await page.goto('/');
  await page.getByTestId('home-start-button').click();
  await page.getByTestId('veggie-search-toggle-button').click();
  await page.getByText('Apricot').click();
  await page.getByTestId('navbar-stats-link').click();
  await page.getByTestId('stats-tab-3').click();
  await expect(page.getByTestId('veggie-list-status-apricot')).toHaveText('(complete)');
});

test('shows achievements', async ({browser}) => {
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
                    'cherry',
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
    await page.getByTestId('navbar-stats-link').click();
    await page.getByTestId('stats-tab-4').click();
    await expect(page.getByTestId('badge-experimenterFruit-3')).not.toContainClass('badge--locked');
    await expect(page.getByTestId('badge-experimenterRoot-3')).toContainClass('badge--locked');
  } finally {
    await browserContext.close();
  }
});
