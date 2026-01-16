import { expect } from '@playwright/test';
import { test } from './util/fixtures';

test.describe('landing page', () => {
  test('should load the landing pate', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('divaText');

    await expect(page.getByRole('heading', { level: 1 }), {
      message: 'Title',
    }).toHaveText('divaText');

    await expect(
      page.getByRole('link', {
        name: 'divaClient_navigationCardPublicationTitleText',
      }),
    ).toBeVisible();
    await expect(
      page.getByRole('link', {
        name: 'divaClient_navigationCardPersonTitleText',
      }),
    ).toBeVisible();
    await expect(
      page.getByRole('link', {
        name: 'divaClient_navigationCardProjectTitleText',
      }),
    ).toBeVisible();
  });
});
