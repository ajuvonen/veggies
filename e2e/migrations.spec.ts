import {test, expect} from './fixtures';

const today = Temporal.Now.plainDateISO();
const thisWeek = today.subtract({days: today.dayOfWeek - 1});
const lastWeek = thisWeek.subtract({weeks: 1});

test('Migrations work', async ({browser}) => {
  const browserContext = await browser.newContext({
    storageState: {
      cookies: [],
      origins: [
        {
          origin: 'http://localhost:5173',
          localStorage: [
            {
              name: 'veggies-start-date',
              value: lastWeek.toString(),
            },
            {
              name: 'veggies-settings',
              value: JSON.stringify({
                allergens: ['peanut'],
                locale: 'en',
                // No migration version, defaults to 1
                showChartAnimations: true,
                suggestionCount: 10,
                summaryViewedDate: thisWeek,
              }),
            },
            {
              name: 'veggies-weeks',
              value: JSON.stringify([
                {
                  veggies: ['apple', 'carrot', 'spinach', 'banana'],
                  startDate: lastWeek,
                },
                {
                  veggies: ['arugula', 'black bean', 'chanterelle', 'iceberg lettuce'],
                  startDate: thisWeek,
                },
              ]),
            },
            {
              name: 'veggies-challenges',
              value: JSON.stringify([
                {
                  startDate: lastWeek,
                  veggie: 'apple',
                },
                {
                  startDate: thisWeek,
                  veggie: 'lychee',
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
    await expect(page.getByTestId('category-status-chart-center-label')).toHaveText(
      'This Week 4 Veggies',
    );
    await page.getByTestId('navbar-stats-link').click();
    await expect(page.getByTestId('all-time-status-totalWeeks')).toHaveText('In Total 2 Weeks');
    await expect(page.getByTestId('all-time-status-over30Veggies')).toHaveText(
      'Over 30 Veggies in 0 Weeks',
    );
    await expect(page.getByTestId('all-time-status-uniqueVeggies')).toHaveText(
      'In Total 8 Unique Veggies',
    );
    await expect(page.getByTestId('all-time-status-atMostVeggies')).toHaveText(
      'At Most 4 Weekly Veggies',
    );
    await expect(page.getByTestId('all-time-status-completedChallenges')).toHaveText(
      'Completed 1 Weekly Challenge',
    );
  } finally {
    await browserContext.close();
  }
});
