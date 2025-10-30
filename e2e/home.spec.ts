import {test, expect} from '@playwright/test';

// See here how to get started:
// https://playwright.dev/docs/intro
test('visits the app root url', async ({page}) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('Eat Your Veggies');
  await expect(page).toHaveTitle('Home - Eat Your Veggies');
  await expect(page.getByTestId('home-locale-button-fi')).toBeVisible();
});

test('home page actions work', async ({page}) => {
  await page.goto('/');
  await page.getByTestId('home-locale-button-fi').click();
  await expect(page).toHaveTitle('Etusivu - Eat Your Veggies');
  await expect(page.getByTestId('home-locale-button-en')).toBeVisible();
  await page.getByTestId('home-info-button').click();
  await expect(page.getByTestId('dialog')).toBeVisible();
  await page.getByTestId('dialog-close-button').click();
  await expect(page.getByTestId('dialog')).toBeHidden();
});

test('home is unreachable after start', async ({page}) => {
  await page.goto('/');
  await page.getByTestId('home-start-button').click();
  await expect(page).toHaveURL('log');
  await page.goto('/');
  await expect(page).toHaveURL('log');
});
