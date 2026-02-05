import { expect } from '@playwright/test';
import { test } from './util/fixtures';

test.describe('Landing page', () => {
  test('Should load the landing page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('divaText');

    await expect(page.getByRole('heading', { level: 1 }), {
      message: 'Title',
    }).toHaveText('divaText');

    await expect(
      page.getByRole('link', {
        name: 'diva-outputPluralText divaClient_navigationCardPublicationDescriptionText',
      }),
    ).toBeVisible();
    await expect(
      page.getByRole('link', {
        name: 'diva-personPluralText divaClient_navigationCardPersonDescriptionText',
      }),
    ).toBeVisible();
    await expect(
      page.getByRole('link', {
        name: 'diva-projectPluralText divaClient_navigationCardProjectDescriptionText',
      }),
    ).toBeVisible();
  });
});
