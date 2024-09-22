import {test, expect} from '@playwright/test';

// See here how to get started:
// https://playwright.dev/docs/intro
test('logs veggies', async ({page}) => {
  await page.goto('/');
  await page.getByTestId('home-start-button').click();
  await page.getByTestId('veggie-search-button').click();
  await expect(page.getByTestId('veggie-search-options')).toBeVisible();
  await page.getByTestId('veggie-search-option-apple').click();
  await expect(page.getByText(/^First veggie added!/)).toBeVisible();
  await expect(page.getByTestId('category-status-center-label')).toHaveText('This Week 1 Veggies');
  await page.getByTestId('veggie-search-option-apricot').click();
  await expect(page.getByTestId('category-status-center-label')).toHaveText('This Week 2 Veggies');

  const elements = await page.getByTestId('toast-message').all();
  for (const element of elements) {
    await element.click();
  }

  await expect(page.getByTestId('toast-message')).toBeHidden();
  await page.getByTestId('navbar-link-settings').click();
  await page.getByTestId('navbar-link-log').click();
  await expect(page.getByTestId('category-status-center-label')).toHaveText('This Week 2 Veggies');
});

test('filters veggies', async ({page}) => {
  await page.goto('/');
  await page.getByTestId('home-start-button').click();
  await page.getByTestId('veggie-search-input').fill('cher');
  await expect(page.getByTestId('veggie-search-option-cherry')).toBeVisible();
  await expect(page.getByTestId('veggie-search-option-cherry tomato')).toBeVisible();
});

test('filters veggies in Finnish', async ({page}) => {
  await page.goto('/');
  await page.getByTestId('home-locale-button-fi').click();
  await page.getByTestId('home-start-button').click();
  await page.getByTestId('veggie-search-input').fill('kirsi');
  await expect(page.getByTestId('veggie-search-option-cherry')).toBeVisible();
  await expect(page.getByTestId('veggie-search-option-cherry tomato')).toBeVisible();
});

test('weekly challenges work', async ({page}) => {
  await page.goto('/');
  await page.getByTestId('home-start-button').click();
  await page.getByTestId('veggie-search-button').click();
  await expect(page.getByTestId('veggie-search-challenges')).toBeHidden();
  await page.getByTestId('veggie-search-option-apple').click();
  await expect(page.getByTestId('veggie-search-challenge')).toBeVisible();
  await page.getByTestId('veggie-search-challenge').locator('.veggie-search__option').click();
  await expect(page.getByText(/^You have completed your weekly challenge!/)).toBeVisible();
});

test('achievement notifications work', async ({page}) => {
  await page.goto('/');
  await page.getByTestId('home-start-button').click();
  await page.getByTestId('veggie-search-button').click();
  const elements = (
    await page.getByTestId('veggie-search-group-Fruit').locator('.veggie-search__option').all()
  ).slice(0, 15);
  for (const element of elements) {
    await element.click();
  }
  await expect(page.getByTestId('dialog')).toBeVisible();
  await expect(page.getByTestId('badge-experimenterFruit-3')).toBeVisible();
  await page.getByTestId('dialog-close-button').click();
  await expect(page.getByTestId('dialog')).toBeHidden();
});