import {test, expect} from '@playwright/test';

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
    'Etsi kasviksia',
  );
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
  await page.getByTestId('qa-button-appPurpose').click();
  await page.getByTestId('qa-button-contact').click();
  await expect(page.getByTestId('qa-panel-appPurpose')).toBeHidden();
  await expect(page.getByTestId('qa-panel-contact')).toBeHidden();
});
