import {test, expect} from '@playwright/test';

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
  await expect(page.getByTestId('weekly-categories-chart')).toBeVisible();
  await expect(page.locator('#weekly-amounts-table')).toBeAttached();
  await expect(page.locator('#weekly-categories-table')).toBeAttached();
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

test('shows achievements', async ({page}) => {
  await page.goto('/');
  await page.getByTestId('home-start-button').click();
  await page.getByTestId('veggie-search-toggle-button').click();
  const elements = (
    await page.getByTestId('veggie-search-group-Fruit').locator('.dropdown-list-option').all()
  ).slice(0, 15);
  for (const element of elements) {
    await element.click();
  }
  await page.getByTestId('dialog-close-button').click();
  await page.getByTestId('navbar-stats-link').click();
  await page.getByTestId('stats-tab-4').click();
  await expect(page.getByTestId('badge-experimenterFruit-3')).not.toHaveClass('badge--locked');
});
