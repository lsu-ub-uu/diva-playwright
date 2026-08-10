import { test as setup } from '@playwright/test';
import { createUrl } from './util/createUrl';
import { logIn } from './util/logIn';

const { TARGET_URL } = process.env;

const authFile = 'test/.auth/user.json';

setup('authenticate', async ({ page }) => {
  const domain = new URL(TARGET_URL!).hostname;
  await page.context().addCookies([
    {
      name: 'userPreferences',
      value: Buffer.from('{"language":"cimode"}').toString('base64'),
      domain,
      path: '/',
    },
  ]);
  await page.goto(createUrl('/'));
  await logIn(page);
  await page.context().storageState({ path: authFile });
});
