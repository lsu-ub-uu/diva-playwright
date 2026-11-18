import { expect } from '@playwright/test';
import { test } from '../util/fixtures';
import { createUrl } from '../util/createUrl';

test('redirects authenticated users from the landing page to output search', async ({
    page,
}) => {
    await page.goto(createUrl('/'));

    const expectedPath = createUrl('/diva-output');
    await expect(page).toHaveURL((url) => url.pathname === expectedPath);
    await expect(page).toHaveTitle('diva-outputPluralText');

    await expect(page.getByRole('heading', { level: 1 }), {
        message: 'Title',
    }).not.toHaveText('titleText');

});