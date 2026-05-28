import { Page } from '@playwright/test';
import { createUrl } from './createUrl';

export const goToPageAndWaitForHydration = async (page: Page, path: string) => {
  await page.goto(createUrl(path));
  await page.waitForSelector('body[data-hydrated="true"]');
};
