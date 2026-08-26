import {test, expect} from './fixtures';

test('navigates to privacy page from home link and back', async ({page}) => {
  await page.goto('/');
  await page.getByTestId('privacy-policy-link').click();
  await expect(page).toHaveURL('privacy');
  await page.getByTestId('navbar-back-link').click();
  await expect(page).toHaveURL('');
});

test('navigates to privacy page directly and back to home', async ({page}) => {
  await page.goto('privacy');
  await expect(page).toHaveURL('privacy');
  await page.getByTestId('navbar-back-link').click();
  await expect(page).toHaveURL('');
});

test('navigates to privacy page after starting to use the app and back to log', async ({page}) => {
  await page.goto('/');
  await page.getByTestId('home-start-button').click();
  await expect(page).toHaveURL('log');
  await page.goto('privacy');
  await expect(page).toHaveURL('privacy');
  await page.getByTestId('navbar-back-link').click();
  await expect(page).toHaveURL('log');
});
