import {test, expect} from '@playwright/test';
import {DateTime} from 'luxon';

const thisWeek = DateTime.now().startOf('week');
const lastWeek = thisWeek.minus({weeks: 1});

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
              value: lastWeek.toISODate(),
            },
            {
              name: 'veggies-settings',
              value: JSON.stringify({
                allergens: ['peanut'],
                locale: 'en',
                // No migration version, defaults to 1
                showChartAnimations: true,
                suggestionCount: 10,
                summaryViewedDate: thisWeek.toISODate(),
              }),
            },
            {
              name: 'veggies-weeks',
              value: JSON.stringify([
                {
                  veggies: ['apple', 'carrot', 'spinach', 'banana'],
                  startDate: lastWeek.toISODate(),
                },
                {
                  veggies: ['arugula', 'black bean', 'chanterelle', 'iceberg lettuce'],
                  startDate: thisWeek.toISODate(),
                },
              ]),
            },
            {
              name: 'veggies-challenges',
              value: JSON.stringify([
                {
                  startDate: lastWeek.toISODate(),
                  veggie: 'apple',
                },
                {
                  startDate: thisWeek.toISODate(),
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
  await browserContext.close();
});
