import { expect, type Page } from '@playwright/test';

export const logIn = async (
  page: Page,
  userName: string = 'Playwright Tester',
  expectedUserText = 'Playwright Tester',
) => {
  // Log in
  await page.getByRole('button', { name: 'divaClient_LoginText' }).click();
  await page.getByRole('menuitem', { name: userName }).click();
  await expect(
    page.getByRole('button', { name: expectedUserText }),
  ).toBeVisible();
};
